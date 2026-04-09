import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkWikiLinks } from './src/lib/remark-wikilinks.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://drafters.vercel.app',
  trailingSlash: 'never',
  integrations: [
    mdx({
      remarkPlugins: [remarkWikiLinks],
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkWikiLinks],
    smartypants: false,
  },
  vite: {
    ssr: {
      noExternal: ['@fontsource-variable/source-serif-4', '@fontsource-variable/jetbrains-mono'],
    },
  },
});
