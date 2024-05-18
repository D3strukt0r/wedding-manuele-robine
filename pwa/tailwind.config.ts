import type { Config } from 'tailwindcss';
import TailwindForms from '@tailwindcss/forms';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'app-red-light': '#dab4a7',
        'app-red': '#a53333',
        'app-red-dark': '#8c594d',
        'app-gray-dark': '#403a37',
        'app-green': '#7b9888',
        'app-green-dark': '#37403d',
        'app-yellow': '#faffe4',
        'app-yellow-dark': '#fff7d0',
        'app-gray-light': '#f0f0f0',
      },
    },
  },
  plugins: [
    TailwindForms,
  ],
} satisfies Config;
