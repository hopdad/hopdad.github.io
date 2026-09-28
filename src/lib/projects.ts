import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export const categoryLabel: Record<Project['data']['category'], string> = {
  web: 'Web platform',
  mobile: 'Mobile',
  desktop: 'Desktop software',
  tools: 'Tooling',
  hardware: 'Hardware',
  ml: 'Machine learning',
  engineering: 'Process engineering',
};

const statusLabel: Record<Project['data']['status'], string> = {
  complete: 'Completed',
  active: 'In development',
  'in-design': 'In design',
};

const monthYear = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });

/** Short timing tag for cards and lists: the year, or the status while unfinished. */
export const timingTag = ({ data }: Project) =>
  data.status === 'complete'
    ? String(data.completedDate.getUTCFullYear())
    : statusLabel[data.status];

/** Spec-sheet timing: "Completed · March 2024", or the status with a last-updated note. */
export const timingDetail = ({ data }: Project): { label: string; value: string; note?: string } =>
  data.status === 'complete'
    ? { label: statusLabel.complete, value: monthYear(data.completedDate) }
    : {
        label: 'Status',
        value: statusLabel[data.status],
        note: `Updated ${monthYear(data.completedDate)}`,
      };

/** All projects, newest first. */
export async function getProjects(filter?: (project: Project) => boolean): Promise<Project[]> {
  const projects = await getCollection('projects', filter);
  return projects.sort((a, b) => b.data.completedDate.valueOf() - a.data.completedDate.valueOf());
}

/** Featured projects in homepage order: explicit `order` first, then newest. */
export async function getFeatured(): Promise<Project[]> {
  const featured = await getProjects(({ data }) => data.featured);
  return featured.sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity));
}

/** Zero-padded index label, e.g. 1 → "01". */
export const pad = (n: number) => String(n).padStart(2, '0');
