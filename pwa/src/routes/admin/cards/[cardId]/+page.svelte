<script lang="ts">
  import type { PageData } from './$types';
  import { createQuery } from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type { Card } from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import { Button } from 'flowbite-svelte';
  const {t} = getLocalization();

  export let data: PageData;

  const card = createQuery<Card, Error>({
    queryKey: ['card', data.cardId],
    queryFn: () => api.cards.show(data.cardId),
  })
</script>

<div>
  <Button on:click={() => goto('../cards')}>{$t('Zurück')}</Button>
  <br />
  <br />
</div>
{#if !data.cardId || $card.isLoading}
  <span>{$t('Laden ...')}</span>
{/if}
{#if $card.error}
  <span>{$t('Error: ')}{$card.error.message}</span>
{/if}
{#if $card.isSuccess}
  <h1>{$card.data.id}</h1>
  <div>
    <p>{$t('Login Code: ')}{$card.data.loginCode}</p>
  </div>
  <div>{$card.isFetching ? $t('Im hintergrund aktualisieren ...') : ' '}</div>
{/if}
