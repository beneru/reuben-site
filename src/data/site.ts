export interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

export interface SiteIdentity {
  brandName: string;
  personName: string;
  shortName: string;
  alternateNames: readonly string[];
  role: string;
  companyName: string;
  companyUrl: string;
  siteUrl: string;
  niche: string;
  email: string;
  mailto: string;
  locationPublic: string;
}

export interface HeroCopy {
  eyebrow: string;
  headlineLead: string;
  headlineAccent: string;
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  portraitName: string;
  portraitRole: string;
  portraitAlt: string;
}

export interface ContextFact {
  label: string;
  value: string;
}

export interface SectionHeadingCopy {
  heading: string;
  lead: string;
}

export interface FounderPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface FounderCopy {
  heading: string;
  lead: string;
  paragraphs: readonly string[];
  principlesHeading: string;
  principles: readonly string[];
  photos: readonly FounderPhoto[];
}

export interface CtaCopy {
  id: string;
  headingLead: string;
  headingAccent: string;
  body: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  secondaryCtaHandle: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterCopy {
  brandName: string;
  summary: string;
  email: string;
  mailto: string;
  navigateLinks: readonly FooterLink[];
  copyrightHolder: string;
}

export interface SeoDefaults {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  personDescription: string;
  knowsAbout: readonly string[];
}

export const SITE_IDENTITY: SiteIdentity = {
  brandName: 'Beneru',
  personName: 'Reuben Magallanes',
  shortName: 'Ben',
  alternateNames: ['Beneru', 'Ben Magallanes'],
  role: 'Marketing Head & Co-Founder',
  companyName: 'Spawntel',
  companyUrl: 'https://spawntel.com',
  siteUrl: 'https://beneru.spawntel.com',
  niche: 'AI Direction & Marketing Systems',
  email: 'reubenmagallanes91@gmail.com',
  mailto: 'mailto:reubenmagallanes91@gmail.com',
  locationPublic: 'Based in the Philippines, working remotely worldwide',
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Work', href: '/#work', sectionId: 'work' },
  { label: 'Systems', href: '/#systems', sectionId: 'systems' },
  { label: 'About', href: '/#about', sectionId: 'about' },
];

export const HERO_COPY: HeroCopy = {
  eyebrow: 'AI Direction & Marketing Systems',
  headlineLead: "Marketing shouldn't run on ",
  headlineAccent: 'manual hustle.',
  subtitle:
    'I design and build AI systems for content workflows, inbound DM qualification, and lead routing so business owners stop doing it by hand.',
  primaryCtaLabel: 'Book on Spawntel',
  secondaryCtaLabel: "See what I've built",
  secondaryCtaHref: '/#work',
  portraitName: 'Reuben Magallanes',
  portraitRole: 'Marketing Head & Co-Founder, Spawntel',
  portraitAlt:
    'Reuben Magallanes, Marketing Head and Co-Founder of Spawntel, personal brand Beneru',
};

export const CONTEXT_FACTS: readonly ContextFact[] = [
  { label: 'Role', value: 'Marketing Head & Co-Founder, Spawntel' },
  { label: 'Focus', value: 'AI Direction & Marketing Systems' },
  { label: 'Working', value: 'Remote from the Philippines, with business owners worldwide' },
];

export const WORK_SECTION_COPY: SectionHeadingCopy = {
  heading: "Systems I've built",
  lead: 'Real software and marketing workflows behind Beneru and Spawntel, documented with how each build actually runs.',
};

export const SYSTEMS_SECTION_COPY: SectionHeadingCopy = {
  heading: 'What I build and direct',
  lead: 'Four marketing systems grounded in working code and daily operations. Full company workflow builds run through Spawntel.',
};

export const FOUNDER_COPY: FounderCopy = {
  heading: "Who's behind Beneru",
  lead: 'I am Reuben Magallanes, also known as Ben. Beneru is my personal brand for AI direction and marketing systems. Spawntel is my company, where I lead marketing as Co-Founder alongside Creative Head Jairus Catana.',
  paragraphs: [
    "I'm a self-taught builder based in the Philippines, working remotely with business owners worldwide. Before Spawntel, I co-founded AUTOBIT with my brother and ran operations across student programming bootcamps, college hardware and software thesis builds, and international client work.",
    'Most marketing bottlenecks come from broken processes, not lazy teams. At Spawntel we map how a business runs, standardize the messy steps, and build intelligent workflow systems around the tools the team already uses. Under Beneru, I document those builds in the open.',
  ],
  principlesHeading: 'How I work',
  principles: [
    'Understand the workflow first, then automate it.',
    'Build guardrails so AI never invents prices or traps buyers in a bot loop.',
    'Show working systems, not slide-deck promises.',
  ],
  photos: [
    {
      src: '/images/founder/reuben-studio.webp',
      width: 900,
      height: 900,
      alt: 'Studio portrait of Reuben Magallanes in a black blazer and glasses against a deep violet backdrop',
      caption: 'Reuben Magallanes (Ben), Marketing Head & Co-Founder of Spawntel',
    },
    {
      src: '/images/founder/reuben-outdoor.webp',
      width: 800,
      height: 1000,
      alt: 'Candid outdoor portrait of Reuben Magallanes during golden hour',
      caption: 'Building marketing and workflow systems remotely from the Philippines',
    },
  ],
};

export const CTA_COPY: CtaCopy = {
  id: 'spawntel',
  headingLead: 'Want a system like this ',
  headingAccent: 'in your business?',
  body: 'Strategy calls and custom builds run through Spawntel. Book a free 30-minute call and our team will map the one workflow costing you the most time.',
  primaryCtaLabel: 'Book a free call on Spawntel',
  secondaryCtaLabel: 'Message on Instagram',
  secondaryCtaHandle: '@Beneru.ai',
};

export const FOOTER_COPY: FooterCopy = {
  brandName: 'Beneru',
  summary:
    'Beneru is the personal brand of Reuben Magallanes, Marketing Head and Co-Founder of Spawntel.',
  email: 'reubenmagallanes91@gmail.com',
  mailto: 'mailto:reubenmagallanes91@gmail.com',
  navigateLinks: [
    { label: 'Work', href: '/#work' },
    { label: 'Systems', href: '/#systems' },
    { label: 'About', href: '/#about' },
    { label: 'Privacy', href: '/privacy/' },
  ],
  copyrightHolder: 'Beneru (Reuben Magallanes)',
};

export const SEO_DEFAULTS: SeoDefaults = {
  title: 'Reuben Magallanes (Beneru) | AI Direction & Marketing Systems',
  description:
    'Reuben Magallanes (Beneru), Marketing Head and Co-Founder of Spawntel. Documented AI marketing systems, inbound DM workflows, and content pipelines for business owners.',
  keywords:
    'Reuben Magallanes, Beneru, AI Direction, AI Marketing Systems, Spawntel, content repurposing systems, Meta DM automation, marketing workflows',
  ogImage: '/og-card.jpg',
  personDescription:
    'Reuben Magallanes (Beneru) is Marketing Head and Co-Founder of Spawntel. He designs and builds AI marketing systems, inbound DM workflows, and structured content pipelines for business owners.',
  knowsAbout: [
    'AI direction',
    'AI marketing systems',
    'content workflows',
    'inbound DM lead qualification',
    'Meta Graph API automation',
    'marketing operations',
  ],
};
