<script lang="ts">
    import {Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import { getLocalization } from '$lib/i18n';
  import type { Table as TableType } from '$lib/types';
  const {t} = getLocalization();

  const client = useQueryClient();

  let limit = 10;

  const tables = createQuery<TableType[], Error>({
    queryKey: ['tables', limit],
    queryFn: () => api.tables.list(limit),
  });

  function gotoDetailPage(id: number): void {
      goto(`./tables/${id}`);
  }
</script>

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
