<script lang="ts">
  import type { PageData } from './$types';
  import {createQuery, useQueryClient} from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type {Invitee, Table} from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import {Button, Modal, Label, NumberInput, Li, List, MultiSelect} from 'flowbite-svelte';
  import {ExclamationCircleOutline} from "flowbite-svelte-icons";
  const {t} = getLocalization();
  const client = useQueryClient();

  export let data: PageData;
  let deletePopupOpen = false;
  let editModalOpen = false;

  const table = createQuery<Table, Error>({
    queryKey: ['table', data.tableId],
    queryFn: () => api.admin.tables.show(data.tableId),
  });

  const invitees = createQuery<Invitee[], Error>({
    queryKey: ['invitees'],
    queryFn: () => api.admin.invitees.list(),
  });
  $: inviteesItems = $invitees.data?.records?.map((invitee) => ({ value: invitee.id, name: `${invitee.firstname} ${invitee.lastname} (ID: ${invitee.id})` })) ?? [];

  async function deleteTable() {
    await api.admin.tables.delete(data.tableId);
    await client.invalidateQueries({ queryKey: ['tables'] });
    await goto('../tables');
  }

  let selectedInvitees: number[] = $table?.data?.inviteeIds ?? [];
  async function updateTable(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as Omit<Table, 'id'>;

    // Normalize values
    values.seats = +values.seats;
    values.inviteeIds = selectedInvitees;

    await api.admin.tables.update(+data.tableId, values);

    editModalOpen = false;
    await client.invalidateQueries({ queryKey: ['tables'] });
    await client.invalidateQueries({ queryKey: ['table', data.tableId] });
  }
</script>

<div class="mb-4">
  <Button on:click={() => goto('../tables')}>{$t('Zurück')}</Button>
</div>

{#if !data.tableId || $table.isLoading}
  <span>{$t('Laden ...')}</span>
{/if}
{#if $table.error}
  <span>{$t('Error: ')}{$table.error.message}</span>
{/if}
{#if $table.isSuccess}
  <div>
    <p>{$t('ID: ')}{$table.data.id}</p>
    <p>{$t('Sitzplätze: ')}{$table.data.seats}</p>
    <p>{$t('Eingeladene: ')}</p>
    <List tag="ul" class="space-y-1">
      {#each $table.data.inviteeIds as inviteeId}
        {@const invitee = $invitees.data?.records?.find((invitee) => invitee.id === inviteeId)}
        <Li>{invitee?.firstname} {invitee?.lastname} ({$t('ID: ')}{invitee?.id})</Li>
      {:else}
        <Li>{$t('Niemand sitzt am Tisch')}</Li>
      {/each}
    </List>
  </div>
  <div>{$table.isFetching ? $t('Im hintergrund aktualisieren ...') : ' '}</div>

  <div class="mt-4 flex">
    <Button on:click={() => (editModalOpen = true)} class="mr-4">{$t('Bearbeiten')}</Button>
    <Modal bind:open={editModalOpen} size="sm" autoclose={false} class="w-full">
      <form class="flex flex-col space-y-6" method="POST" action="?/update" on:submit|preventDefault={updateTable}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{$t('Tisch bearbeiten')}</h3>
        <Label class="space-y-2">
          <span>{$t('Sitzplätze')}</span>
          <NumberInput name="seats" placeholder={$table.data.seats} value={$table.data.seats} required />
        </Label>
        <Label class="space-y-2">
          <span>{$t('Eingeladene')}</span>
          <MultiSelect name="inviteeIds" items={inviteesItems} bind:value={selectedInvitees} />
        </Label>
        <Button type="submit" class="w-full1">{$t('Speichern')}</Button>
      </form>
    </Modal>

    <Button on:click={() => (deletePopupOpen = true)}>{$t('Löschen')}</Button>
    <Modal bind:open={deletePopupOpen} size="xs" autoclose>
      <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{$t('Sind Sie sicher, dass Sie diese Karte löschen möchten?')}</h3>
        <Button color="red" class="mr-2" on:click={deleteTable}>{$t('Ja, ich bin sicher')}</Button>
        <Button color="alternative">{$t('Nein, abbrechen')}</Button>
      </div>
    </Modal>
  </div>
{/if}
