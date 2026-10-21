import { notFound } from 'next/navigation';
import Link from 'next/link';
import { pages } from '@/lib/pages';
import { cleanHtml } from '@/lib/content';
import { Breadcrumbs, Faq } from '@/components/shared';
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const p = (await params).page;
  const a = pages[p];
  return {
    title: a?.title || (p === 'duk' ? 'Dažniausi klausimai' : 'Svetainės žemėlapis'),
    description: a?.description || 'Naudinga informacija apie paskolų palyginimą.',
    alternates: { canonical: `/${p}` },
  };
}
export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const p = (await params).page;
  if (p === 'duk')
    return (
      <div className="wrap">
        <div className="page-hero">
          <h1>Atsakymai prieš sprendimą.</h1>
        </div>
        <div className="faq">
          <p>Svarbiausia informacija apie palyginimą.</p>
          <Faq />
        </div>
      </div>
    );
  if (p === 'svetaines-zemelapis')
    return (
      <div className="wrap prose">
        <h1>Svetainės žemėlapis</h1>
        {['palyginimas', 'naujienos', 'duk', ...Object.keys(pages)].map((p) => (
          <p key={p}>
            <Link href={`/${p}`}>{pages[p]?.title || p}</Link>
          </p>
        ))}
      </div>
    );
  const a = pages[p];
  if (!a) notFound();
  return (
    <div className="wrap">
      <div className="prose">
        <Breadcrumbs items={[{ name: a.title, href: `/${p}` }]} />
        <h1 style={{ fontSize: 'clamp(2.4rem,4vw,3.7rem)', marginTop: 30 }}>{a.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: cleanHtml(a.body) }} />
      </div>
    </div>
  );
}
