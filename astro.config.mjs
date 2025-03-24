import { defineConfig } from './node_modules/astro/dist/config/index.js';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';  // ✅ Import React integration

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(), // ✅ Add React integration here
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
