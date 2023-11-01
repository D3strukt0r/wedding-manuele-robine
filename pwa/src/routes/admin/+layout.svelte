<script lang="ts">
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
  import { getLocalization } from '$lib/i18n';
  const {t} = getLocalization();
</script>

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
