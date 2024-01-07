<script lang="ts">
  import {
    Button,
    Label,
    Modal,
    MultiSelect,
    NumberInput,
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
  import type { Table as TableType, Invitee } from '$lib/types';
  const {t} = getLocalization();
  const client = useQueryClient();

  let createModalOpen = false;

  let limit = 10;
  const tables = createQuery<TableType[], Error>({
    queryKey: ['tables', limit],
    queryFn: () => api.tables.list(limit),
  });

  let limit2 = 10;
  const invitees = createQuery<Invitee[], Error>({
    queryKey: ['invitees', limit2],
    queryFn: () => api.invitees.list(limit2),
  });
  $: inviteesItems = $invitees.data?.map((invitee) => ({ value: invitee.id, name: `${invitee.firstname} ${invitee.lastname} (ID: ${invitee.id})` })) ?? [];

  function gotoDetailPage(id: number): void {
      goto(`./tables/${id}`);
  }

  let selectedInvitees: number[] = [];
  async function createTable(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as Omit<Table, 'id'>;

    // Normalize values
    values.seats = +values.seats;
    values.invitees_id = selectedInvitees;

    await api.tables.create(values);

    createModalOpen = false;
    await client.invalidateQueries({ queryKey: ['tables'] });
  }
</script>

<div class="flex justify-end mb-4">
  <Button on:click={() => (createModalOpen = true)} class="ml-auto">{$t('Erstellen')}</Button>
  <Modal bind:open={createModalOpen} size="sm" autoclose={false} class="w-full">
    <form class="flex flex-col space-y-6" method="POST" action="?/create" on:submit|preventDefault={createTable}>
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{$t('Tisch erstellen')}</h3>
      <Label class="space-y-2">
        <span>{$t('Sitzplätze')}</span>
        <NumberInput name="seats" required />
      </Label>
      <Label class="space-y-2">
        <span>{$t('Eingeladene')}</span>
        <MultiSelect name="invitees_id" items={inviteesItems} bind:value={selectedInvitees} required />
      </Label>
      <Button type="submit" class="w-full1">{$t('Erstellen')}</Button>
    </form>
  </Modal>
</div>

{#if $tables.status === 'loading'}
  <span>{$t('Laden ...')}</span>
{:else if $tables.status === 'error'}
  <span>{$t('Error: ')}{$tables.error.message}</span>
{:else}
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell>{$t('ID')}</TableHeadCell>
      <TableHeadCell>{$t('Sitzplätze')}</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">{$t('Aktionen')}</span>
      </TableHeadCell>
    </TableHead>
    <TableBody>
      {#each $tables.data ?? [] as table, i (table.id)}
        <TableBodyRow on:click={() => gotoDetailPage(table.id)}>
          <TableBodyCell>{table.id}</TableBodyCell>
          <TableBodyCell>{table.seats}</TableBodyCell>
          <TableBodyCell>
            <Button
              on:click={() => gotoDetailPage(table.id)}
              color={
                // We can use the queryCache here to show bold links for ones that are cached
                client.getQueryData(['table', table.id]) ? 'green' : undefined
              }
            >
              {$t('Ansehen')}
            </Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  {#if $tables.isFetching}
    <div style="color:darkgreen; font-weight:700">
      {$t('Im hintergrund aktualisieren ...')}
    </div>
  {/if}
{/if}
