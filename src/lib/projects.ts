import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export const categoryLabel: Record<Project['data']['category'], string> = {
  web: 'Web',
  mobile: 'Mobile',
  desktop: 'Desktop',
  tools: 'Tools',
  hardware: 'Hardware',
  ml: 'Machine learning',
  engineering: 'Process engineering',
};

/** All projects, newest first. */
export async function getProjects(filter?: (project: Project) => boolean): Promise<Project[]> {
  const projects = await getCollection('projects', filter);
  return projects.sort((a, b) => b.data.completedDate.valueOf() - a.data.completedDate.valueOf());
}

/** Zero-padded index label, e.g. 1 → "01". */
export const pad = (n: number) => String(n).padStart(2, '0');
