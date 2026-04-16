import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkWikiLinks } from './src/lib/remark-wikilinks.mjs';
import { remarkParagraphIds } from './src/lib/remark-paragraph-ids.mjs';

const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'append',
      properties: {
        className: ['heading-anchor'],
        'aria-label': 'Permanent link to this heading',
      },
      content: {
        type: 'element',
        tagName: 'span',
        properties: { className: ['heading-anchor__symbol'] },
        children: [{ type: 'text', value: '¶' }],
      },
    },
  ],
];

// https://astro.build/config
export default defineConfig({
  site: 'https://drafters.vercel.app',
  trailingSlash: 'never',
  integrations: [
    mdx({
      remarkPlugins: [remarkWikiLinks, remarkParagraphIds],
      rehypePlugins,
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkWikiLinks, remarkParagraphIds],
    rehypePlugins,
    smartypants: false,
  },
  vite: {
    ssr: {
      noExternal: ['@fontsource-variable/source-serif-4', '@fontsource-variable/jetbrains-mono'],
    },
  },
});
