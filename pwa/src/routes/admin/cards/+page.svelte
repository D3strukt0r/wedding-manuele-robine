<script lang="ts">
  import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import { getLocalization } from '$lib/i18n';
  import type { Card } from '$lib/types';
  const {t} = getLocalization();
  const client = useQueryClient();

  let limit = 10;

  const cards = createQuery<Card[], Error>({
    queryKey: ['cards', limit],
    queryFn: () => api.cards.list(limit),
  });

  function gotoDetailPage(id: number): void {
      goto(`./cards/${id}`);
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
      <TableHeadCell>{$t('Login Code')}</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">{$t('Aktionen')}</span>
      </TableHeadCell>
    </TableHead>
    <TableBody>
      {#each $cards.data ?? [] as card, i (card.id)}
        <TableBodyRow on:click={() => gotoDetailPage(card.id)}>
          <TableBodyCell>{card.id}</TableBodyCell>
          <TableBodyCell>{card.loginCode}</TableBodyCell>
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
