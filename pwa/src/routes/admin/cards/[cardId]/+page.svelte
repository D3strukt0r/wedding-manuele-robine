<script lang="ts">
  import type { PageData } from './$types';
  import {createQuery, useQueryClient} from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type {Card, Invitee, User} from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import {Button, Checkbox, Helper, Label, Li, List, Modal, MultiSelect, Select} from 'flowbite-svelte';
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  const {t} = getLocalization();
  const client = useQueryClient();

  export let data: PageData;
  let deletePopupOpen = false;
  let editModalOpen = false;

  const card = createQuery<Card, Error>({
    queryKey: ['card', data.cardId],
    queryFn: () => api.admin.cards.show(data.cardId),
  });

  let limit = 10;
  const invitees = createQuery<Invitee[], Error>({
    queryKey: ['invitees', limit],
    queryFn: () => api.admin.invitees.list(limit),
  });
  $: inviteesItems = $invitees.data?.map((invitee) => ({ value: invitee.id, name: `${invitee.firstname} ${invitee.lastname} (ID: ${invitee.id})` })) ?? [];

  let limit3 = 10;
  const users = createQuery<User[], Error>({
    queryKey: ['users', limit3],
    queryFn: () => api.admin.users.list(limit3),
  });
  $: usersItems = $users.data?.map((user) => ({ value: user.id, name: `${user.username} (ID: ${user.id})` })) ?? [];

  async function deleteCard() {
    await api.admin.cards.delete(data.cardId);
    await client.invalidateQueries({ queryKey: ['cards'] });
    await goto('../cards');
  }

  let selectedInvitees: number[] = $card?.data?.invitees_id ?? [];
  async function updateCard(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as Omit<Card, 'id'>;

    // Normalize values
    values.userLoginId = +values.userLoginId;
    values.invitees_id = selectedInvitees;

    await api.admin.cards.update(+data.cardId, values);

    editModalOpen = false;
    await client.invalidateQueries({ queryKey: ['cards'] });
    await client.invalidateQueries({ queryKey: ['card', data.cardId] });
  }
</script>

<div>
  <Button on:click={() => goto('../cards')}>{$t('Zurück')}</Button>
</div>
<br />

{#if !data.cardId || $card.isLoading}
  <span>{$t('Laden ...')}</span>
{/if}
{#if $card.error}
  <span>{$t('Error: ')}{$card.error.message}</span>
{/if}
{#if $card.isSuccess}
  <h1>{$card.data.id}</h1>
  <div>
    <p>
      {$t('Benutzer ID für Login: ')}
      {#if $card.data.user_login_id}
        {@const user = $users.data?.find((user) => user.id === $card.data.user_login_id)}
        <a href={`../users/${user?.id}`}>{user?.username} ({$t('ID: ')}{user?.id})</a>
      {:else}
        {$t('Keiner')}
      {/if}
    </p>
    <p>{$t('Eingeladene: ')}</p>
    <List tag="ul" class="space-y-1">
      {#each $card.data.invitees_id as invitee_id}
        {@const invitee = $invitees.data?.find((invitee) => invitee.id === invitee_id)}
        <Li>{invitee?.firstname} {invitee?.lastname} ({$t('ID: ')}{invitee?.id})</Li>
      {:else}
        <Li>{$t('Niemand sitzt am Tisch')}</Li>
      {/each}
    </List>
  </div>
  <div>{$card.isFetching ? $t('Im hintergrund aktualisieren ...') : ' '}</div>

  <div class="mt-4 flex">
    <Button on:click={() => (editModalOpen = true)} class="mr-4">{$t('Bearbeiten')}</Button>
    <Modal bind:open={editModalOpen} size="sm" autoclose={false} class="w-full">
      <form class="flex flex-col space-y-6" method="POST" action="?/update" on:submit|preventDefault={updateCard}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{$t('Karte bearbeiten')}</h3>
        <Label class="space-y-2">
          <span>{$t('Benutzer für Login')}</span>
          <Select name="userLoginId" items={usersItems} value={$card.data.user_login_id} placeholder={$t('Option auswählen ...')} />
        </Label>
        <Label class="space-y-2">
          <span>{$t('Eingeladene')}</span>
          <MultiSelect name="invitees_id" items={inviteesItems} bind:value={selectedInvitees} />
        </Label>
        <Button type="submit" class="w-full1">{$t('Speichern')}</Button>
      </form>
    </Modal>

    <Button on:click={() => (deletePopupOpen = true)}>{$t('Löschen')}</Button>
    <Modal bind:open={deletePopupOpen} size="xs" autoclose>
      <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{$t('Sind Sie sicher, dass Sie diese Karte löschen möchten?')}</h3>
        <Button color="red" class="mr-2" on:click={deleteCard}>{$t('Ja, ich bin sicher')}</Button>
        <Button color="alternative">{$t('Nein, abbrechen')}</Button>
      </div>
    </Modal>
  </div>
{/if}
