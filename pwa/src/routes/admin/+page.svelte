<script lang="ts">
  import { Alert } from 'flowbite-svelte';
  import { getLocalization } from '$lib/i18n';
  const {t} = getLocalization();
</script>

<Alert color="blue">
  <span class="font-medium">{$t('Info:')}</span>
  {$t('Menü oben benutzen um Datensätze zu bearbeiten.')}
</Alert>
