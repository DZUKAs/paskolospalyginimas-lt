import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { ArticleForm } from '@/components/admin-forms';
export const metadata = {
  title: 'Straipsnio redagavimas',
  robots: { index: false, follow: false },
};
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const a = id === 'naujas' ? null : await db.article.findUnique({ where: { id } });
  if (id !== 'naujas' && !a) notFound();
  const creditors = await db.creditor.findMany({ select: { id: true, name: true } });
  return (
    <div className="wrap admin-shell">
      <Link href="/admin">← Į valdymą</Link>
      <h1 style={{ fontSize: 36, marginTop: 25 }}>
        {a ? 'Redaguoti straipsnį' : 'Naujas straipsnis'}
      </h1>
      <ArticleForm article={a} creditors={creditors} />
    </div>
  );
}
