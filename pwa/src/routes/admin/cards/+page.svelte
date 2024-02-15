<script lang="ts">
  import {
    Button,
    Label,
    Modal, MultiSelect, Select,
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
  import type {Card, Invitee, User} from '$lib/types';
  const {t} = getLocalization();
  const client = useQueryClient();

  let createModalOpen = false;

  const cards = createQuery<Card[], Error>({
    queryKey: ['cards'],
    queryFn: () => api.admin.cards.list(),
  });

  const invitees = createQuery<Invitee[], Error>({
    queryKey: ['invitees'],
    queryFn: () => api.admin.invitees.list(),
  });
  $: inviteesItems = $invitees.data?.records?.map((invitee) => ({ value: invitee.id, name: `${invitee.firstname} ${invitee.lastname} (ID: ${invitee.id})` })) ?? [];

  const users = createQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => api.admin.users.list(),
  });
  $: usersItems = $users.data?.records?.map((user) => ({ value: user.id, name: `${user.username} (ID: ${user.id})` })) ?? [];

  function gotoDetailPage(id: number): void {
      goto(`./cards/${id}`);
  }

  let selectedInvitees: number[] = [];
  async function createCard(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as Omit<Card, 'id'>;

    // Normalize values
    values.userLoginId = +values.userLoginId;
    values.inviteeIds = selectedInvitees;

    await api.admin.cards.create(values);

    createModalOpen = false;
    await client.invalidateQueries({ queryKey: ['cards'] });
  }
</script>

<div class="flex justify-end mb-4">
  <Button on:click={() => (createModalOpen = true)} class="ml-auto">{$t('Erstellen')}</Button>
  <Modal bind:open={createModalOpen} size="sm" autoclose={false} class="w-full">
    <form class="flex flex-col space-y-6" method="POST" action="?/create" on:submit|preventDefault={createCard}>
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{$t('Karte erstellen')}</h3>
      <Label class="space-y-2">
        <span>{$t('Benutzer für Login')}</span>
        <Select name="userLoginId" items={usersItems} placeholder={$t('Option auswählen ...')} />
      </Label>
      <Label class="space-y-2">
        <span>{$t('Eingeladene')}</span>
        <MultiSelect name="inviteeIds" items={inviteesItems} bind:value={selectedInvitees} required />
      </Label>
      <Button type="submit" class="w-full1">{$t('Erstellen')}</Button>
    </form>
  </Modal>
</div>

{#if $cards.status === 'loading'}
  <span>{$t('Laden ...')}</span>
{:else if $cards.status === 'error'}
  <span>{$t('Error: ')}{$cards.error.message}</span>
{:else}
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell>{$t('ID')}</TableHeadCell>
      <TableHeadCell>{$t('User Login ID')}</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">{$t('Aktionen')}</span>
      </TableHeadCell>
    </TableHead>
    <TableBody>
      {#each $cards.data?.records ?? [] as card, i (card.id)}
        <TableBodyRow on:click={() => gotoDetailPage(card.id)}>
          <TableBodyCell>{card.id}</TableBodyCell>
          <TableBodyCell>{card.userLoginId}</TableBodyCell>
          <TableBodyCell>
            <Button
              on:click={() => gotoDetailPage(card.id)}
              color={
                // We can use the queryCache here to show bold links for ones that are cached
                client.getQueryData(['card', card.id]) ? 'green' : undefined
              }
            >
              {$t('Ansehen')}
            </Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  {#if $cards.isFetching}
    <div style="color:darkgreen; font-weight:700">
      {$t('Im hintergrund aktualisieren ...')}
    </div>
  {/if}
{/if}
