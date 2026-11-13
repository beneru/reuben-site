/**
 * Portfolio / case studies.
 *
 * Intentionally EMPTY for now. The home page "Selected work" section and /work
 * render a designed empty state until at least one entry exists here.
 *
 * To add a case study, push an object like this (image goes in /public/work/):
 *
 * {
 *   slug: 'clinic-dm-qualifier',
 *   title: 'DM lead qualifier for a dental clinic',
 *   client: 'Client name',
 *   category: 'Inbound DM Lead Capture',
 *   summary: 'One sentence on the problem and what the system does.',
 *   result: 'Response time from 9 hours to under 2 minutes',
 *   image: '/work/clinic-dm-qualifier.webp',
 *   year: 2026,
 *   href: '/work/clinic-dm-qualifier', // optional: full write-up or external link
 *   featured: true,                     // featured entries span wider on the home page
 * }
 *
 * Only publish real numbers you can stand behind.
 */
export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  result?: string;
  image: string;
  year: number;
  href?: string;
  featured?: boolean;
}

export const caseStudies: CaseStudy[] = [];
