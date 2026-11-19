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
  lead: "I'm Reuben Magallanes (most people call me Ben). I'm a creative person at heart who loves making things, and today I'm a self-taught Marketing Head and Co-Founder at Spawntel. Beneru is my personal brand where I document the AI marketing systems we build.",
  paragraphs: [
    'Back in senior high school, building a business was not on my radar. I lived a normal life, played games, had unclear goals, and tried a bit of everything. My mindset started to change when I entered college, joined our school publication, and became the creative lead. Over time, Jay Canete noticed my skills from the work I published and invited me to join his startup, AUTOBIT, as marketing manager.',
    'After a few months, I stepped back because my school projects had piled up and I thought I needed to focus on classes. Slowly, though, I realized building in a startup was where I actually belonged. My drive did not match the course I was taking, so I dropped out in my second year. Through hands-on experience together with my team, Jay Canete, Argelo Nunez, Jairus Catana, Winston Elligue, Vince Pana, and Paolo Desio, we built Spawntel to help business owners grow by building sustainable systems so they can focus on their product or service.',
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
