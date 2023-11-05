<script lang="ts">
  import type { PageData } from './$types';
  import {createQuery, useQueryClient} from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type { Table } from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import {Button, Modal} from 'flowbite-svelte';
  import {ExclamationCircleOutline} from "flowbite-svelte-icons";
  const {t} = getLocalization();
  const client = useQueryClient();

  export let data: PageData;
  let deletePopupOpen = false;

  const table = createQuery<Table, Error>({
    queryKey: ['table', data.tableId],
    queryFn: () => api.tables.show(data.tableId),
  });

  async function deleteCard() {
      await api.tables.delete(data.tableId);
      await client.invalidateQueries({ queryKey: ['tables'] });
      await goto('../tables');
  }
</script>

<div>
  <Button on:click={() => goto('../tables')}>{$t('Zurück')}</Button>
</div>
<br />

{#if !data.tableId || $table.isLoading}
  <span>{$t('Laden ...')}</span>
{/if}
{#if $table.error}
  <span>{$t('Error: ')}{$table.error.message}</span>
{/if}
{#if $table.isSuccess}
  <h1>{$table.data.id}</h1>
  <div>
    <p>{$t('Sitzplätze: ')}{$table.data.seats}</p>
  </div>
  <div>{$table.isFetching ? $t('Im hintergrund aktualisieren ...') : ' '}</div>
{/if}


<br />
<div>
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
