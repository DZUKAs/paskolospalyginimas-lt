import { ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { arrayField, cleanHtml, publishedWhere } from '@/lib/content';
import { Logo, Range, Faq, CreditorCard, ArticleCard, Breadcrumbs } from '@/components/shared';
export const dynamic = 'force-dynamic';
async function get(slug: string) {
  if (!slug.endsWith('-apzvalga')) return null;
  return db.creditor.findUnique({ where: { slug: slug.slice(0, -9) } });
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await get(slug);
  return c
    ? {
        title: `${c.name} apžvalga ir sąlygos`,
        description: c.summary,
        alternates: { canonical: `/loans/${slug}/` },
      }
    : {};
}
export default async function Review({ params }: { params: Promise<{ slug: string }> }) {
  const c = await get((await params).slug);
  if (!c) notFound();
  const [similar, news] = await Promise.all([
    db.creditor.findMany({ where: { id: { not: c.id } }, take: 3 }),
    db.article.findMany({
      where: { ...publishedWhere(), creditorId: c.id },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    }),
  ]);
  return (
    <div className="wrap">
      <div className="page-hero">
        <Breadcrumbs
          items={[
            { name: 'Kreditoriai', href: '/palyginimas' },
            { name: c.name, href: `/loans/${c.slug}-apzvalga/` },
          ]}
        />
        <h1>
          {c.name}:<br />
          sąlygos be užuolankų.
        </h1>
        <p>{c.tagline}</p>
      </div>
      <section className="card">
        <Logo c={c} />
        <p style={{ marginTop: 20 }}>{c.summary}</p>
        <dl className="metrics">
          <div>
            <dt>Paskolos suma*</dt>
            <dd>
              <Range min={c.amountMin} max={c.amountMax} unit="€" />
            </dd>
          </div>
          <div>
            <dt>Terminas*</dt>
            <dd>
              <Range min={c.termMin} max={c.termMax} unit="mėn." />
            </dd>
          </div>
        </dl>
        <p className="tiny">
          * Seno šaltinio duomenys — PATIKRINTI. Aktualios palūkanos, BVKKMN ir reprezentatyvus
          pavyzdys:{' '}
          {c.pricingVerified && c.verifiedAt && c.example
            ? `${c.annualRate} %, BVKKMN ${c.apr} %. ${c.example}`
            : 'PATIKRINTI'}
        </p>
        {c.applyUrl ? (
          <a className="btn" href={c.applyUrl} rel="sponsored noopener noreferrer" target="_blank">
            Pateikti paraišką <ArrowUpRight size={14} />
          </a>
        ) : (
          <p className="tiny">Oficiali paraiškos nuoroda: PATIKRINTI.</p>
        )}
      </section>
      <div className="notice">
        {c.verificationNotes}
        <br />
        Šaltinis:{' '}
        <a href={c.sourceUrl} rel="noopener noreferrer">
          sena apžvalga
        </a>{' '}
        · Perimta {c.sourceCapturedAt.toLocaleDateString('lt-LT')} · Patvirtinta{' '}
        {c.verifiedAt ? c.verifiedAt.toLocaleDateString('lt-LT') : 'PATIKRINTI'}
      </div>
      <section className="section split">
        <div className="card">
          <h2 style={{ fontSize: 26 }}>Privalumai</h2>
          <ul>
            {arrayField<string>(c.pros).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 style={{ fontSize: 26 }}>Į ką atkreipti dėmesį</h2>
          <ul>
            {arrayField<string>(c.cons).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </section>
      <div className="prose">
        <h2>Kam gali būti aktualu?</h2>
        <p>{c.suitableFor}</p>
        <div dangerouslySetInnerHTML={{ __html: cleanHtml(c.reviewHtml) }} />
        <h2>Reikalavimai ir dokumentai</h2>
        <p>{c.requirements}</p>
        <p>{c.documents}</p>
        <h2>Kaip pateikti paraišką?</h2>
        <ol>
          <li>Įvertinkite savo biudžetą ir būtiną sumą.</li>
          <li>Patikrinkite aktualias sąlygas oficialioje kreditoriaus svetainėje.</li>
          <li>Pateikite kreditoriaus prašomą informaciją ir patvirtinkite tapatybę.</li>
          <li>Gavę individualų pasiūlymą, perskaitykite sutartį, įmokų grafiką ir visą kainą.</li>
        </ol>
        <h2>Mokėjimo pavyzdys</h2>
        <p>
          {c.pricingVerified && c.example
            ? c.example
            : 'PATIKRINTI — seno šaltinio nepakanka patikimam reprezentatyviam pavyzdžiui. Iš BVKKMN vienos įmokos neskaičiuojame.'}
        </p>
      </div>
      <section className="section faq">
        <div>
          <h2>
            Dažniausi klausimai
            <br />
            apie {c.name}
          </h2>
        </div>
        <Faq items={arrayField<{ q: string; a: string }>(c.faq)} />
      </section>
      <section className="section">
        <div className="section-head">
          <h2>Palyginkite ir kitus.</h2>
          <Link href="/palyginimas">
            Visi kreditoriai <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="cards">
          {similar.map((s) => (
            <CreditorCard key={s.id} c={s} />
          ))}
        </div>
      </section>
      {news.length > 0 && (
        <section className="section">
          <h2>Naujienos apie {c.name}</h2>
          <div className="cards">
            {news.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
