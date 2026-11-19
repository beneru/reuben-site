export interface SocialLink {
  id: 'instagram' | 'linkedin' | 'facebook' | 'x' | 'threads';
  label: string;
  handle: string;
  url: string;
  /** Standard 24x24 single-color brand mark path/markup (rendered inside <svg viewBox="0 0 24 24">). */
  iconSvg: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@Beneru.ai',
    url: 'https://www.instagram.com/beneru.ai',
    iconSvg:
      '<rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="1.85"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" stroke-width="1.85"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'Reuben Magallanes',
    url: 'https://www.linkedin.com/in/reuben-magallanes-6219443b5',
    iconSvg:
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/><rect width="4" height="12" x="2" y="9" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="1.85"/>',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'Beneru',
    url: 'https://www.facebook.com/profile.php?id=61594858125649',
    iconSvg:
      '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'x',
    label: 'X',
    handle: '@ReubenMaga99931',
    url: 'https://x.com/ReubenMaga99931',
    iconSvg:
      '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>',
  },
  {
    id: 'threads',
    label: 'Threads',
    handle: '@reuben.aui',
    url: 'https://www.threads.com/@reuben.aui',
    iconSvg:
      '<path d="M19 12a7 7 0 1 0-2.5 5.4M15.8 11.4c-.3-2.4-1.8-3.7-4-3.7-2 0-3.5 1.3-3.7 3.2-.2 2.1 1.2 3.6 3.5 3.6 2.1 0 3.7-1.1 4.2-3.1.4-1.6-.2-3.7-1.9-4.7M15.8 11.4c.1 1.7.9 2.7 2.2 2.6 1.5-.1 2.4-1.5 2.4-3.5 0-4.6-3.4-7.8-8.3-7.8C6.9 2.7 3.5 6.4 3.5 12c0 5.5 3.6 9.3 9 9.3 2.5 0 4.6-.7 6.2-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  },
];

export const INSTAGRAM_URL = SOCIAL_LINKS[0].url;
