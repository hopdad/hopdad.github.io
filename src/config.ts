// Single source of truth for site-wide content.
export const site = {
  name: 'Derrick Hopson',
  title: 'Engineer & Builder',
  tagline: 'I build things that work — in code, in the garage, and on the warehouse floor.',
  location: 'Michigan',
  timeZone: 'America/Detroit',
  email: 'hopsonderrick@gmail.com',
  description:
    'Derrick Hopson is a Michigan engineer and builder with 15+ years of hands-on problem solving — machine-learning platforms, custom electronics, engine rebuilds, and warehouse process optimization.',
  social: {
    github: 'https://github.com/hopdad',
    // Add your LinkedIn profile URL to show LinkedIn links across the site.
    linkedin: '',
  },
  nav: [
    { href: '/projects', label: 'Work' },
    { href: '/#about', label: 'About' },
    // Shown automatically once a published post exists in src/content/blog/.
    { href: '/blog', label: 'Blog', requiresPosts: true },
    { href: '/#contact', label: 'Contact' },
  ],
};
