<script lang="ts">
  import {
    Button, Input,
    Label,
    Modal, MultiSelect,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
  } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import { getLocalization } from '$lib/i18n';
  import type {Card, User} from '$lib/types';
  const {t} = getLocalization();
  const client = useQueryClient();

  let createModalOpen = false;

  const users = createQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => api.admin.users.list(),
  });

  const roles = createQuery<Card[], Error>({
    queryKey: ['enum', 'role'],
    queryFn: () => api.common.lookup.type('role'),
  });
  $: roleItems = $roles.data?.map((role) => ({ value: role, name: $t(`enum.role.${role}`) })) ?? [];

  function gotoDetailPage(id: number): void {
      goto(`./users/${id}`);
  }

  let selectedRoles: number[] = [];
  async function createUser(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as Omit<User, 'id'>;

    // Normalize values
    values.roles = selectedRoles;

    await api.admin.users.create(values);

    createModalOpen = false;
    await client.invalidateQueries({ queryKey: ['users'] });
  }
</script>

<div class="flex justify-end mb-4">
  <Button on:click={() => (createModalOpen = true)} class="ml-auto">{$t('Erstellen')}</Button>
  <Modal bind:open={createModalOpen} size="sm" autoclose={false} class="w-full">
    <form class="flex flex-col space-y-6" method="POST" action="?/create" on:submit|preventDefault={createUser}>
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{$t('Karte erstellen')}</h3>
      <Label class="space-y-2">
        <span>{$t('Benutzername')}*</span>
        <Input type="text" name="username" placeholder={$t('MaxMustermann')} required />
      </Label>
      <Label class="space-y-2">
        <span>{$t('Passwort')}</span>
        <Input type="password" name="password" placeholder="•••••••••" />
      </Label>
      <Label class="space-y-2">
        <span>{$t('Rollen')}*</span>
        <MultiSelect name="roles" items={roleItems} bind:value={selectedRoles} required />
      </Label>
      <Button type="submit" class="w-full1">{$t('Erstellen')}</Button>
    </form>
  </Modal>
</div>

{#if $users.status === 'loading'}
  <span>{$t('Laden ...')}</span>
{:else if $users.status === 'error'}
  <span>{$t('Error: ')}{$users.error.message}</span>
{:else}
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell>{$t('ID')}</TableHeadCell>
      <TableHeadCell>{$t('Benutzername')}</TableHeadCell>
      <TableHeadCell>{$t('Rollen')}</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">{$t('Aktionen')}</span>
      </TableHeadCell>
    </TableHead>
    <TableBody>
      {#each $users.data ?? [] as user, i (user.id)}
        <TableBodyRow on:click={() => gotoDetailPage(user.id)}>
          <TableBodyCell>{user.id}</TableBodyCell>
          <TableBodyCell>{user.username}</TableBodyCell>
          <TableBodyCell>{user.roles.map((role) => $t(`enum.role.${role}`)).join(', ')}</TableBodyCell>
          <TableBodyCell>
            <Button
              on:click={() => gotoDetailPage(user.id)}
              color={
                // We can use the queryCache here to show bold links for ones that are cached
                client.getQueryData(['user', user.id]) ? 'green' : undefined
              }
            >
              {$t('Ansehen')}
            </Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  {#if $users.isFetching}
    <div style="color:darkgreen; font-weight:700">
      {$t('Im hintergrund aktualisieren ...')}
    </div>
  {/if}
{/if}
