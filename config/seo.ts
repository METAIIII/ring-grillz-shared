import { DefaultSeoProps } from 'next-seo';

const drGrillzDesc =
  'Express yourself and make a statement with custom made Grillz that are perfectly suited to your style and who you are.';
export const DR_GRILLZ_DEFAULT_SEO: DefaultSeoProps = {
  title: 'Dr Grillz',
  description: drGrillzDesc,
  openGraph: {
    type: 'website',
    description: drGrillzDesc,
    locale: 'en_IE',
    url: process.env.NEXTAUTH_URL,
    site_name: 'Dr Grillz',
  },
};

const ringKingzDesc =
  'Create your own custom ring unique to yourself. Handmade with only premium silver and gold, the design you choose is only limited by your imagination.';
export const RING_KINGZ_DEFAULT_SEO: DefaultSeoProps = {
  title: 'Ring Kingz',
  description: ringKingzDesc,
  openGraph: {
    type: 'website',
    description: ringKingzDesc,
    locale: 'en_IE',
    url: process.env.NEXTAUTH_URL,
    site_name: 'Ring Kingz',
  },
};
