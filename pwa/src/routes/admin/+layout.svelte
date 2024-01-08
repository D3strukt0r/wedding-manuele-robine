<script lang="ts">
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Input,
    Label,
    Button,
  } from 'flowbite-svelte';
  import { getLocalization } from '$lib/i18n';
  import {localStorageStore} from '$lib/localstorage-store';
  import {api} from '$lib/api';
  import axios from 'axios';
  const {t} = getLocalization();

  const auth = localStorageStore('auth', {jwt: null});
  auth.subscribe((value) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${value.jwt}`;
  });

  async function login(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as { username: string, password: string };

    const response = await api.common.login(values);
    auth.set({jwt: response.token});
  }
</script>

{#if $auth.jwt}
  <div class="md:container md:mx-auto px-4">
    <Navbar>
      <NavBrand href="/">
        <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">{$t('site.title')}</span>
      </NavBrand>
      <NavHamburger />
      <NavUl>
        <NavLi href="/admin">{$t('site.home')}</NavLi>
        <NavLi href="/admin/invitees">{$t('site.invitees')}</NavLi>
        <NavLi href="/admin/cards">{$t('site.cards')}</NavLi>
        <NavLi href="/admin/tables">{$t('site.tables')}</NavLi>
      </NavUl>
    </Navbar>
    <slot />
  </div>
{:else}
  <div class="md:container md:mx-auto px-4">
    <div class="max-w-screen-sm mx-auto">
      <form method="POST" action="?/login" on:submit|preventDefault={login}>
        <div class="mt-6 mb-6">
          <Label for="username" class="mb-2">{$t('Benutzername')}</Label>
          <Input type="text" name="username" id="username" placeholder="JohnDoe" required autocomplete="username" />
        </div>
        <div class="mb-6">
          <Label for="password" class="mb-2">{$t('Passwort')}</Label>
          <Input type="password" name="password" id="password" placeholder="•••••••••" required autocomplete="current-password" />
        </div>
        <Button type="submit">{$t('Login')}</Button>
      </form>
    </div>
  </div>
{/if}
