import { browser } from '$app/environment';
import { readable, writable } from 'svelte/store';

// https://stackoverflow.com/a/73438808/4156752
export function localStorageStore(key: string, initial: any) {
  if (!browser)
    return readable(initial);

  const value = localStorage.getItem(key)
  const store = writable(value == null ? initial : JSON.parse(value));

  store.subscribe(v => localStorage.setItem(key, JSON.stringify(v)));

  return store;
}
