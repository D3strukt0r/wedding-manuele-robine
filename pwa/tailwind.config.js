import TailwindForms from '@tailwindcss/forms';
import TailwindTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [
    TailwindForms,
    TailwindTypography,
  ],
}
