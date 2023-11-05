<script lang="ts">
  import { page } from '$app/stores';
  import { getLocalization } from '$lib/i18n';
  const {t} = getLocalization();

  const code = $page.status;
  let message: string,
      help: string;
  if (code === 404) {
    message = `${$t('Seite nicht gefunden')} (${$page.error.message})`;
    help = $t('Leider konnten wir die von Ihnen gesuchte Seite nicht finden.');
  } else {
    message = $page.error.message
  }
</script>

<!-- https://tailwindui.com/components/marketing/feedback/404-pages#component-9e31dc71bccd709e04de0ed11a1328b0 -->
<svelte:head>
  <style lang="postcss">
    html {
      @apply h-full;
    }
    body {
      @apply h-full;
    }
  </style>
</svelte:head>
<main class="relative isolate min-h-full">
  <img src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75" alt="" class="absolute inset-0 -z-10 h-full w-full object-cover object-top">
  <div class="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
    <p class="text-base font-semibold leading-8 text-white">{code}</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{message}</h1>
    <p class="mt-4 text-base text-white/70 sm:mt-6">{help}</p>
    <div class="mt-10 flex justify-center">
      <a href="/" class="text-sm font-semibold leading-7 text-white"><span aria-hidden="true">&larr;</span> {$t('Zurück zur Startseite')}</a>
    </div>
  </div>
</main>
