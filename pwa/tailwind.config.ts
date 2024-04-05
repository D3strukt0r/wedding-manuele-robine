import type { Config } from 'tailwindcss';
import TailwindForms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'red': '#a53333',
        'red-light': '#dab4a7',
        'red-dark': '#8c594d',
        'gray-dark': '#403a37',
      }
    },
  },
  plugins: [
    TailwindForms,
  ],
} satisfies Config
