import type { FunnelPlacement } from '../../shared/funnel';

export interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

export interface SiteIdentity {
  brandName: string;
  wordmark: string;
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
  headline: string;
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  plateTagline: string;
  portraitAlt: string;
}

export interface ProofStat {
  value: string;
  label: string;
  sourceLabel: string;
  href: string;
}

export interface ProofNumbersCopy {
  buildsLabel: string;
  heading: string;
  stats: readonly ProofStat[];
  manifestoLead: string;
  manifestoPayoff: string;
  ctaLabel: string;
}

export interface FlagshipCopy {
  kicker: string;
  heading: string;
  lead: string;
  facts: readonly string[];
  status: string;
  beforeLabel: string;
  beforeNote: string;
  afterLabel: string;
  afterNote: string;
  sliderLabel: string;
  linkLabel: string;
  href: string;
}

export type PillarIcon = 'shield' | 'eye' | 'doc' | 'funnel' | 'layers' | 'buyer';

export interface PillarItem {
  title: string;
  text: string;
  bullets: readonly { icon: PillarIcon; text: string }[];
  image: { src: string; width: number; height: number; alt: string; fit: 'contain' | 'cover' };
}

export interface PillarsCopy {
  heading: string;
  lead: string;
  pillars: readonly PillarItem[];
}

export interface ProblemCardItem {
  id: 'radar' | 'stack' | 'chat' | 'wall';
  title: string;
  description: string;
}

export interface SystemTierCard {
  badge: string;
  title: string;
  subtitle: string;
  featured?: boolean;
  ctaPlacement: FunnelPlacement;
  bullets: readonly string[];
}

export interface ProcessStepItem {
  step: string;
  title: string;
  text: string;
}

export interface SectionHeadingCopy {
  pill: string;
  heading: string;
  lead?: string;
}

export interface FounderPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface FounderCopy {
  pill: string;
  heading: string;
  lead: string;
  paragraphs: readonly string[];
  teamHeading: string;
  teamMembers: readonly string[];
  principlesHeading: string;
  principles: readonly string[];
  photos: readonly FounderPhoto[];
}

export interface CtaCopy {
  id: string;
  pill: string;
  accessibleTitle: string;
  barPrompt: string;
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
  wordmark: string;
  email: string;
  mailto: string;
  siteLinks: readonly FooterLink[];
  buildLinks: readonly FooterLink[];
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
  wordmark: 'BENERU',
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
  { label: 'Systems', href: '/#systems', sectionId: 'systems' },
  { label: 'Process', href: '/#process', sectionId: 'process' },
  { label: 'Work', href: '/#work', sectionId: 'work' },
  { label: 'About', href: '/#about', sectionId: 'about' },
];

export const HERO_COPY: HeroCopy = {
  headline: "Marketing shouldn't run on manual hustle",
  subtitle:
    'I design and build AI systems for content workflows, inbound DM qualification, and lead routing so business owners stop doing it by hand.',
  primaryCtaLabel: 'Book a Call',
  secondaryCtaLabel: 'See the Work',
  secondaryCtaHref: '/#work',
  plateTagline: 'BUILD THE SYSTEM',
  portraitAlt:
    'Reuben Magallanes, Marketing Head and Co-Founder of Spawntel, personal brand Beneru',
};

export const PROOF_NUMBERS_COPY: ProofNumbersCopy = {
  buildsLabel: 'Built and documented',
  heading: 'Numbers I can back up.',
  stats: [
    {
      value: '3',
      label: 'systems built and documented, each with its own proof page',
      sourceLabel: 'See all three',
      href: '/#work',
    },
    {
      value: '83',
      label: 'automated end-to-end checks passing on the Meta DM workers',
      sourceLabel: 'Meta DM Qualifier',
      href: '/work/meta-dm-qualifier/',
    },
    {
      value: '5',
      label: 'channels from one approved idea, in daily use',
      sourceLabel: 'Marketing Brain',
      href: '/work/multi-agent-marketing-brain/',
    },
  ],
  manifestoLead: "I don't bolt AI onto your marketing. I build the system it runs on.",
  manifestoPayoff: 'You get your hours back.',
  ctaLabel: 'Book a free call',
};

export const PROBLEM_SECTION_COPY: SectionHeadingCopy = {
  pill: 'The Problem',
  heading: 'Everything in marketing still runs through you',
};

export const PROBLEM_CARDS: readonly ProblemCardItem[] = [
  {
    id: 'radar',
    title: 'Scattered tools and briefs',
    description: 'Hooks, captions, assets, and DMs live across five apps and one head.',
  },
  {
    id: 'stack',
    title: 'Unanswered DMs and comments',
    description: 'Warm leads go quiet on Instagram and Facebook while you are busy delivering.',
  },
  {
    id: 'chat',
    title: 'Manual creative repetition',
    description: 'Rewriting the same offer for five channels and chasing visuals every week.',
  },
  {
    id: 'wall',
    title: 'No documented brand brain',
    description: 'Prompts sit in random chats, so voice and quality break when you delegate.',
  },
];

export const FLAGSHIP_COPY: FlagshipCopy = {
  kicker: 'Flagship build',
  heading: 'The build that proved the approach',
  lead: 'Leads ask real questions in Instagram and Facebook DMs. This engine answers from your actual business rules, never invents a price, and steps aside the moment you type.',
  facts: [
    '83 automated end-to-end checks passing',
    'Pauses itself on any thread you answer by hand',
    'Every webhook signature-checked before a reply goes out',
  ],
  status: 'Dry run, pending Meta App Review',
  beforeLabel: 'Before',
  beforeNote: 'Answering by hand (illustration)',
  afterLabel: 'After',
  afterNote: 'Private dashboard, dry-run demo data',
  sliderLabel: 'Compare the manual inbox with the system dashboard',
  linkLabel: 'Read the technical breakdown',
  href: '/work/meta-dm-qualifier/',
};

export const PILLARS_COPY: PillarsCopy = {
  heading: 'It takes both halves',
  lead: 'Automation without marketing judgment just sends the wrong message faster. So I do both.',
  pillars: [
    {
      title: 'I build the systems.',
      text: 'Cloudflare Workers, Meta Graph API webhooks and Python pipelines, written, tested and documented before anything touches a real customer.',
      bullets: [
        { icon: 'shield', text: 'Webhooks verified and deduplicated, so no lead gets two replies' },
        { icon: 'eye', text: 'Dry-run mode by default, so you read every reply before it goes live' },
        { icon: 'doc', text: 'Technical write-ups your team can run without me' },
      ],
      image: {
        src: '/assets/proof/meta-dm-architecture.svg',
        width: 960,
        height: 480,
        alt: 'Architecture flow of the Meta DM engine: webhook intake, signature check, business-rule guardrails, human takeover pause, and Cloudflare D1 logging',
        fit: 'contain',
      },
    },
    {
      title: 'And I run the marketing.',
      text: 'As Marketing Head and Co-Founder of Spawntel, I plan the content these systems carry, so the automation says the right thing to the right person.',
      bullets: [
        { icon: 'funnel', text: 'Funnel gaps checked before chasing more reach' },
        { icon: 'layers', text: 'One idea adapted natively for five channels' },
        { icon: 'buyer', text: "Every brief critiqued from the buyer's side before production" },
      ],
      image: {
        src: '/images/founder/reuben-outdoor.webp',
        width: 800,
        height: 1000,
        alt: 'Reuben Magallanes outdoors at golden hour',
        fit: 'cover',
      },
    },
  ],
};

export const SYSTEMS_SECTION_COPY: SectionHeadingCopy = {
  pill: 'Systems',
  heading: 'Fix one bottleneck, then scale the stack',
  lead: 'Scope first, then build. Tell us where marketing time is leaking and our team at Spawntel will map the workflow that fits.',
};

export const SYSTEM_TIER_CARDS: readonly SystemTierCard[] = [
  {
    badge: 'Content',
    title: 'AI Content Workflows',
    subtitle: 'One brief or live URL turned into 5-channel assets.',
    ctaPlacement: 'systems-content',
    bullets: [
      'Live URL Brand DNA extraction',
      '5-channel native content cascades',
      'Compressed WebP visual assets',
      'Structured brief and asset manifests',
    ],
  },
  {
    badge: 'Most Requested',
    title: 'Inbound DM Systems',
    subtitle: 'Official Meta Graph API replies with human takeover.',
    featured: true,
    ctaPlacement: 'systems-dm',
    bullets: [
      'IG and FB DM and comment webhooks',
      'Strict pricing and business-rule guardrails',
      'Automatic pause on manual owner reply',
      'Private lead dashboard and CSV export',
    ],
  },
  {
    badge: 'Full Stack',
    title: 'Marketing Ops & Funnel',
    subtitle: 'Multi-agent production and conversion web pages.',
    ctaPlacement: 'systems-ops',
    bullets: [
      'Shared brand brain and content ledger',
      'Planning-to-creative handoff workflow',
      'Fast edge pages on Cloudflare',
      'UTM and click-placement alerts',
    ],
  },
];

export const PROCESS_SECTION_COPY: SectionHeadingCopy = {
  pill: 'How it works',
  heading: 'From messy workflow to running system',
};

export const PROCESS_STEPS: readonly ProcessStepItem[] = [
  {
    step: '01',
    title: 'Free 30-minute call',
    text: 'You tell us where content, DMs, or lead follow-up are breaking right now.',
  },
  {
    step: '02',
    title: 'Map the real workflow',
    text: 'I look at how your marketing actually moves today before automating a single step.',
  },
  {
    step: '03',
    title: 'Build with guardrails',
    text: 'Strict brand rules, dry-run checks, and human takeover pauses come built in.',
  },
  {
    step: '04',
    title: 'Document and hand over',
    text: 'You get working infrastructure, clean docs, and a system your team can actually run.',
  },
];

export const WORK_SECTION_COPY: SectionHeadingCopy = {
  pill: 'The Work',
  heading: "Systems I've actually shipped",
  lead: 'Three builds, each documented down to its guardrails. Open any of them to see how it works.',
};

export const FOUNDER_COPY: FounderCopy = {
  pill: 'About',
  heading: "Who's behind Beneru",
  lead: "I'm Reuben Magallanes (most people call me Ben). I'm a creative person at heart who loves making things, and today I'm a self-taught Marketing Head and Co-Founder at Spawntel. Beneru is my personal brand where I document the AI marketing systems we build.",
  paragraphs: [
    'Back in senior high school, building a business was not on my radar. I lived a normal life, played games, had unclear goals, and tried a bit of everything. My mindset started to change when I entered college, joined our school publication, and became the creative lead. Over time, Jay Canete noticed my skills from the work I published and invited me to join his startup, AUTOBIT, as marketing manager.',
    'After a few months, I stepped back because my school projects had piled up and I thought I needed to focus on classes. Slowly, though, I realized building in a startup was where I actually belonged. My drive did not match the course I was taking, so I dropped out in my second year. Through hands-on experience together with my team, Jay Canete, Argelo Nunez, Jairus Catana, Winston Elligue, Vince Pana, and Paolo Desio, we built Spawntel to help business owners grow by building sustainable systems so they can focus on their product or service.',
  ],
  teamHeading: 'Built together with the Spawntel team',
  teamMembers: [
    'Jay Canete',
    'Argelo Nunez',
    'Jairus Catana',
    'Winston Elligue',
    'Vince Pana',
    'Paolo Desio',
  ],
  principlesHeading: 'How I work',
  principles: [
    'Understand the workflow first, then automate it.',
    'Build guardrails so AI never invents prices or traps buyers in a bot loop.',
    'Show working systems, not slide-deck promises.',
  ],
  photos: [
    {
      src: '/images/founder/reuben-portrait.webp',
      width: 900,
      height: 900,
      alt: 'Portrait of Reuben Magallanes in a black blazer, white shirt and glasses against a Spawntel violet backdrop',
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
  id: 'contact',
  pill: 'Get Started',
  accessibleTitle: 'Ready to systemize your marketing for good?',
  barPrompt: 'Pick a time for a free 30-minute call on Spawntel',
  primaryCtaLabel: 'Book a Call',
  secondaryCtaLabel: 'Message on Instagram',
  secondaryCtaHandle: '@Beneru.ai',
};

export const FOOTER_COPY: FooterCopy = {
  brandName: 'Beneru',
  wordmark: 'BENERU',
  email: 'reubenmagallanes91@gmail.com',
  mailto: 'mailto:reubenmagallanes91@gmail.com',
  siteLinks: [
    { label: 'Systems', href: '/#systems' },
    { label: 'Process', href: '/#process' },
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Credentials', href: '/#credentials' },
  ],
  buildLinks: [
    { label: 'Meta DM Qualifier', href: '/work/meta-dm-qualifier/' },
    { label: 'Brand DNA Pipeline', href: '/work/brand-dna-creative-pipeline/' },
    { label: 'Marketing Brain', href: '/work/multi-agent-marketing-brain/' },
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
