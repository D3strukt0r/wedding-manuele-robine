<script lang="ts">
  import type { PageData } from './$houdini';

  export let data: PageData;

  $: ({ AllInvitees } = data)
</script>

<p>Hello</p>

<ul>
  {#each $AllInvitees.data.invitees as invitee}
    <li>{invitee.firstname} {invitee.lastname}</li>
  {/each}
</ul>
