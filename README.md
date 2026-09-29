# Personal Website

Personal portfolio built with [Astro](https://astro.build) 4 + [Tailwind CSS](https://tailwindcss.com) 3, following [`portfolio-website-spec.pdf`](./portfolio-website-spec.pdf).

The design leans into the palette's outdoors roots: a live topographic contour map (drawn on a
`<canvas>`) behind the hero and contact sections, lake-chart and blueprint-style project
illustrations, Fraunces display type, and JetBrains Mono "map margin" labels.

## Stack

- **Framework:** Astro 4 (static output)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind + CSS custom properties for light/dark themes
- **Content:** Astro content collections (`projects`, `blog`) with zod schemas
- **Images:** `astro:assets`
- **Motion:** small vanilla TS modules; everything respects `prefers-reduced-motion` and works without JS
- **Deploy:** GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Commands

```sh
npm install     # install dependencies
npm run dev     # start dev server on :4321
npm run build   # build static site to ./dist
npm run preview # preview the built site locally
```

## Project structure

```
src/
├── assets/projects/      # project illustrations (SVG, 1200×800)
├── components/
│   ├── Hero.astro        # headline over the live contour map
│   ├── Topo.astro        # <canvas> wrapper for scripts/topo.ts
│   ├── Marquee.astro     # rust ticker of tools and disciplines
│   ├── Stats.astro       # "by the numbers" count-up row
│   ├── ProjectShowcase.astro  # sticky, stacking featured-project cards
│   ├── Process.astro     # "how I work" trail
│   ├── About.astro       # story, AI quote, three workbenches
│   ├── Contact.astro     # closing call to action + copy-email button
│   └── Header, Footer, SEO, ThemeToggle, SocialLinks, ...
├── config.ts             # site-wide name, tagline, email, socials, nav
├── content/
│   ├── config.ts         # projects + blog collection schemas
│   ├── projects/*.md     # project entries
│   └── blog/*.md         # blog posts (optional)
├── layouts/BaseLayout.astro
├── lib/                  # url(), project + blog helpers
├── pages/
│   ├── index.astro       # homepage
│   ├── projects/         # index + [slug] case-study pages
│   ├── blog/             # list + [slug] (nav link appears once a post exists)
│   ├── rss.xml.ts
│   └── 404.astro
├── scripts/
│   ├── topo/             # contour map: simplex noise + marching squares
│   │   ├── core.ts       #   renderer + render loop
│   │   ├── worker.ts     #   runs the loop on an OffscreenCanvas, off the main thread
│   │   └── index.ts      #   watches size/visibility/theme/pointer; main-thread fallback
│   └── motion.ts         # scroll reveals, count-up numbers, card spotlights
└── styles/global.css     # design tokens (light + dark), base styles, utilities
```

## Customizing

1. Edit `src/config.ts` — name, tagline, email, socials, nav. Set `social.linkedin` to your
   profile URL and LinkedIn links appear in the header menu, contact section, and footer.
2. Add projects under `src/content/projects/`. Frontmatter supports up to four headline `stats`:

   ```yaml
   stats:
     - value: '23%'
       label: 'Faster dock-to-truck time'
   ```

   Numbers count up on scroll; any unit (`%`, `+`, `×`) is set in the accent color.
   Projects with `featured: true` appear as stacked cards on the homepage, ordered by `order`
   (lowest first). For unfinished work, set `status: 'active'` (in development) or
   `status: 'in-design'`; the page then shows the status, and `completedDate` reads as the
   last-updated date.

3. Illustrations live in `src/assets/projects/` at 1200×800. On the homepage they're cropped to
   fit the card, so keep the important parts between x≈220 and x≈980.
4. Write blog posts in `src/content/blog/`. The Blog nav link shows up automatically once a
   published post exists.
5. `public/og-default.png` (1200×630) is the social-sharing image; `public/favicon.svg` is the
   tab icon.

## Search

The site ships what search engines look for: page titles led by your name (the home page adds
`site.alias`, "HopDad"), descriptions, canonical URLs, `sitemap-index.xml`, a `robots.txt` that
points to it, and structured data naming the site and linking Derrick Hopson, HopDad, and the
GitHub profile. The 404 page, and the blog until it has posts, are kept out of the index.

To get it into Google:

1. In [Google Search Console](https://search.google.com/search-console), add a **URL prefix**
   property for `https://hopdad.github.io/` and pick the **HTML tag** method.
2. Copy the `content="…"` value into `googleSiteVerification` in `src/config.ts`, merge to
   `main`, wait for the deploy, then click **Verify**.
3. Under **Sitemaps**, submit `sitemap-index.xml`. Then run **URL inspection** on the home page
   and click **Request indexing**.
4. Link to the site from the places people already find you — the **Website** field on your
   GitHub profile, LinkedIn (add it to `site.social.linkedin` too), and anywhere you post as
   HopDad.

[Bing Webmaster Tools](https://www.bing.com/webmasters) can import the Search Console property,
which covers Bing, DuckDuckGo, and Yahoo.

## Deployment

The site deploys to GitHub Pages on every push to `main`. The repo is
`hopdad.github.io` (user site), so it serves from `https://hopdad.github.io/`
with no base path.

Enable Pages in the repo's Settings → Pages → Source: GitHub Actions.

## Themes

Class-based (`darkMode: 'class'`), dark by default. A no-flash inline script in
`BaseLayout.astro` applies the saved theme before first paint; `ThemeToggle` persists the
choice and, where the View Transitions API is supported, reveals the new theme as a circle
expanding from the button. Page-to-page navigation uses native cross-document view
transitions, so project artwork morphs from its card into the case-study page in supporting
browsers.
