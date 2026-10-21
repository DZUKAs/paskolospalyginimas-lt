import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { CreditorForm } from '@/components/admin-forms';
export const metadata = {
  title: 'Kreditoriaus redagavimas',
  robots: { index: false, follow: false },
};
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const u = await requireUser();
  if (u.role !== 'ADMIN') redirect('/admin');
  const { id } = await params;
  const c = id === 'naujas' ? null : await db.creditor.findUnique({ where: { id } });
  if (id !== 'naujas' && !c) notFound();
  return (
    <div className="wrap admin-shell">
      <Link href="/admin?tab=kreditoriai">← Į kreditorius</Link>
      <h1 style={{ fontSize: 36, marginTop: 25 }}>
        {c ? 'Redaguoti kreditorių' : 'Naujas kreditorius'}
      </h1>
      <CreditorForm creditor={c} />
    </div>
  );
}
