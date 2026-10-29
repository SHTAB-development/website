import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Все страницы собираются статически; на сервере живёт только /api/lead (заявки).
export default defineConfig({
  site: 'https://devshtab.com',
  adapter: node({ mode: 'standalone' }),
  compressHTML: true,
  server: { port: 4321 },
});
