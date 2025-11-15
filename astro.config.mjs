// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  i18n: {
      defaultLocale: 'en',
      locales: ['en', 'es'],
      routing: {
          prefixDefaultLocale: true,
          redirectToDefaultLocale: false
      },
  },

  redirects: {
      '/': {
          status: 301,
          destination: '/en/'
      }
  },

  vite: {
      plugins: [tailwindcss()]
  },

  integrations: [react()]
});