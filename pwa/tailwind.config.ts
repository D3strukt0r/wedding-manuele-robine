import type { Config } from 'tailwindcss';
import TailwindForms from '@tailwindcss/forms'; // Fixing this with `* as` will result in "[postcss] plugin is not a function"
import TailwingTypography from '@tailwindcss/typography'; // Fixing this with `* as` will result in "[postcss] plugin is not a function"
import * as defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,json}',
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
      fontFamily: {
        philosopher: [
          'Philosopher',
          ...defaultTheme.fontFamily.sans,
        ],
        'noto-sans': [
          'Noto Sans',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      // TODO: This doesn't seem to be picked up
      // typography: (theme) => ({
      //   DEFAULT: {
      //     css: {
      //       a: {
      //         color: theme('colors.app-green'),
      //         '&:hover': {
      //           color: theme('colors.app-green-dark'),
      //           textDecoration: 'underline',
      //         },
      //       },
      //     },
      //   },
      // }),
    },
  },
  plugins: [
    TailwindForms,
    TailwingTypography,
  ],
} satisfies Config;
