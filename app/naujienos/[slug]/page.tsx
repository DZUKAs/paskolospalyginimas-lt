import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import { cleanHtml, jsonLd, publishedWhere, siteUrl } from '@/lib/content';
import { ArticleCard, Breadcrumbs } from '@/components/shared';
export const dynamic = 'force-dynamic';
async function get(slug: string) {
  return db.article.findFirst({ where: { slug, ...publishedWhere() } });
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = await get((await params).slug);
  return a
    ? {
        title: a.seoTitle || a.title,
        description: a.seoDescription || a.excerpt,
        alternates: { canonical: `/naujienos/${a.slug}` },
        openGraph: {
          title: a.seoTitle || a.title,
          description: a.excerpt,
          type: 'article',
          publishedTime: a.publishedAt?.toISOString(),
          images: [a.ogImage || a.image || '/images/gidas.webp'],
        },
      }
    : {};
}
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const a = await get((await params).slug);
  if (!a) notFound();
  const related = await db.article.findMany({
    where: { ...publishedWhere(), id: { not: a.id }, category: a.category },
    take: 3,
  });
  const url = siteUrl + '/naujienos/' + a.slug;
  return (
    <div className="wrap">
      <div className="prose">
        <Breadcrumbs
          items={[
            { name: 'Finansų gidas', href: '/naujienos' },
            { name: a.title, href: `/naujienos/${a.slug}` },
          ]}
        />
        <p className="eyebrow" style={{ marginTop: 30 }}>
          {a.category}
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)' }}>{a.title}</h1>
        <p>{a.excerpt}</p>
        <p className="tiny">
          {a.author} · {a.publishedAt?.toLocaleDateString('lt-LT', { timeZone: 'Europe/Vilnius' })}
        </p>
        {a.image && (
          <Image
            src={a.image}
            alt={a.imageAlt || a.title}
            width={1200}
            height={750}
            sizes="(max-width:760px) 100vw, 760px"
            preload
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: cleanHtml(a.bodyHtml) }} />
        {a.sourceUrl && (
          <p className="tiny">
            Perrašyta pagal <a href={a.sourceUrl}>ankstesnę publikaciją</a>. Senų publikacijų datos,
            kurių nepavyko patvirtinti: PATIKRINTI.
          </p>
        )}
        <div className="share">
          <span>Dalintis:</span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          >
            Facebook
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          >
            LinkedIn
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(a.title)}&body=${encodeURIComponent(url)}`}
          >
            El. paštu
          </a>
        </div>
        <div className="notice">
          Informacija nėra individuali finansinė konsultacija. Skolintis rizikinga. Įvertinkite savo
          galimybes grąžinti paskolą.
        </div>
      </div>
      {related.length > 0 && (
        <section className="section">
          <h2>Susiję straipsniai</h2>
          <div className="cards">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: a.title,
            description: a.excerpt,
            datePublished: a.publishedAt?.toISOString(),
            dateModified: a.updatedAt.toISOString(),
            author: { '@type': 'Organization', name: a.author },
            publisher: { '@type': 'Organization', name: 'Paskolospalyginimas.lt' },
            image: a.image ? new URL(a.image, siteUrl).href : undefined,
            mainEntityOfPage: url,
          }),
        }}
      />
    </div>
  );
}
