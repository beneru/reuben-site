export const SPAWNTEL_URL = 'https://spawntel.com';

export type FunnelPlacement = 'header' | 'hero' | 'cta' | 'footer';

export const FUNNEL_PLACEMENTS: Record<FunnelPlacement, string> = {
  header: 'Header CTA',
  hero: 'Hero CTA',
  cta: 'Bottom CTA Panel',
  footer: 'Footer Link',
};

export function spawntelFunnelUrl(placement: FunnelPlacement): string {
  const params = new URLSearchParams({
    utm_source: 'beneru',
    utm_medium: 'personal_site',
    utm_campaign: 'booking_funnel',
    utm_content: placement,
  });
  return `${SPAWNTEL_URL}/?${params.toString()}`;
}
