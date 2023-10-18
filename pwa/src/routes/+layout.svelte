<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<QueryClientProvider client={data.queryClient}>
  <h1>Wedding Manager</h1>

  <a href="/">Home</a>
  <a href="/test-graphql">GraphQL</a>
  <a href="/test-rest">REST</a>

  <main>
    <slot />
  </main>
</QueryClientProvider>
