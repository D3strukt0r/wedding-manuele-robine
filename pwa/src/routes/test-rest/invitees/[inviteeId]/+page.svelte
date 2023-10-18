<script lang="ts">
  import Invitee from '$lib/Invitee.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Invitee inviteeId={data.inviteeId} />
