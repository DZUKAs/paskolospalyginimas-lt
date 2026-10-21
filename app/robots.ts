import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/content';
export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.ALLOW_INDEXING === 'true'
        ? { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }
        : { userAgent: '*', disallow: '/' },
    sitemap: siteUrl + '/sitemap.xml',
  };
}

export const dynamic = 'force-dynamic';
