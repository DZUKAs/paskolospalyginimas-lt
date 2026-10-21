import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Logout } from '@/components/login';
import { DeleteArticle } from '@/components/admin-forms';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Redakcijos valdymas', robots: { index: false, follow: false } };
export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const u = await requireUser();
  const p = await searchParams;
  const [articles, creditors, audit] = await Promise.all([
    db.article.findMany({ orderBy: { updatedAt: 'desc' } }),
    u.role === 'ADMIN' ? db.creditor.findMany({ orderBy: { name: 'asc' } }) : Promise.resolve([]),
    db.auditLog.findMany({
      where: u.role === 'ADMIN' ? {} : { userId: u.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);
  return (
    <div className="wrap admin-shell">
      <div className="section-head">
        <div>
          <div className="eyebrow">Redakcijos erdvė</div>
          <h1 style={{ fontSize: 40 }}>Turinys jūsų rankose.</h1>
          <p>
            {u.email} · {u.role === 'ADMIN' ? 'Administratorius' : 'Redaktorius'}
          </p>
        </div>
        <Logout />
      </div>
      <div className="cards">
        <div className="card">
          <h3>{articles.length}</h3>
          <p>Straipsnių iš viso</p>
        </div>
        <div className="card">
          <h3>{articles.filter((a) => a.status === 'DRAFT').length}</h3>
          <p>Juodraščių</p>
        </div>
        <div className="card">
          <h3>{articles.filter((a) => a.status === 'SCHEDULED').length}</h3>
          <p>Suplanuotų publikacijų</p>
        </div>
      </div>
      <nav className="admin-tabs">
        <Link className="btn outline" href="/admin?tab=naujienos">
          Naujienos
        </Link>
        {u.role === 'ADMIN' && (
          <Link className="btn outline" href="/admin?tab=kreditoriai">
            Kreditoriai
          </Link>
        )}
      </nav>
      {p.tab === 'kreditoriai' && u.role === 'ADMIN' ? (
        <>
          <div className="section-head">
            <h2>Kreditoriai</h2>
            <Link href="/admin/kreditoriai/naujas" className="btn">
              Pridėti kreditorių +
            </Link>
          </div>
          <div className="admin-list">
            {creditors.map((c) => (
              <div className="admin-row" key={c.id}>
                <strong>{c.name}</strong>
                <span className="badge">
                  {c.pricingVerified ? 'Kainodara patvirtinta' : 'PATIKRINTI'}
                </span>
                <Link className="btn outline" href={`/admin/kreditoriai/${c.id}`}>
                  Redaguoti
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="section-head">
            <h2>Naujienos</h2>
            <Link className="btn" href="/admin/straipsniai/naujas">
              Naujas straipsnis +
            </Link>
          </div>
          <div className="admin-list">
            {articles.map((a) => (
              <div className="admin-row" key={a.id}>
                <div>
                  <strong>{a.title}</strong>
                  <p className="tiny" style={{ margin: 0 }}>
                    {a.status === 'DRAFT'
                      ? 'Juodraštis'
                      : a.status === 'SCHEDULED'
                        ? 'Suplanuota'
                        : 'Paskelbta'}{' '}
                    · {a.publishedAt?.toLocaleString('lt-LT', { timeZone: 'Europe/Vilnius' })}
                  </p>
                </div>
                <Link className="btn outline" href={`/admin/straipsniai/${a.id}`}>
                  Redaguoti
                </Link>
                <DeleteArticle id={a.id} />
              </div>
            ))}
          </div>
        </>
      )}
      <section className="section">
        <h2>Paskutiniai pakeitimai</h2>
        {audit.length ? (
          audit.map((a) => (
            <p className="tiny" key={a.id}>
              {a.createdAt.toLocaleString('lt-LT', { timeZone: 'Europe/Vilnius' })} · {a.action}:{' '}
              {a.target}
            </p>
          ))
        ) : (
          <p>Redagavimo istorija kol kas tuščia.</p>
        )}
      </section>
    </div>
  );
}
