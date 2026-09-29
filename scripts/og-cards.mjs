// Renders a 1200×630 share card for every project into src/assets/og/<slug>.jpg:
// the title on the left, the project's illustration on the right, in the site's fonts.
// Project pages pick these up automatically; a project without a card falls back to
// public/og-default.png.
//
// Re-run after changing a project's title, category, status, or illustration:
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/og-cards.mjs [slug ...]
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Needs Playwright: npm i --no-save playwright && npx playwright install chromium');
  process.exit(1);
}

const root = new URL('../', import.meta.url);
const projectsDir = new URL('src/content/projects/', root);
const outDir = new URL('src/assets/og/', root);
// Fonts and artwork are inlined as data URIs: a page built with setContent can't load file:// URLs.
const dataUri = (url, type) => `data:${type};base64,${readFileSync(url).toString('base64')}`;
const font = (path) =>
  dataUri(new URL(`node_modules/@fontsource-variable/${path}`, root), 'font/woff2');

// Mirrors src/lib/projects.ts.
const categoryLabel = {
  web: 'Web platform',
  mobile: 'Mobile',
  desktop: 'Desktop software',
  tools: 'Tooling',
  hardware: 'Hardware',
  ml: 'Machine learning',
  engineering: 'Process engineering',
};
const statusLabel = { active: 'In development', 'in-design': 'In design' };

function frontmatter(source) {
  const block = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  return (key) => {
    const value = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim();
    return value?.replace(/^(['"])(.*)\1$/, '$2');
  };
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const fonts = {
  display: font('fraunces/files/fraunces-latin-opsz-normal.woff2'),
  mono: font('jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'),
};

const logo = `<svg viewBox="0 0 32 32" fill="none"><path d="M16 3.5C23.5 3.2 29 8.6 28.6 16.2 28.2 23.6 22.6 28.8 15.4 28.5 8.4 28.2 3.2 23 3.5 15.8 3.8 8.8 8.8 3.8 16 3.5Z" stroke="currentColor" stroke-width="1.5" opacity=".55"/><path d="M17.2 7.6C22.2 7.6 25 11.4 24.6 16 24.2 20.8 20.6 23.4 16.2 23.2 11.6 23 8.6 19.6 8.9 15.2 9.2 10.8 12.4 7.6 17.2 7.6Z" stroke="currentColor" stroke-width="1.5" opacity=".8"/><path d="M18.4 10.2C21.2 10.2 22.2 12.4 21.9 14.4 21.6 16.8 19.6 18.2 17.4 17.9 15 17.6 13.9 15.8 14.2 13.8 14.5 11.6 16.2 10.2 18.4 10.2Z" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="14" r="1.7" fill="#C75B30"/></svg>`;

const card = ({ title, meta, art }) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Fraunces'; src: url('${fonts.display}') format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Mono'; src: url('${fonts.mono}') format('woff2'); font-weight: 100 900; }
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; color: #F4EFE3; background:
    radial-gradient(640px circle at 0 0, rgb(236 146 104 / 0.12), transparent 70%),
    linear-gradient(160deg, #1B3A4B, #132B39); }
  .text { position: absolute; left: 72px; top: 68px; bottom: 64px; width: 420px; display: flex; flex-direction: column; }
  .eyebrow { font: 500 15px/1.4 'Mono'; letter-spacing: .16em; text-transform: uppercase; color: #EC9268; display: flex; align-items: center; gap: 16px; }
  .eyebrow::before { content: ''; flex: none; width: 40px; height: 1.5px; background: currentColor; opacity: .7; }
  h1 { margin: 34px 0 0; font-family: 'Fraunces'; font-variation-settings: 'opsz' 144; font-weight: 500;
    font-size: 64px; line-height: 1.03; letter-spacing: -0.03em; }
  .foot { margin-top: auto; display: flex; align-items: center; gap: 14px; }
  .foot svg { width: 42px; height: 42px; flex: none; }
  .name { font: 600 23px/1.2 'Fraunces'; font-variation-settings: 'opsz' 72; }
  .url { margin-top: 4px; font: 500 13px/1.3 'Mono'; letter-spacing: .14em; text-transform: uppercase; color: #BABFB9; }
  .art { position: absolute; top: 0; right: 0; width: 640px; height: 630px; overflow: hidden;
    border-left: 1px solid rgb(244 239 227 / 0.16); }
  .art img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style></head><body>
  <div class="text">
    <div class="eyebrow">${escape(meta)}</div>
    <h1>${escape(title)}</h1>
    <div class="foot">${logo}<div><div class="name">Derrick Hopson</div><div class="url">hopdad.github.io</div></div></div>
  </div>
  <div class="art"><img src="${art}" alt=""></div>
</body></html>`;

const only = process.argv.slice(2);
const projects = readdirSync(projectsDir)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => {
    const get = frontmatter(readFileSync(new URL(file, projectsDir), 'utf8'));
    const status = get('status') ?? 'complete';
    const timing = status === 'complete' ? get('completedDate').slice(0, 4) : statusLabel[status];
    return {
      slug: file.replace(/\.mdx?$/, ''),
      title: get('title'),
      meta: `${categoryLabel[get('category')]} · ${timing}`,
      art: dataUri(new URL(get('thumbnail'), new URL(file, projectsDir)), 'image/svg+xml'),
    };
  })
  .filter(({ slug }) => !only.length || only.includes(slug));

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
// Reduced motion freezes the illustrations' animations in their resting state.
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  reducedMotion: 'reduce',
});
for (const project of projects) {
  await page.setContent(card(project), { waitUntil: 'load' });
  await page.evaluate(async () => {
    await Promise.all([document.fonts.ready, document.querySelector('.art img').decode()]);
    // Shrink long titles until they leave room for the footer.
    const h1 = document.querySelector('h1');
    let size = 64;
    while (h1.offsetHeight > 300 && size > 40) h1.style.fontSize = `${(size -= 2)}px`;
  });
  // JPEG keeps the repo light; social sites re-compress previews anyway.
  const path = fileURLToPath(new URL(`${project.slug}.jpg`, outDir));
  await page.screenshot({ path, type: 'jpeg', quality: 90 });
  console.log('wrote', pathToFileURL(path).pathname.replace(fileURLToPath(root), ''));
}
await browser.close();
