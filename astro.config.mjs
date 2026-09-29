// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// The blog index is noindexed while it has no published posts, so it stays out of
// the sitemap until then too.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const hasPublishedPosts = (() => {
  try {
    return readdirSync(blogDir, { recursive: true })
      .map(String)
      .filter((file) => /\.mdx?$/.test(file))
      .some((file) => !/^draft:\s*true\s*$/m.test(readFileSync(new URL(file, blogDir), 'utf8')));
  } catch {
    return false; // no blog folder yet
  }
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://hopdad.github.io',
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({ filter: (page) => hasPublishedPosts || !page.endsWith('/blog/') }),
    mdx(),
  ],
  build: {
    assets: 'assets',
  },
});
