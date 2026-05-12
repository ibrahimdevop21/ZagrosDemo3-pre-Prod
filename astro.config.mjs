import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
// pinned to v4 — @astrojs/mdx v5 requires astro v6, we're on astro v5
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  redirects: {
    '/partners':     { status: 301, destination: '/' },
    '/customers':    { status: 301, destination: '/' },
    '/ar/partners':  { status: 301, destination: '/ar/' },
    '/ar/customers': { status: 301, destination: '/ar/' },
  },
});
