import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import './globals.css';
import { Header } from '@/components/chrome';
import { Footer } from '@/components/shared';
import { siteUrl, jsonLd } from '@/lib/content';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Paskolų palyginimas — aiškiau apie finansus',
    template: '%s | Paskolų palyginimas',
  },
  description:
    'Palyginkite kreditorių sąlygas, supraskite paskolos kainą ir priimkite atsakingą sprendimą.',
  robots: {
    index: process.env.ALLOW_INDEXING === 'true',
    follow: process.env.ALLOW_INDEXING === 'true',
  },
  openGraph: {
    locale: 'lt_LT',
    type: 'website',
    siteName: 'Paskolų palyginimas',
    images: ['/images/gidas.webp'],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
        <a href="#turinys" className="skip">
          Pereiti prie turinio
        </a>
        <Header />
        <main id="turinys">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Paskolospalyginimas.lt',
              url: siteUrl,
            }),
          }}
        />
      </body>
    </html>
  );
}
