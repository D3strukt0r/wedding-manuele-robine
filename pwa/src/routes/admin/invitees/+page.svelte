<script lang="ts">
  import {
    Button, Checkbox, Helper, Input,
    Label,
    Modal, MultiSelect, NumberInput,
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
  import type { Invitee } from "$lib/types";
  const {t} = getLocalization();
  const client = useQueryClient();

  let createModalOpen = false;

  let limit = 10;
  const invitees = createQuery<Invitee[], Error>({
    queryKey: ['invitees', limit],
    queryFn: () => api.invitees.list(limit),
  });

  function gotoDetailPage(id: number): void {
      goto(`./invitees/${id}`);
  }

  async function createInvitee(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as Omit<Table, 'id'>;

    // Normalize values
    values.willCome = !!values.willCome;

    await api.invitees.create(values);

    createModalOpen = false;
    await client.invalidateQueries({ queryKey: ['invitees'] });
  }
</script>

<div class="flex justify-end mb-4">
  <Button on:click={() => (createModalOpen = true)} class="ml-auto">{$t('Erstellen')}</Button>
  <Modal bind:open={createModalOpen} size="sm" autoclose={false} class="w-full">
    <form class="flex flex-col space-y-6" method="POST" action="?/create" on:submit|preventDefault={createInvitee}>
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{$t('Eingeladenen erstellen')}</h3>
      <Label class="space-y-2">
        <span>{$t('Vorname')}*</span>
        <Input type="text" name="firstname" placeholder={$t('Max')} required />
      </Label>
      <Label class="space-y-2">
        <span>{$t('Nachname')}*</span>
        <Input type="text" name="lastname" placeholder={$t('Mustermann')} required />
      </Label>
      <Label class="space-y-2">
        <span>{$t('Email')}</span>
        <Input type="email" name="email" placeholder={$t('max.mustermann@gmail.com')} />
      </Label>
      <Label class="space-y-2">
        <Checkbox name="willCome">{$t('Wird kommen?')}</Checkbox>
      </Label>
      <!-- TODO: Essenspreferenz `food` -->
      <Label class="space-y-2">
        <span>{$t('Allergien')}</span>
        <Input type="text" name="allergies" placeholder={$t('Gluten, Lactose, etc.')} />
      </Label>
      <!-- TODO: Tisch `tableId` -->
      <!-- TODO: Karte `cardId` -->
      <Button type="submit" class="w-full1">{$t('Erstellen')}</Button>
    </form>
  </Modal>
</div>

{#if $invitees.status === 'loading'}
  <span>{$t('Laden ...')}</span>
{:else if $invitees.status === 'error'}
  <span>{$t('Error: ')}{$invitees.error.message}</span>
{:else}
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell>{$t('ID')}</TableHeadCell>
      <TableHeadCell>{$t('Name')}</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">{$t('Aktionen')}</span>
      </TableHeadCell>
    </TableHead>
    <TableBody>
      {#each $invitees.data ?? [] as invitee, i (invitee.id)}
        <TableBodyRow on:click={() => gotoDetailPage(invitee.id)}>
          <TableBodyCell>{invitee.id}</TableBodyCell>
          <TableBodyCell>{invitee.firstname} {invitee.lastname}</TableBodyCell>
          <TableBodyCell>
            <Button
              on:click={() => gotoDetailPage(invitee.id)}
              color={
                // We can use the queryCache here to show bold links for ones that are cached
                client.getQueryData(['invitee', invitee.id]) ? 'green' : undefined
              }
            >
              {$t('Ansehen')}
            </Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  {#if $invitees.isFetching}
    <div style="color:darkgreen; font-weight:700">
      {$t('Im hintergrund aktualisieren ...')}
    </div>
  {/if}
{/if}
