import { db } from '@/lib/db';
import { Comparison } from '@/components/comparison';
import { Breadcrumbs } from '@/components/shared';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Paskolų palyginimas',
  description:
    'Lyginkite šešių kreditorių sumas, terminus ir patvirtintą kainodarą. Filtruokite ir peržiūrėkite iki trijų kreditorių greta.',
  alternates: { canonical: '/palyginimas' },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const p = await searchParams;
  const creditors = await db.creditor.findMany({ orderBy: { name: 'asc' } });
  const amount = Math.max(50, Math.min(1000000, Number(p.suma) || 3000));
  const months = Math.max(1, Math.min(360, Math.round(Number(p.terminas) || 24)));
  const verified = creditors.filter((c) => c.verifiedAt);
  return (
    <div className="wrap">
      <div className="page-hero">
        <Breadcrumbs items={[{ name: 'Palyginimas', href: '/palyginimas' }]} />
        <h1>
          Palyginkite.
          <br />
          Supraskite. Pasirinkite.
        </h1>
        <p>
          Vienoda suma ir terminas padeda įvertinti skirtumus. Galutines sąlygas pateikia
          kreditorius.
        </p>
      </div>
      <div className="notice">
        <strong>Duomenys atnaujinti:</strong>{' '}
        {verified.length
          ? new Date(Math.max(...verified.map((c) => c.verifiedAt!.getTime()))).toLocaleDateString(
              'lt-LT',
            )
          : 'PATIKRINTI'}
        . Seno turinio perkėlimo data: 2026-10-21. Perkėlimas nėra sąlygų patvirtinimas. Patvirtintą
        kainodarą turi {creditors.filter((c) => c.pricingVerified && c.verifiedAt).length} iš{' '}
        {creditors.length} kreditorių.
      </div>
      <Comparison creditors={creditors} initialAmount={amount} initialMonths={months} />
      <p className="warning-text" style={{ marginTop: 30 }}>
        Skolintis rizikinga. Prieš imdami paskolą įvertinkite savo galimybes ją grąžinti.
      </p>
    </div>
  );
}
