<script lang="ts">
  import type { PageData } from './$types';
  import {createQuery, useQueryClient} from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type { Invitee } from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import {Button, Modal} from 'flowbite-svelte';
  import {ExclamationCircleOutline} from "flowbite-svelte-icons";
  const {t} = getLocalization();
  const client = useQueryClient();

  export let data: PageData;
  let deletePopupOpen = false;

  const invitee = createQuery<Invitee, Error>({
    queryKey: ['invitee', data.inviteeId],
    queryFn: () => api.invitees.show(data.inviteeId),
  });

  async function deleteInvitee() {
      await api.invitees.delete(data.inviteeId);
      await client.invalidateQueries({ queryKey: ['invitees'] });
      await goto('../invitees');
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
  <!-- TODO: Food -->
  <p>{$t('Allergien: ')}{$invitee.data.allergies ?? $t('Keine')}</p>
  {#if $invitee.data.table_id}
    <p>{$t('Tisch: ')}<a href={`./../tables/${$invitee.data.table_id}`}>{$invitee.data.table_id}</a></p>
  {/if}
  {#if $invitee.data.card_id}
    <p>{$t('Karte: ')}<a href={`./../cards/${$invitee.data.card_id}`}>{$invitee.data.card_id}</a></p>
  {/if}
  <p></p>
  <div>{$invitee.isFetching ? $t('Im hintergrund aktualisieren ...') : ' '}</div>
{/if}

<br />
<div>
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
