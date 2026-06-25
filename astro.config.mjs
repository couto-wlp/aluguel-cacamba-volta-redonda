import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
import { SITE_CONFIG } from './src/data/config.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_CONFIG.siteUrl,
  output: 'server',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap(),
  ],
});