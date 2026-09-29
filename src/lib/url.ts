// Helper so internal links always respect the Astro `base` path.
// Usage: <a href={url('/projects')}>Projects</a> → href="/projects/"
const base = import.meta.env.BASE_URL; // includes trailing slash when base is set

export function url(path: string): string {
  if (!path) return base;
  // Allow external URLs and hash-only links to pass through
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  if (path.startsWith('#')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  // base ends with '/' when non-empty; fall back to '/' if not
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${withTrailingSlash(clean)}`;
}

// Pages build to folders, so "/projects/" is the canonical address and GitHub Pages
// redirects "/projects" to it. Link there directly; leave files and bare #hashes alone.
function withTrailingSlash(path: string): string {
  const [, pathname = '', rest = ''] = path.match(/^([^?#]*)(.*)$/) ?? [];
  if (!pathname || pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname)) return path;
  return `${pathname}/${rest}`;
}
