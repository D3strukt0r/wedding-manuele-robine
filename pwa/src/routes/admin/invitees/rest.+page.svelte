<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import { getLocalization } from '$lib/i18n';
  const {t} = getLocalization();

  const client = useQueryClient();

  let limit = 10;

  const invitees = createQuery<
    { id: number; firstname: string; lastname: string }[],
    Error
  >({
    queryKey: ['invitees', limit],
    queryFn: () => api.getInvitees(limit),
  });
</script>

{#if $invitees.status === 'loading'}
  <span>{$t('Laden ...')}</span>
{:else if $invitees.status === 'error'}
  <span>{$t('Error: ')}{$invitees.error.message}</span>
{:else}
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell>{$t('Name')}</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">{$('Aktionen')}</span>
      </TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
      {#each $invitees.data as invitee, i (invitee.id)}
        <TableBodyRow on:click={() => goto(`./invitees/${invitee.id}`)}>
          <TableBodyCell>{invitee.firstname} {invitee.lastname}</TableBodyCell>
          <TableBodyCell>
            <a
              href={`./invitees/${invitee.id}`}
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              style={
                // We can use the queryCache here to show bold links for ones that are cached
                client.getQueryData(['invitee', invitee.id])
                  ? 'font-weight: bold; color: indianred'
                  : 'cursor: pointer'
              }
            >{$t('Ansehen')}</a>
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
