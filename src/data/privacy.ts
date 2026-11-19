export interface PrivacySection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
}

export interface PrivacyDoc {
  seoTitle: string;
  seoDescription: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: readonly PrivacySection[];
}

export const PRIVACY_DOC: PrivacyDoc = {
  seoTitle: 'Privacy & Data Deletion Policy | Reuben Magallanes (Beneru)',
  seoDescription:
    'Privacy notice and data deletion instructions for beneru.spawntel.com and automated Instagram and Facebook messaging on Beneru channels.',
  title: 'Privacy & Data Deletion Policy',
  lastUpdated: 'November 19, 2026',
  intro:
    'This notice explains how information is handled across beneru.spawntel.com (the personal brand site of Reuben Magallanes) and automated Instagram and Facebook messaging connected to Beneru social accounts.',
  sections: [
    {
      id: 'website-browsing',
      heading: '1. Website Browsing & Outbound Funnel Clicks (beneru.spawntel.com)',
      paragraphs: [
        'beneru.spawntel.com is a static personal portfolio site served on Cloudflare Workers Static Assets. It does not run third-party advertising trackers, behavioral ad pixels, or non-essential tracking cookies.',
        'The site does not collect names, email addresses, or calendar bookings directly on this domain. All strategy-call bookings happen externally after clicking through to spawntel.com.',
        'When a visitor clicks a button that opens spawntel.com, the browser sends a lightweight, once-per-session notification ping containing only:',
      ],
      bullets: [
        'The button placement that was clicked (for example, header, hero, or bottom CTA).',
        'The current page path and referring hostname (if sent by your browser).',
        'Approximate city, region, and country derived from standard Cloudflare edge request headers, plus timestamp.',
      ],
    },
    {
      id: 'meta-messaging',
      heading: '2. Instagram & Facebook Messaging Automation (Beneru Channels)',
      paragraphs: [
        'When you send a direct message or comment on a post on Instagram (@Beneru.ai) or the Beneru Facebook Page (Page ID 61594858125649), your message content, comment text, platform user ID, username (when provided by Meta), and thread timestamps may be processed through official Meta Graph API webhooks.',
        'This processing powers rule-bound AI replies and routes inquiries that require human attention directly to Reuben Magallanes. When Reuben replies manually in a thread, automated replies pause automatically for 12 hours.',
        'Message records and aggregated channel insights are stored in a private Cloudflare D1 database solely to maintain conversation continuity, prevent duplicate or looped replies, and review inquiry follow-ups. We never sell, rent, or share messaging data with third-party advertisers or data brokers.',
      ],
    },
    {
      id: 'security-retention',
      heading: '3. Data Security & Retention',
      paragraphs: [
        'Incoming Meta webhook payloads are verified using HMAC-SHA256 signatures before processing. Access to private messaging logs and insights dashboards is restricted behind authenticated owner endpoints.',
        'Inquiry records are kept only as long as needed to support follow-up conversations, measure basic channel performance, or satisfy legal obligations.',
      ],
    },
    {
      id: 'data-deletion',
      heading: '4. How to Request Access or Data Deletion',
      paragraphs: [
        'You can request a copy of your messaging history or ask for your conversation records to be deleted at any time using either method below:',
      ],
      bullets: [
        'Email reubenmagallanes91@gmail.com with the subject line "Data Deletion Request" and include your Instagram or Facebook handle so we can locate your thread.',
        'Send a direct message saying "Delete my data" to @Beneru.ai on Instagram or to the Beneru Facebook Page.',
      ],
    },
    {
      id: 'contact',
      heading: '5. Contact',
      paragraphs: [
        'Questions about this policy or how your information is handled can be sent directly to Reuben Magallanes at reubenmagallanes91@gmail.com.',
      ],
    },
  ],
};
