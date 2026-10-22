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
        Sąlygos pagal svetainės valdytojo pateiktą 2026-10-22 suvestinę ir joje nurodytus teikėjų
        šaltinius. Pavyzdžiai skiriasi suma ir terminu; jų negalima tiesiogiai rikiuoti pagal kainą.
        Individuali kaina nustatoma po mokumo vertinimo. Pavyzdžių palūkanos netaikomos visoms
        pasirinktoms sumoms.
      </div>
      <Comparison creditors={creditors} initialAmount={amount} initialMonths={months} />
      <p className="warning-text" style={{ marginTop: 30 }}>
        Skolintis rizikinga. Prieš imdami paskolą įvertinkite savo galimybes ją grąžinti.
      </p>
    </div>
  );
}
