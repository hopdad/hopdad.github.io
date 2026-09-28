import { getCollection, type CollectionEntry } from 'astro:content';

// Checking for files first keeps builds quiet while the blog is still empty.
const hasPostFiles = Object.keys(import.meta.glob('/src/content/blog/**/*.{md,mdx}')).length > 0;

/** Published posts, newest first. Drafts are included in dev only. */
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  if (!hasPostFiles) return [];
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
