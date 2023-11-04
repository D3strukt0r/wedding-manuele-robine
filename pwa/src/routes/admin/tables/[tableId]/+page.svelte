<script lang="ts">
  import type { PageData } from './$types';
  import { createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type { Table } from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import { Button } from 'flowbite-svelte';
  const {t} = getLocalization();

  export let data: PageData;

  const table = createQuery<Table, Error>({
    queryKey: ['table', data.tableId],
    queryFn: () => api.tables.show(data.tableId),
  })
</script>

<div>
  <Button on:click={() => goto('../tables')}>{$t('Zurück')}</Button>
  <br />
  <br />
</div>
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
