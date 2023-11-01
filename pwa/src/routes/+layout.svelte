<script lang="ts">
  import '../app.css';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import type { PageData } from './$types';
  import {initLocalizationContext} from '$lib/i18n';

  initLocalizationContext();

  export let data: PageData;
</script>

<QueryClientProvider client={data.queryClient}>
  <slot />
</QueryClientProvider>
