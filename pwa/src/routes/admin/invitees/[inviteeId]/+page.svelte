<script lang="ts">
  import type { PageData } from './$types';
  import { createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type { Invitee } from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import { Button } from 'flowbite-svelte';
  const {t} = getLocalization();

  export let data: PageData;

  const invitee = createQuery<Invitee, Error>({
    queryKey: ['invitee', data.inviteeId],
    queryFn: () => api.invitees.show(data.inviteeId),
  })
</script>

<div>
  <Button on:click={() => goto('../invitees')}>{$t('Zurück')}</Button>
  <br />
  <br />
</div>
{#if !data.inviteeId || $invitee.isLoading}
  <span>{$t('Laden ...')}</span>
{/if}
{#if $invitee.error}
  <span>{$t('Error: ')}{$invitee.error.message}</span>
{/if}
{#if $invitee.isSuccess}
  <h1>{$invitee.data.firstname} {$invitee.data.lastname}</h1>
  <div>
    <p>...</p>
  </div>
  <div>{$invitee.isFetching ? $t('Im hintergrund aktualisieren ...') : ' '}</div>
{/if}
