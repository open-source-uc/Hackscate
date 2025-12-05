// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    site: 'https://hackscate.osuc.dev',
    output: 'server',
    adapter: cloudflare(),

    i18n: {
        defaultLocale: 'es',
        locales: ['en', 'es'],
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: false
        },
    },

    vite: {
        plugins: [tailwindcss()]
    },

    integrations: [react()]
});