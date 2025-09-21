// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://capitalyx.com',
    i18n: {
      defaultLocale: 'fr',
      locales: ['fr', 'en', 'es'],
      routing: {
        prefixDefaultLocale: false
      }
    },
    build: {
      format: 'directory' // URLs propres (/guides/ au lieu de /guides.html)
    }
});
