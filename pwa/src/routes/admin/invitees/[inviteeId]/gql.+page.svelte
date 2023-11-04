<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$houdini';
  import { getLocalization } from '$lib/i18n';
  const {t} = getLocalization();

  export let data: PageData;

  $: ({ Invitee } = data);
  $: console.log(Invitee);
</script>

<div>
  <Button on:click={() => goto('../invitees')}>{$t('Zurück')}</Button>
  <br />
  <br />
</div>
<h1>{$Invitee?.data?.invitee?.firstname} {$Invitee?.data?.invitee?.lastname}</h1>
<div>
  <p>...</p>
</div>
