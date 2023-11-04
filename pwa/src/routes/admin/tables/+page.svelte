<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import { getLocalization } from '$lib/i18n';
  import type { Table as TableType } from '$lib/types';
  const {t} = getLocalization();

  const client = useQueryClient();

  let limit = 10;

  const cards = createQuery<TableType[], Error>({
    queryKey: ['tables', limit],
    queryFn: () => api.tables.list(limit),
  });

  function gotoDetailPage(id: number): void {
      goto(`./tables/${id}`);
  }
</script>

{#if $cards.status === 'loading'}
  <span>{$t('Laden ...')}</span>
{:else if $cards.status === 'error'}
  <span>{$t('Error: ')}{$cards.error.message}</span>
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
      {#each $cards.data ?? [] as card, i (card.id)}
        <TableBodyRow on:click={() => gotoDetailPage(card.id)}>
          <TableBodyCell>{card.id}</TableBodyCell>
          <TableBodyCell>{card.seats}</TableBodyCell>
          <TableBodyCell>
            <a
              href={`./cards/${card.id}`}
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              style={
                // We can use the queryCache here to show bold links for ones that are cached
                client.getQueryData(['card', card.id])
                  ? 'font-weight: bold'
                  : 'cursor: pointer'
              }
            >{$t('Ansehen')}</a>
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
