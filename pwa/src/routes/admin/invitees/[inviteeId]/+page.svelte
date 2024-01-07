<script lang="ts">
  import type { PageData } from './$types';
  import {createQuery, useQueryClient} from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type {Card, Invitee} from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import {Button, Checkbox, Input, Label, Modal, Select, Table} from 'flowbite-svelte';
  import {ExclamationCircleOutline} from "flowbite-svelte-icons";
  const {t} = getLocalization();
  const client = useQueryClient();

  export let data: PageData;
  let deletePopupOpen = false;
  let editModalOpen = false;

  const invitee = createQuery<Invitee, Error>({
    queryKey: ['invitee', data.inviteeId],
    queryFn: () => api.invitees.show(data.inviteeId),
  });

  let limit2 = 10;
  const tables = createQuery<Table[], Error>({
    queryKey: ['tables', limit2],
    queryFn: () => api.tables.list(limit2),
  });
  $: tableItems = $tables.data?.map((table) => ({ value: table.id, name: `X (ID: ${table.id})` })) ?? [];

  let limit3 = 10;
  const cards = createQuery<Card[], Error>({
    queryKey: ['cards', limit3],
    queryFn: () => api.cards.list(limit3),
  });
  $: cardItems = $cards.data?.map((card) => ({ value: card.id, name: `X (ID: ${card.id})` })) ?? [];


  async function deleteInvitee() {
      await api.invitees.delete(data.inviteeId);
      await client.invalidateQueries({ queryKey: ['invitees'] });
      await goto('../invitees');
  }

  async function updateInvitee(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as Omit<Invitee, 'id'>;

    // Normalize values
    values.willCome = !!values.willCome;
    values.tableId = +values.tableId;
    values.cardId = +values.cardId;

    await api.invitees.update(+data.inviteeId, values);

    editModalOpen = false;
    await client.invalidateQueries({ queryKey: ['invitees'] });
    await client.invalidateQueries({ queryKey: ['invitee', data.inviteeId] });
  }
</script>

<div>
  <Button on:click={() => goto('../invitees')}>{$t('Zurück')}</Button>
</div>
<br />

{#if !data.inviteeId || $invitee.isLoading}
  <span>{$t('Laden ...')}</span>
{/if}
{#if $invitee.error}
  <span>{$t('Error: ')}{$invitee.error.message}</span>
{/if}
{#if $invitee.isSuccess}
  <h1>{$invitee.data.firstname} {$invitee.data.lastname}</h1>
  <p>{$t('Email: ')}{$invitee.data.email ?? $t('Keine')}</p>
  <p>{$t('Wird kommen? ')}{$invitee.data.will_come ? $t('Ja') : $t('Nein')}</p>
  <p>{$t('Essenspräferenz: ')}{$invitee.data.food ? $t(`enum.food.${$invitee.data.food}`) : $t('Keine')}</p>
  <p>{$t('Allergien: ')}{$invitee.data.allergies ?? $t('Keine')}</p>
  {#if $invitee.data.table_id}
    <p>{$t('Tisch: ')}<a href={`./../tables/${$invitee.data.table_id}`}>{$invitee.data.table_id}</a></p>
  {/if}
  {#if $invitee.data.card_id}
    <p>{$t('Karte: ')}<a href={`./../cards/${$invitee.data.card_id}`}>{$invitee.data.card_id}</a></p>
  {/if}
  <p></p>
  <div>{$invitee.isFetching ? $t('Im hintergrund aktualisieren ...') : ' '}</div>

  <div class="mt-4 flex">
    <Button on:click={() => (editModalOpen = true)} class="mr-4">{$t('Bearbeiten')}</Button>
    <Modal bind:open={editModalOpen} size="sm" autoclose={false} class="w-full">
      <form class="flex flex-col space-y-6" method="POST" action="?/update" on:submit|preventDefault={updateInvitee}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{$t('Eingeladenen bearbeiten')}</h3>
        <Label class="space-y-2">
          <span>{$t('Vorname')}*</span>
          <Input type="text" name="firstname" placeholder={$invitee.data.firstname} value={$invitee.data.firstname} required />
        </Label>
        <Label class="space-y-2">
          <span>{$t('Nachname')}*</span>
          <Input type="text" name="lastname" placeholder={$invitee.data.lastname} value={$invitee.data.lastname} required />
        </Label>
        <Label class="space-y-2">
          <span>{$t('Email')}</span>
          <Input type="email" name="email" placeholder={$invitee.data.email} value={$invitee.data.email} />
        </Label>
        <Label class="space-y-2">
          <Checkbox checked={$invitee.data.will_come === true} name="willCome">{$t('Wird kommen?')}</Checkbox>
        </Label>
        <!-- TODO: Essenspreferenz `food` -->
        <Label class="space-y-2">
          <span>{$t('Allergien')}</span>
          <Input type="text" name="allergies" placeholder={$invitee.data.allergies} value={$invitee.data.allergies} />
        </Label>
        <Label class="space-y-2">
          <span>{$t('Tisch')}</span>
          <Select name="tableId" items={tableItems} placeholder={$t('Option auswählen ...')} value={$invitee.data.table_id} />
        </Label>
        <Label class="space-y-2">
          <span>{$t('Karte')}</span>
          <Select name="cardId" items={cardItems} placeholder={$t('Option auswählen ...')} value={$invitee.data.card_id} />
        </Label>
        <Button type="submit" class="w-full1">{$t('Speichern')}</Button>
      </form>
    </Modal>

    <Button on:click={() => (deletePopupOpen = true)}>{$t('Löschen')}</Button>
    <Modal bind:open={deletePopupOpen} size="xs" autoclose>
      <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{$t('Sind Sie sicher, dass Sie diesen Eingeladenen löschen möchten?')}</h3>
        <Button color="red" class="mr-2" on:click={deleteInvitee}>{$t('Ja, ich bin sicher')}</Button>
        <Button color="alternative">{$t('Nein, abbrechen')}</Button>
      </div>
    </Modal>
  </div>
{/if}
