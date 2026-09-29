import type { APIContext } from 'astro';

// Let every crawler in and point it at the sitemap from @astrojs/sitemap.
export function GET(context: APIContext) {
  const sitemap = new URL('sitemap-index.xml', context.site ?? 'https://hopdad.github.io');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
