import Link from 'next/link';
import { db } from '@/lib/db';
import { publishedWhere } from '@/lib/content';
import { ArticleCard, Breadcrumbs } from '@/components/shared';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Naujienos ir finansų gidas',
  description:
    'Praktiški straipsniai apie paskolų palyginimą, kredito kainą ir atsakingą skolinimąsi.',
  alternates: { canonical: '/naujienos' },
};
export default async function News({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const p = await searchParams;
  const q = (p.q || '').slice(0, 150),
    category = p.kategorija || '';
  const page = Math.max(1, Math.min(10000, parseInt(p.puslapis || '1') || 1));
  const where = {
    ...publishedWhere(),
    ...(q
      ? {
          OR: undefined,
          AND: [
            publishedWhere(),
            { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
  };
  const [articles, count, categories] = await Promise.all([
    db.article.findMany({ where, skip: (page - 1) * 6, take: 6, orderBy: { publishedAt: 'desc' } }),
    db.article.count({ where }),
    db.article.findMany({
      where: publishedWhere(),
      select: { category: true },
      distinct: ['category'],
    }),
  ]);
  const pages = Math.ceil(count / 6);
  return (
    <div className="wrap">
      <div className="page-hero">
        <Breadcrumbs items={[{ name: 'Finansų gidas', href: '/naujienos' }]} />
        <h1>
          Žinoti daugiau.
          <br />
          Spręsti užtikrinčiau.
        </h1>
        <p>Aiškiai apie kainą, sąlygas ir atsakingą skolinimąsi.</p>
      </div>
      <form className="filter-panel filters" action="/naujienos">
        <label className="field">
          Ieškoti straipsnių
          <input name="q" defaultValue={q} placeholder="Pvz., paskolos kaina" />
        </label>
        <label className="field">
          Kategorija
          <select name="kategorija" defaultValue={category}>
            <option value="">Visos kategorijos</option>
            {categories.map((c) => (
              <option key={c.category}>{c.category}</option>
            ))}
          </select>
        </label>
        <button className="btn" type="submit" style={{ alignSelf: 'center' }}>
          Ieškoti →
        </button>
      </form>
      {articles.length ? (
        <div className="cards">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <p role="status">Straipsnių pagal šią paiešką nėra.</p>
      )}
      <nav className="pagination" aria-label="Naujienų puslapiai">
        {Array.from({ length: Math.min(pages, 100) }, (_, i) => (
          <Link
            className="btn outline"
            key={i}
            aria-current={page === i + 1 ? 'page' : undefined}
            href={`/naujienos?${new URLSearchParams({ q, kategorija: category, puslapis: String(i + 1) })}`}
          >
            {i + 1}
          </Link>
        ))}
      </nav>
    </div>
  );
}
