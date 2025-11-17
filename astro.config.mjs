// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://hackscate.osuc.dev',
    
    i18n: {
        defaultLocale: 'en',
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