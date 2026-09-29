// Single source of truth for site-wide content.
export const site = {
  name: 'Derrick Hopson',
  // The handle people also search for; used in the home page title, footer, and structured data.
  alias: 'HopDad',
  title: 'Engineer & Builder',
  tagline: 'I build things that work — in code, in the garage, and on the warehouse floor.',
  location: 'Michigan',
  timeZone: 'America/Detroit',
  email: 'hopsonderrick@gmail.com',
  description:
    'Derrick Hopson (HopDad) is a Michigan engineer and builder with 15+ years of hands-on problem solving — machine-learning platforms, operations software, custom electronics, engine rebuilds, and warehouse process optimization.',
  // Google Search Console → Add property (URL prefix) → HTML tag: paste only the
  // content="…" value here, deploy, then click Verify.
  googleSiteVerification: 'TVoQKsjZKAdLnd7t-WAmN_1wOIPw1jvoLVUPiH3afmg',
  social: {
    github: 'https://github.com/hopdad',
    // Shown in the header menu, contact section, and footer; leave empty to hide.
    linkedin: 'https://www.linkedin.com/in/derrick-hopson-62b3b651',
  },
  nav: [
    { href: '/projects', label: 'Work' },
    { href: '/#about', label: 'About' },
    // Shown automatically once a published post exists in src/content/blog/.
    { href: '/blog', label: 'Blog', requiresPosts: true },
    { href: '/#contact', label: 'Contact' },
  ],
};
