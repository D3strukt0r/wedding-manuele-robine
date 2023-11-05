<script lang="ts">
  import type { PageData } from './$types';
  import {createQuery, useQueryClient} from '@tanstack/svelte-query';
  import { api } from '$lib/api';
  import type { Card } from '$lib/types';
  import { getLocalization } from '$lib/i18n';
  import { goto } from "$app/navigation";
  import { Button, Modal } from 'flowbite-svelte';
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  const {t} = getLocalization();
  const client = useQueryClient();

  export let data: PageData;
  let deletePopupOpen = false;

  const card = createQuery<Card, Error>({
    queryKey: ['card', data.cardId],
    queryFn: () => api.cards.show(data.cardId),
  });

  async function deleteCard() {
    await api.cards.delete(data.cardId);
    await client.invalidateQueries({ queryKey: ['cards'] });
    await goto('../cards');
  }
</script>

<div>
  <Button on:click={() => goto('../cards')}>{$t('Zurück')}</Button>
</div>
<br />

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

<br />
<div>
  <Button on:click={() => (deletePopupOpen = true)}>{$t('Löschen')}</Button>
  <Modal bind:open={deletePopupOpen} size="xs" autoclose>
    <div class="text-center">
      <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{$t('Sind Sie sicher, dass Sie diese Karte löschen möchten?')}</h3>
      <Button color="red" class="mr-2" on:click={deleteCard}>{$t('Ja, ich bin sicher')}</Button>
      <Button color="alternative">{$t('Nein, abbrechen')}</Button>
    </div>
  </Modal>
</div>
