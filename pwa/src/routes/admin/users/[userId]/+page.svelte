<script lang="ts">
  import type { PageData } from './$types';
  import {createQuery, useQueryClient} from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type {Card, User} from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import {Button, Checkbox, Helper, Input, Label, Li, List, Modal, MultiSelect} from 'flowbite-svelte';
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  const {t} = getLocalization();
  const client = useQueryClient();

  export let data: PageData;
  let deletePopupOpen = false;
  let editModalOpen = false;

  const user = createQuery<User, Error>({
    queryKey: ['user', data.userId],
    queryFn: () => api.admin.users.show(data.userId),
  });

  const roles = createQuery<Card[], Error>({
    queryKey: ['enum', 'role'],
    queryFn: () => api.common.lookup.type('role'),
  });
  $: roleItems = $roles.data?.map((role) => ({ value: role, name: $t(`enum.role.${role}`) })) ?? [];

  async function deleteUser() {
    await api.admin.users.delete(data.userId);
    await client.invalidateQueries({ queryKey: ['users'] });
    await goto('../users');
  }

  let selectedRoles: number[] = $user?.data?.roles ??[];
  async function updateUser(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as Omit<User, 'id'>;

    // Normalize values
    values.roles = selectedRoles;

    await api.admin.users.update(+data.userId, values);

    editModalOpen = false;
    await client.invalidateQueries({ queryKey: ['users'] });
    await client.invalidateQueries({ queryKey: ['user', data.userId] });
  }
</script>

<div>
  <Button on:click={() => goto('../users')}>{$t('Zurück')}</Button>
</div>
<br />

{#if !data.userId || $user.isLoading}
  <span>{$t('Laden ...')}</span>
{/if}
{#if $user.error}
  <span>{$t('Error: ')}{$user.error.message}</span>
{/if}
{#if $user.isSuccess}
  <h1>{$user.data.id}</h1>
  <div>
    <p>{$t('Benutzername: ')}{$user.data.username}</p>
    <p>{$t('Rollen: ')}</p>
    <List tag="ul" class="space-y-1">
      {#each $user.data.roles as role}
        <Li>{$t(`enum.role.${role}`)}</Li>
      {:else}
        <Li>{$t('Keine Rollen')}</Li>
      {/each}
    </List>
  </div>
  <div>{$user.isFetching ? $t('Im hintergrund aktualisieren ...') : ' '}</div>

  <div class="mt-4 flex">
    <Button on:click={() => (editModalOpen = true)} class="mr-4">{$t('Bearbeiten')}</Button>
    <Modal bind:open={editModalOpen} size="sm" autoclose={false} class="w-full">
      <form class="flex flex-col space-y-6" method="POST" action="?/update" on:submit|preventDefault={updateUser}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{$t('Benutzer bearbeiten')}</h3>
        <Label class="space-y-2">
          <span>{$t('Benutzername')}*</span>
          <Input type="text" name="username" placeholder={$user.data.username} value={$user.data.username} required />
        </Label>
        <Label class="space-y-2">
          <span>{$t('Passwort')}</span>
          <Input type="password" name="password" placeholder="•••••••••" aria-describedby="helper-new-password" />
          <Helper id="helper-new-password" class="ps-6">{$t('Wenn leer, bleibt das gleiche Passwort')}</Helper>
        </Label>
        <Label class="space-y-2">
          <span>{$t('Rollen')}*</span>
          <MultiSelect name="roles" items={roleItems} bind:value={selectedRoles} required />
        </Label>
        <Button type="submit" class="w-full1">{$t('Speichern')}</Button>
      </form>
    </Modal>

    <Button on:click={() => (deletePopupOpen = true)}>{$t('Löschen')}</Button>
    <Modal bind:open={deletePopupOpen} size="xs" autoclose>
      <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{$t('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')}</h3>
        <Button color="red" class="mr-2" on:click={deleteUser}>{$t('Ja, ich bin sicher')}</Button>
        <Button color="alternative">{$t('Nein, abbrechen')}</Button>
      </div>
    </Modal>
  </div>
{/if}
