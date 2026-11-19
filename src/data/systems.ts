export interface SystemItem {
  id: string;
  title: string;
  description: string;
  outputs: readonly string[];
  relatedBuildSlug?: string;
}

export const SYSTEMS_LIST: readonly SystemItem[] = [
  {
    id: 'ai-content-workflows',
    title: 'AI Content Workflows',
    description:
      'Turn one core brief, video, or website URL into platform-native posts, creative briefs, and brand-consistent visuals across Instagram, LinkedIn, Facebook, X, and Threads.',
    outputs: ['Brand DNA extraction', '5-channel content cascades', 'Compressed WebP creative assets'],
    relatedBuildSlug: 'brand-dna-creative-pipeline',
  },
  {
    id: 'inbound-dm-qualification',
    title: 'Inbound DM & Comment Qualification',
    description:
      'Official Meta Graph API workflows that reply using your real prices and rules, qualify intent, log inquiries in one dashboard, and step back immediately when you reply by hand.',
    outputs: ['IG & FB webhook handlers', 'Automatic human takeover pause', 'Private lead queue & CSV export'],
    relatedBuildSlug: 'meta-dm-qualifier',
  },
  {
    id: 'conversion-pages-funnel-routing',
    title: 'Conversion Pages & Funnel Routing',
    description:
      'Fast, focused web pages that answer buyer questions upfront, track high-intent clicks cleanly, and send qualified visitors straight to your booking calendar.',
    outputs: ['Static edge pages on Cloudflare', 'UTM & click-placement alerts', 'Clean schema & privacy routing'],
  },
  {
    id: 'multi-agent-marketing-operations',
    title: 'Multi-Agent Marketing Operations',
    description:
      'Shared brand brains, content ledgers, and structured planning-to-creative handoffs so marketing runs on a repeatable process instead of scattered chats.',
    outputs: ['Locked brand & voice rules', 'Funnel-balanced planning briefs', 'Structured production handoffs'],
    relatedBuildSlug: 'multi-agent-marketing-brain',
  },
];
