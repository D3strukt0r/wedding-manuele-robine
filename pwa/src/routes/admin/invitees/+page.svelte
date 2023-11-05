<script lang="ts">
    import {Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import { getLocalization } from '$lib/i18n';
  import type { Invitee } from "$lib/types";
  const {t} = getLocalization();
  const client = useQueryClient();

  let limit = 10;

  const invitees = createQuery<Invitee[], Error>({
    queryKey: ['invitees', limit],
    queryFn: () => api.invitees.list(limit),
  });

  function gotoDetailPage(id: number): void {
      goto(`./invitees/${id}`);
  }
</script>

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
