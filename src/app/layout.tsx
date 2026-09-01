import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import AnimationRoot from './components/AnimationRoot';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dillonmarinez.com'),
  title: 'Dillon Marinez — Senior Software Engineer & Creative Technologist',
  description:
    'Selected work by Dillon Marinez, a senior software engineer and technical lead building commerce platforms, digital products, and internal tools.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Dillon Marinez',
    title: 'Dillon Marinez — Senior Software Engineer & Creative Technologist',
    description:
      'Commerce platforms, digital products, and systems built for real-world complexity.',
    images: [
      {
        url: '/og.png',
        width: 1729,
        height: 910,
        alt: 'Dillon Marinez — Senior Software Engineer and Creative Technologist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dillon Marinez — Senior Software Engineer & Creative Technologist',
    description:
      'Commerce platforms, digital products, and systems built for real-world complexity.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dillon Marinez',
  url: 'https://www.dillonmarinez.com',
  jobTitle: 'Senior Software Engineer and Principal Consultant',
  worksFor: {
    '@type': 'Organization',
    name: 'Evara Group LLC',
    foundingDate: '2025',
  },
  sameAs: [
    'https://github.com/dimarinez/',
    'https://www.linkedin.com/in/dillon-marinez-9810b6114/',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <AnimationRoot childrenProp={children} />
      </body>
    </html>
  );
}
