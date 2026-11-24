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
    'I build AI systems that turn one idea into posts, reply to your DMs, and send ready buyers straight to you, so you stop doing it all by hand.',
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
      label: 'real systems built and ready to inspect, each with its own walkthrough',
      sourceLabel: 'See all three',
      href: '/#work',
    },
    {
      value: '83',
      label: 'automated tests passed on our Instagram and Facebook DM system',
      sourceLabel: 'DM Auto-Reply System',
      href: '/work/meta-dm-qualifier/',
    },
    {
      value: '5',
      label: 'social platforms fed from one idea, used every day',
      sourceLabel: 'Content Planning System',
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
  kicker: 'Featured build',
  heading: 'The DM system that follows your rules',
  lead: 'People ask real questions in your Instagram and Facebook DMs. This system answers using your real business info, never makes up prices, and pauses the moment you jump in.',
  facts: [
    '83 automated tests passing',
    'Pauses itself on any chat you answer by hand',
    'Checks every message so no customer gets a double reply',
  ],
  status: 'In testing (waiting on Meta approval)',
  beforeLabel: 'Before',
  beforeNote: 'Answering by hand (illustration)',
  afterLabel: 'After',
  afterNote: 'Private dashboard, test demo data',
  sliderLabel: 'Compare the manual inbox with the system dashboard',
  linkLabel: 'See how it works',
  href: '/work/meta-dm-qualifier/',
};

export const PILLARS_COPY: PillarsCopy = {
  heading: 'It takes both halves',
  lead: 'Automation without marketing judgment just sends the wrong message faster. So I do both.',
  pillars: [
    {
      title: 'I build the systems.',
      text: 'Every automation is custom-built, tested, and written down in plain English before it ever talks to a real customer.',
      bullets: [
        { icon: 'shield', text: 'Built-in safety checks so no customer ever gets a double reply' },
        { icon: 'eye', text: 'Test mode first, so you review replies before going live' },
        { icon: 'doc', text: 'Simple guides so your team can run it without me' },
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
      text: 'As Marketing Head and Co-Founder of Spawntel, I plan the message behind the tech, so your automation says the right thing to the right buyer.',
      bullets: [
        { icon: 'funnel', text: 'We fix what turns viewers into buyers before chasing more views' },
        { icon: 'layers', text: 'One strong idea turned into posts for five social platforms' },
        { icon: 'buyer', text: "Every post is reviewed from a customer's point of view before it's made" },
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
  heading: 'Fix your biggest time-waster first',
  lead: 'Tell us where you lose the most time in marketing, and our team at Spawntel will map out the right system before we build a thing.',
};

export const SYSTEM_TIER_CARDS: readonly SystemTierCard[] = [
  {
    badge: 'Content',
    title: 'Content Systems',
    subtitle: 'Turn one idea or website link into posts for 5 platforms.',
    ctaPlacement: 'systems-content',
    bullets: [
      'Pulls your brand colors, voice, and style from your site',
      'Adapts one idea for IG, FB, LinkedIn, X, and Threads',
      'Fast, lightweight visuals ready to post',
      'Organized folders with captions, images, and posting notes',
    ],
  },
  {
    badge: 'Most Requested',
    title: 'DM & Comment Auto-Reply',
    subtitle: 'Safe Instagram and Facebook replies that pause when you step in.',
    featured: true,
    ctaPlacement: 'systems-dm',
    bullets: [
      'Handles Instagram and Facebook DMs and comments',
      'Follows your exact rules and never makes up prices',
      'Pauses automatically the moment you reply yourself',
      'Simple lead dashboard with one-click spreadsheet export',
    ],
  },
  {
    badge: 'Full Stack',
    title: 'Full Marketing Setup',
    subtitle: 'Your content system, brand rules, and fast web pages in one place.',
    ctaPlacement: 'systems-ops',
    bullets: [
      'One shared guide for your brand voice and posting history',
      'Clean handoff from content ideas to finished visuals',
      'Fast-loading landing pages built to book calls',
      'Instant alerts when visitors click to book',
    ],
  },
];

export const PROCESS_SECTION_COPY: SectionHeadingCopy = {
  pill: 'How it works',
  heading: 'How we get your system running',
};

export const PROCESS_STEPS: readonly ProcessStepItem[] = [
  {
    step: '01',
    title: 'Free 30-minute call',
    text: 'You tell us where content, DMs, or follow-ups are taking up too much of your time.',
  },
  {
    step: '02',
    title: 'Map how you work today',
    text: 'I look at how your marketing actually runs right now before automating anything.',
  },
  {
    step: '03',
    title: 'Build with safety rules',
    text: 'Brand rules, test mode, and instant human takeover come built in from day one.',
  },
  {
    step: '04',
    title: 'Hand over with simple guides',
    text: 'You get a working system, clear guides, and a setup your team can run on their own.',
  },
];

export const WORK_SECTION_COPY: SectionHeadingCopy = {
  pill: 'The Work',
  heading: "Systems I've built",
  lead: 'Three real systems with safety rules built in. Click any one to see how it works.',
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
    'Understand how you work first, then automate it.',
    'Add safety rules so AI never makes up prices or traps customers in a bot loop.',
    'Show real working systems, not empty promises.',
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
  accessibleTitle: 'Ready to stop doing marketing by hand?',
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
    { label: 'DM Auto-Reply System', href: '/work/meta-dm-qualifier/' },
    { label: 'Post Generator', href: '/work/brand-dna-creative-pipeline/' },
    { label: 'Content Planning System', href: '/work/multi-agent-marketing-brain/' },
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
