import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      featured: z.boolean().default(false),
      thumbnail: image(),
      thumbnailAlt: z.string(),
      images: z.array(image()).optional(),
      techStack: z.array(z.string()),
      // Headline numbers shown on cards and the project page, e.g. { value: '23%', label: 'Faster dock-to-truck' }
      stats: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .max(4)
        .default([]),
      liveUrl: z.string().url().optional(),
      githubUrl: z.string().url().optional(),
      // 'active' = in development, 'in-design' = spec stage. Non-complete projects
      // use completedDate as their last-updated date.
      status: z.enum(['complete', 'active', 'in-design']).default('complete'),
      completedDate: z.date(),
      // Homepage order for featured projects (lower first); others follow by date.
      order: z.number().optional(),
      category: z.enum(['web', 'mobile', 'desktop', 'tools', 'hardware', 'ml', 'engineering']),
    }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, blog };
