<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$houdini';
  import { getLocalization } from '$lib/i18n';
  const {t} = getLocalization();

  export let data: PageData;

  $: ({ AllInvitees } = data);

  function gotoDetailPage(id: string): void {
    goto(`./invitees/${id}`);
  }
</script>

<Table hoverable={true}>
  <TableHead>
    <TableHeadCell>{$t('Name')}</TableHeadCell>
    <TableHeadCell>
      <span class="sr-only">{$t('Aktionen')}</span>
    </TableHeadCell>
  </TableHead>
  <TableBody>
    {#each $AllInvitees.data?.invitees ?? [] as invitee, i (invitee.id)}
      <TableBodyRow on:click={() => gotoDetailPage(invitee.id)}>
        <TableBodyCell>{invitee.firstname} {invitee.lastname}</TableBodyCell>
        <TableBodyCell>
          <Button on:click={() => gotoDetailPage(invitee.id)}>{$t('Ansehen')}</Button>
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
