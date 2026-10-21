import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { publishedWhere, siteUrl } from '@/lib/content';
import { pages } from '@/lib/pages';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [creditors, articles] = await Promise.all([
    db.creditor.findMany(),
    db.article.findMany({ where: publishedWhere() }),
  ]);
  return [
    ...['', '/palyginimas', '/naujienos', '/duk', ...Object.keys(pages).map((p) => '/' + p)].map(
      (p) => ({ url: siteUrl + p }),
    ),
    ...creditors.map((c) => ({
      url: `${siteUrl}/loans/${c.slug}-apzvalga/`,
      lastModified: c.updatedAt,
    })),
    ...articles.map((a) => ({ url: `${siteUrl}/naujienos/${a.slug}`, lastModified: a.updatedAt })),
  ];
}
export const dynamic = 'force-dynamic';
