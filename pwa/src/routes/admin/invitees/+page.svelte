<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$houdini';
  import { getLocalization } from '$lib/i18n';
  const {t} = getLocalization();

  export let data: PageData;

  $: ({ AllInvitees } = data)
</script>

<Table hoverable={true}>
  <TableHead>
    <TableHeadCell>Name</TableHeadCell>
    <TableHeadCell>
      <span class="sr-only">Edit</span>
    </TableHeadCell>
  </TableHead>
  <TableBody class="divide-y">
    {#each $AllInvitees.data.invitees as invitee, i (invitee.id)}
      <TableBodyRow on:click={() => goto(`./invitees/${invitee.id}`)}>
        <TableBodyCell>{invitee.firstname} {invitee.lastname}</TableBodyCell>
        <TableBodyCell>
          <a on:click|stopPropagation href={`./invitees/${invitee.id}`} class="font-medium text-primary-600 hover:underline dark:text-primary-500">{$t('Ansehen')}</a>
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
