import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '@/config';
import { getPosts } from '@/lib/blog';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: `${site.name} — Blog`,
    description: site.description,
    site: context.site ?? 'https://hopdad.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
    })),
  });
}
