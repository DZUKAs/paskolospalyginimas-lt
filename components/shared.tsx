import Link from 'next/link';
import Image from 'next/image';
import type { Creditor, Article } from '@prisma/client';
import { ArrowUpRight } from 'lucide-react';
import { Cookies } from './chrome';
import { commonFaq, jsonLd } from '@/lib/content';
export function Logo({ c }: { c: Pick<Creditor, 'name' | 'logo'> }) {
  return (
    <span className="lender-logo">
      {c.logo ? (
        <Image src={c.logo} width={100} height={40} alt={`${c.name} logotipas`} unoptimized />
      ) : (
        <>
          <span className="lender-symbol" aria-hidden="true">
            {c.name.slice(0, 1)}
          </span>
          {c.name}
        </>
      )}
    </span>
  );
}
export function Range({
  min,
  max,
  unit,
}: {
  min: number | null;
  max: number | null;
  unit: string;
}) {
  return (
    <>
      {min != null && max != null
        ? `${min.toLocaleString('lt-LT')}–${max.toLocaleString('lt-LT')} ${unit}`
        : max != null
          ? `Iki ${max.toLocaleString('lt-LT')} ${unit}`
          : 'PATIKRINTI'}
    </>
  );
}
export function CreditorCard({ c }: { c: Creditor }) {
  return (
    <article className="card">
      <div className="card-top">
        <Logo c={c} />
        <span className="badge warning">{c.verifiedAt ? 'Patikrinta' : 'Tikslinama'}</span>
      </div>
      <p className="tagline">{c.tagline}</p>
      <dl className="metrics">
        <div>
          <dt>Paskolos suma*</dt>
          <dd>
            <Range min={c.amountMin} max={c.amountMax} unit="€" />
          </dd>
        </div>
        <div>
          <dt>Grąžinimo terminas*</dt>
          <dd>
            <Range min={c.termMin} max={c.termMax} unit="mėn." />
          </dd>
        </div>
      </dl>
      <p className="tiny">
        {c.pricingVerified && c.verifiedAt && c.example ? (
          <>
            BVKKMN {c.apr} %. {c.example}
          </>
        ) : (
          <>
            * Seno šaltinio duomenys. Kaina, BVKKMN ir pavyzdys: <strong>PATIKRINTI</strong>.
          </>
        )}
      </p>
      <div className="card-foot">
        <Link href={`/loans/${c.slug}-apzvalga/`} className="btn outline">
          Skaityti apžvalgą <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
export function ArticleCard({ article: a }: { article: Article }) {
  return (
    <article className="card article-card">
      <Link href={`/naujienos/${a.slug}`}>
        {a.image && (
          <Image
            src={a.image}
            alt={a.imageAlt || a.title}
            width={600}
            height={375}
            sizes="(max-width:760px) 100vw, 33vw"
          />
        )}
        <div className="body">
          <span className="badge">{a.category}</span>
          <h3>{a.title}</h3>
          <p>{a.excerpt}</p>
          {a.publishedAt && (
            <time dateTime={a.publishedAt.toISOString()}>
              {a.publishedAt.toLocaleDateString('lt-LT', { timeZone: 'Europe/Vilnius' })}
            </time>
          )}
          <span style={{ float: 'right' }} aria-hidden="true">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </Link>
    </article>
  );
}
export function Faq({ items = commonFaq }: { items?: { q: string; a: string }[] }) {
  return (
    <>
      <div>
        {items.map((f, i) => (
          <details key={i}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Link className="brand" href="/">
              <span className="brand-mark" aria-hidden="true">
                <ArrowUpRight size={26} />
              </span>
              paskolų palyginimas
            </Link>
            <p style={{ fontSize: 13, marginTop: 20, maxWidth: 330 }}>
              Daugiau aiškumo prieš svarbų sprendimą. Palyginkite, supraskite, pasirinkite
              atsakingai.
            </p>
          </div>
          <div className="footer-links">
            <strong>Naudinga žinoti</strong>
            <Link href="/palyginimas">Paskolų palyginimas</Link>
            <Link href="/naujienos">Finansų gidas</Link>
            <Link href="/apie-mus">Apie mus</Link>
            <Link href="/kontaktai">Kontaktai</Link>
          </div>
          <div className="footer-links">
            <strong>Skaidrumas ir privatumas</strong>
            <Link href="/privatumo-politika">Privatumo politika</Link>
            <Link href="/slapuku-politika">Slapukų politika</Link>
            <Link href="/reklamos-atskleidimas">Reklamos atskleidimas</Link>
            <Link href="/naudojimo-salygos">Naudojimo sąlygos</Link>
            <Cookies />
          </div>
        </div>
        <div className="footer-bottom">
          <p className="warning-text">
            Skolintis rizikinga. Prieš imdami paskolą įvertinkite savo galimybes ją grąžinti.
          </p>
          <p>
            Svetainė gali gauti komisinius už nukreiptus klientus. Palyginimas nėra finansinė
            konsultacija. Mes paskolų nesuteikiame. Nepatvirtinti duomenys pažymėti „PATIKRINTI“.
          </p>
          <span>© {new Date().getFullYear()} Paskolospalyginimas.lt</span>
        </div>
      </div>
    </footer>
  );
}
export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Naršymo kelias">
      <Link href="/">Pradžia</Link>
      {items.map((i) => (
        <span key={i.href}>
          {' '}
          / <Link href={i.href}>{i.name}</Link>
        </span>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [{ name: 'Pradžia', href: '/' }, ...items].map((i, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: i.name,
              item: 'https://paskolospalyginimas.lt' + i.href,
            })),
          }),
        }}
      />
    </nav>
  );
}
