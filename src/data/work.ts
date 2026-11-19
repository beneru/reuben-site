export interface WorkVisual {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface WorkArchitectureStep {
  step: string;
  title: string;
  detail: string;
}

export interface WorkImplementationTrack {
  name: string;
  scope: string;
  highlights: readonly string[];
}

export interface WorkBuild {
  slug: string;
  title: string;
  category: string;
  year: number;
  statusLabel: string;
  featured?: boolean;
  summary: string;
  proofSummary: string;
  seoTitle: string;
  seoDescription: string;
  cardImage: WorkVisual;
  diagramImage?: WorkVisual;
  problem: string;
  architectureSummary: string;
  architectureSteps: readonly WorkArchitectureStep[];
  implementations?: readonly WorkImplementationTrack[];
  guardrails: readonly string[];
  verifiedFacts: readonly string[];
  stackTags: readonly string[];
  metaTags: readonly string[];
}

export const WORK_BUILDS: readonly WorkBuild[] = [
  {
    slug: 'meta-dm-qualifier',
    title: 'Rule-Safe Meta DM & Comment Qualification Engine',
    category: 'Inbound Lead Systems',
    year: 2026,
    statusLabel: 'Test-verified infrastructure (Dry-run pending Meta App Review)',
    featured: true,
    summary:
      'Built for Beneru and Spawntel across two Cloudflare Worker codebases to handle Instagram and Facebook comments and DMs using strict business rules, human takeover pauses, and private lead dashboards.',
    proofSummary:
      '83 automated end-to-end checks passing against mock Meta and Gemini APIs (31 on beneru-meta, 52 on spawntel-meta with CSV export).',
    seoTitle: 'Rule-Safe Meta DM & Comment Qualification Engine | Reuben Magallanes (Beneru)',
    seoDescription:
      'Architecture and guardrails behind beneru-meta and spawntel-meta: Cloudflare Workers, D1 storage, Meta Graph API webhooks, human takeover pauses, and 83 passing E2E checks.',
    cardImage: {
      src: '/assets/proof/meta-dm-dashboard.webp',
      width: 1280,
      height: 800,
      alt: 'Private Meta DM and insights dashboard rendered with dry-run demo data showing reply logs, handoff queue, and channel metrics',
      caption: 'Private dashboard view (rendered with synthetic dry-run demo data).',
    },
    diagramImage: {
      src: '/assets/proof/meta-dm-architecture.svg',
      width: 960,
      height: 480,
      alt: 'Architecture flow showing Meta Graph API webhooks routing through signature verification, business-rule guardrails, human takeover pauses, and Cloudflare D1 logging',
      caption: 'Webhook-to-takeover request flow across Meta Graph API, Gemini fallback chain, and Cloudflare D1.',
    },
    problem:
      'Generic button chatbots break the moment a prospect asks a real question, while unguarded AI bots risk hallucinating prices or trapping someone in an automated loop when the owner steps in.',
    architectureSummary:
      'Two purpose-built Cloudflare Workers sit behind Meta Graph API v24.0 webhooks with Cloudflare D1 persistence and Gemini model fallback chains. Webhook delivery is HMAC-SHA256 verified, deduplicated before processing, and answered asynchronously after returning an immediate 200 acknowledgement to Meta.',
    architectureSteps: [
      {
        step: '01',
        title: 'Verified Webhook Intake & Dedupe',
        detail:
          'Every incoming Messenger, Facebook comment, Instagram DM, and Instagram comment event is validated with the Meta App Secret signature and claimed once by message or comment ID in D1 so retries never double-reply.',
      },
      {
        step: '02',
        title: 'Strict Rule Prompting & Keyword Flows',
        detail:
          'Replies draw strictly from verified business rules (never inventing prices, timelines, or client names). Comment triggers can pair a short public comment reply with a private DM opener.',
      },
      {
        step: '03',
        title: 'Echo Detection & Automatic Human Takeover',
        detail:
          'Page message echoes are checked against stored bot message IDs and outbound timestamps. The moment a human types a manual reply, automation pauses on that thread so the bot never talks over the owner.',
      },
      {
        step: '04',
        title: 'Private Dashboard, Handoffs & Insights',
        detail:
          'A Basic-Auth protected /dashboard aggregates 6-hour IG and FB metrics snapshots, highlights threads waiting on human follow-up, and logs every received, sent, dry-run, or skipped turn.',
      },
    ],
    implementations: [
      {
        name: 'beneru-meta (Personal Brand Engine)',
        scope: 'Full-AI assistant across IG DMs, IG comments, FB Messenger, and FB comments.',
        highlights: [
          '12-hour automatic pause per thread whenever Reuben replies manually.',
          'Needs-Reuben handoff flag for pricing pushes, sensitive inquiries, or collab requests.',
          '6-hour scheduled Graph API insights collection (followers, reach, views, top posts) rendered on /dashboard.',
          '31 end-to-end tests passing against mock Meta and Gemini services.',
        ],
      },
      {
        name: 'spawntel-meta (Company Lead-Capture Engine)',
        scope: 'Keyword-triggered comment-to-DM qualification deployed on Cloudflare Workers in dry run.',
        highlights: [
          'Replies only to configured comment keywords with pre-approved opener templates, leaving non-keyword comments and general DMs untouched for human review.',
          '3-DM cap per lead (opener included) before automatically marking the lead for Reuben.',
          '30-day (720-hour) automatic pause on manual human takeover, plus D1 leads table and formula-safe /leads.csv export.',
          '52 end-to-end tests passing against mock Meta and Gemini services.',
        ],
      },
    ],
    guardrails: [
      'HMAC-SHA256 webhook signature check before parsing payloads.',
      'Event deduplication table and self-echo filtering prevent bot-to-bot reply loops.',
      '8-replies-per-hour ceiling per user across channels.',
      'Automatic dash and markdown stripping on model outputs plus human handoff when output fails JSON checks on public comments.',
      'DRY_RUN mode enabled by default so replies can be inspected in logs before public activation.',
    ],
    verifiedFacts: [
      '83 combined passing E2E assertions across beneru-meta (31) and spawntel-meta (52).',
      '12-hour human takeover pause on personal threads; 30-day pause and 3-DM cap on Spawntel lead threads.',
      'spawntel-meta deployed on Cloudflare Workers in dry-run mode pending Meta App Review.',
    ],
    stackTags: ['Cloudflare Workers', 'Cloudflare D1', 'TypeScript', 'Meta Graph API v24.0', 'Gemini API'],
    metaTags: ['Inbound DMs', 'Cloudflare D1', '83 E2E checks'],
  },
  {
    slug: 'brand-dna-creative-pipeline',
    title: 'Brand-DNA-to-Campaign Creative Engine',
    category: 'Content Systems',
    year: 2026,
    statusLabel: 'Verified end-to-end on beneru.spawntel.com',
    summary:
      'A local Python FastAPI service and CLI that reads any live website URL, extracts structured brand tokens into Brand DNA, drafts platform campaign copy, and outputs lightweight WebP assets with JSON manifests.',
    proofSummary:
      'Verified end-to-end against beneru.spawntel.com, rendering 5 1080x1350 WebP Instagram assets at 24 KB to 28 KB per image in the manifest run.',
    seoTitle: 'Brand-DNA-to-Campaign Creative Engine | Reuben Magallanes (Beneru)',
    seoDescription:
      'How the pomelli-bridge FastAPI service and CLI turns a live URL into structured Brand DNA JSON, campaign copy, and 24-32 KB WebP visual assets.',
    cardImage: {
      src: '/assets/proof/brand-dna-pipeline.svg',
      width: 960,
      height: 480,
      alt: 'Pipeline diagram from live website URL to Brand DNA JSON extraction, campaign copy generation, and compressed WebP outputs with manifest tracking',
      caption: 'Four-stage asset pipeline from live URL scrape to WebP visual manifest.',
    },
    problem:
      'Generating marketing visuals one prompt at a time produces inconsistent colors, generic copy, and oversized image files without a reusable link back to the brand or campaign brief.',
    architectureSummary:
      'Built as a FastAPI REST service (REST API + CLI) behind a clean CreativeProvider interface backed by the Gemini API. The service separates brand ingestion, campaign ideation, and asset rendering into asynchronous or synchronous jobs with disk-cached Brand DNA and lightweight path-based responses.',
    architectureSteps: [
      {
        step: '01',
        title: 'Live Site Brand DNA Extraction',
        detail:
          'BeautifulSoup scrapes live metadata, CSS variables, color values, font families, and copy from a target URL, structuring them into a cached brand_dna.json profile.',
      },
      {
        step: '02',
        title: 'Channel Campaign Generation',
        detail:
          'Takes a brand ID, short brief, and target channels (such as Instagram, Facebook, or TikTok) to generate hooks, captions, calls to action, hashtags, and conditioned visual prompts in campaign.json.',
      },
      {
        step: '03',
        title: 'Aspect-Locked Asset Rendering & WebP Optimization',
        detail:
          'Generates visuals using a Gemini model fallback chain, resizes to the requested ratio (such as 4:5 1080x1350), and compresses outputs via Pillow into 24 KB to 32 KB WebP files.',
      },
      {
        step: '04',
        title: 'Structured Output Manifests',
        detail:
          'Every campaign writes a self-contained folder with campaign.json and manifest.json mapping asset IDs, prompts, dimensions, and byte sizes while API endpoints return local paths under 15 KB instead of base64 blobs.',
      },
    ],
    guardrails: [
      'Disk-cached Brand DNA per URL avoids redundant site scrapes and API overhead.',
      'Model fallback chain handles upstream rate limits across Gemini Flash tiers.',
      'Default WebP compression reduces payload weight compared to raw PNG outputs.',
      'Structured job endpoints (/brand, /campaign, /assets, /jobs/{id}) isolate errors cleanly.',
    ],
    verifiedFacts: [
      'Verified end-to-end against https://beneru.spawntel.com via cli.py and REST API.',
      'Manifest run produced 5 1080x1350 WebP assets ranging from 24,110 bytes to 28,428 bytes (24 KB to 32 KB typical WebP output range across sample runs).',
      'JSON manifest, campaign copy, and Brand DNA schemas saved alongside rendered files for downstream review.',
    ],
    stackTags: ['Python', 'FastAPI', 'Gemini API', 'BeautifulSoup', 'Pillow WebP'],
    metaTags: ['Python FastAPI', 'Brand DNA JSON', '24-32 KB WebP'],
  },
  {
    slug: 'multi-agent-marketing-brain',
    title: 'Multi-Agent Marketing Planning & Production System',
    category: 'AI Direction',
    year: 2026,
    statusLabel: 'Active daily system for Beneru and Spawntel',
    summary:
      'A markdown operating system separating marketing direction (Milo) from creative asset production (Remy), wired with brand contrast rules, a cross-platform content ledger, and structured handoff packets.',
    proofSummary:
      'Enforces WCAG contrast checks, zero-dash voice rules, 5-channel content cascades, and 8.5/10 pre-flight buyer critiques before anything enters production.',
    seoTitle: 'Multi-Agent Marketing Planning & Production System | Reuben Magallanes (Beneru)',
    seoDescription:
      'How the markdown-backed marketing brain separates planning, buyer critique, creative handoff packets, and production QA across five social platforms.',
    cardImage: {
      src: '/assets/proof/marketing-brain-architecture.svg',
      width: 960,
      height: 480,
      alt: 'System diagram showing Shared Brand Brain feeding Milo Planning and Buyer Audit, passing a structured Handoff Packet to Remy Creative Production and QA Gate',
      caption: 'Role-bounded workflow from shared markdown brain to reviewed creative deliverables.',
    },
    problem:
      'Running five social channels with one general-purpose AI prompt drifts off-brand quickly: colors break contrast, voices slip into generic AI phrasing, and weeks get filled with random posts that ignore funnel gaps.',
    architectureSummary:
      'Built inside a shared markdown brain where brand rules, official palette tokens, voice constraints, and a live cross-platform content ledger act as the single source of truth. Specialized agent roles operate one leg at a time through file-backed handoff packets.',
    architectureSteps: [
      {
        step: '01',
        title: 'Shared Brand & Ledger Source of Truth',
        detail:
          'Locked files store the official Spawntel violet palette (including WCAG contrast gates so primary #6700FF stays a fill and readable #AB73FF/#B79BFF handle dark-background highlights), voice bans, and what already shipped in the ledger.',
      },
      {
        step: '02',
        title: 'Gap Check, Production Budget & 5-Channel Cascade',
        detail:
          'Planning checks bottom-of-funnel proof before top-of-funnel reach, sizes deliverables to available weekly hours using production points, and adapts one strong core idea natively across LinkedIn, Instagram, Facebook, X, and Threads.',
      },
      {
        step: '03',
        title: 'Target-Client Critique & Structured Handoff',
        detail:
          'Every brief is stress-tested from a skeptical buyer perspective before production. Finished creative briefs pass to the creative head via a dated handoff packet listing exact file inputs and completion criteria.',
      },
      {
        step: '04',
        title: 'Asset Production & Pre-Publish QA Gate',
        detail:
          'Creative production renders Playwright/HTML cards, cropped photography, or campaign graphics strictly from the brief, runs visual checks, and waits for human sign-off before any external publishing.',
      },
    ],
    guardrails: [
      'Strict role boundaries: planning writes briefs and copy specs; creative renders visual assets; neither publishes outward without Reuben sign-off.',
      'Mechanical voice checks ban em dashes, en dashes, and template AI phrasing.',
      'WCAG contrast rules and platform safe-zone specs enforced directly in brand files.',
      'Backend automation routing rules are kept out of public scripts and captions.',
    ],
    verifiedFacts: [
      'Used daily across Beneru personal brand launches and Spawntel multi-platform content weeks.',
      'Supports 5-channel native packaging (Instagram, LinkedIn, Facebook, X, Threads) from one approved core idea.',
      'File-based handoff protocol runs consistently across multiple CLI runtimes.',
    ],
    stackTags: ['Markdown Brain', 'Role-Bounded Agents', 'Handoff Packets', 'Playwright Render', 'QA Gates'],
    metaTags: ['Shared Brain', '5-Channel Cascade', 'QA Gated'],
  },
];

export function getWorkBuildBySlug(slug: string): WorkBuild | undefined {
  return WORK_BUILDS.find((b) => b.slug === slug);
}
