<script lang="ts">
  import { useQueryClient, createQuery } from '@tanstack/svelte-query'
  import { api } from './api'

  const client = useQueryClient()

  let limit = 10

  const invitees = createQuery<
    { id: number; firstname: string; lastname: string }[],
    Error
  >({
    queryKey: ['invitees', limit],
    queryFn: () => api().getInvitees(limit),
  })

  console.log($invitees.data)
</script>

<div>
  <div>
    {#if $invitees.status === 'loading'}
      <span>Loading...</span>
    {:else if $invitees.status === 'error'}
      <span>Error: {$invitees.error.message}</span>
    {:else}
      <ul>
        Data
        {#each $invitees.data as invitee}
          <article>
            <a
              href={`/test-rest/invitees/${invitee.id}`}
              style={
              // We can use the queryCache here to show bold links for ones that are cached
              client.getQueryData(['invitee', invitee.id])
                ? 'font-weight: bold; color: indianred'
                : 'cursor: pointer'}
            >
              {invitee.firstname} {invitee.lastname}
            </a>
          </article>
        {/each}
      </ul>
      {#if $invitees.isFetching}
        <div style="color:darkgreen; font-weight:700">
          Background Updating...
        </div>
      {/if}
    {/if}
  </div>
</div>
