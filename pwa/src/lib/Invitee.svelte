<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'
  import { api } from './api'
  import type { Invitee } from './types'

  export let inviteeId: number

  const invitee = createQuery<Invitee, Error>({
    queryKey: ['invitee', inviteeId],
    queryFn: () => api().getInviteeById(inviteeId),
  })
</script>

<div>
  <div>
    <a class="button" href="/"> Back </a>
  </div>
  {#if !inviteeId || $invitee.isLoading}
    <span>Loading...</span>
  {/if}
  {#if $invitee.error}
    <span>Error: {$invitee.error.message}</span>
  {/if}
  {#if $invitee.isSuccess}
    <h1>{$invitee.data.firstname} {$invitee.data.lastname}</h1>
    <div>
      <p>Some other data</p>
    </div>
    <div>{$invitee.isFetching ? 'Background Updating...' : ' '}</div>
  {/if}
</div>
