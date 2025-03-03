import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

/**
 * @type {import('astro').AstroUserConfig}
 */
export default defineConfig({
  integrations: [
    tailwind({
      // Explicitly enable PostCSS configuration
      applyBaseStyles: false,
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
