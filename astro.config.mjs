import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://atomiccfo.com',
  integrations: [sitemap()],
});
