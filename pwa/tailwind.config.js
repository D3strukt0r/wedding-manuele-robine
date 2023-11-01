import colors from 'tailwindcss/colors';
import Flowbite from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: colors.rose,
        secondary: colors.emerald,
      }
    },
  },
  plugins: [
    Flowbite,
  ],
}
