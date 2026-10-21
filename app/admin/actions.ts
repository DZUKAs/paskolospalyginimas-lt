'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { cleanHtml } from '@/lib/content';
export type FormState = { error: string };
const text = (max = 10000) => z.string().trim().max(max);
const nullableNumber = (max: number) =>
  z.preprocess(
    (v) => (v === '' || v == null ? null : Number(v)),
    z.number().finite().min(0).max(max).nullable(),
  );
const image = z
  .string()
  .refine(
    (v) =>
      v === '' ||
      /^\/(?:uploads\/[a-f0-9-]+\.webp|images\/[a-zA-Z0-9_.-]+\.(?:webp|png|jpg))$/.test(v),
    'Naudokite vietinį įkeltą paveikslėlį.',
  );
const https = z.string().refine((v) => {
  if (v === '') return true;
  try {
    return new URL(v).protocol === 'https:';
  } catch {
    return false;
  }
}, 'Reikalinga HTTPS nuoroda.');
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug: mažosios lotyniškos raidės, skaičiai ir brūkšneliai.')
  .max(200);
const articleSchema = z.object({
  id: text(100),
  slug,
  title: text(220).min(3),
  excerpt: text(500).min(10),
  bodyHtml: text(200000).min(10),
  category: text(80).min(2),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']),
  publishedAt: z.string(),
  author: text(100).min(2),
  image,
  imageAlt: text(200),
  seoTitle: text(220),
  seoDescription: text(500),
  ogImage: image,
  creditorId: text(100),
});
export async function saveArticle(_: FormState, f: FormData): Promise<FormState> {
  const u = await requireUser();
  const parsed = articleSchema.safeParse(Object.fromEntries(f));
  if (!parsed.success)
    return {
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  const { id, ...data } = parsed.data;
  let date: Date | null = null;
  if (data.publishedAt) {
    date = new Date(data.publishedAt + 'Z');
    if (!Number.isFinite(date.getTime())) return { error: 'Netinkama publikacijos data.' };
  }
  if (data.status !== 'DRAFT' && !date) return { error: 'Nurodykite publikacijos datą.' };
  if (data.status === 'SCHEDULED' && date! <= new Date())
    return { error: 'Suplanuotos publikacijos data turi būti ateityje.' };
  try {
    const old = id ? await db.article.findUnique({ where: { id } }) : null;
    if (id && !old) return { error: 'Straipsnis nerastas.' };
    if (old && old.slug !== data.slug)
      return { error: 'Esamo straipsnio URL nekeičiamas, kad išliktų senos nuorodos.' };
    const saved = await db.article.upsert({
      where: { id: id || 'new' },
      create: {
        ...data,
        bodyHtml: cleanHtml(data.bodyHtml),
        publishedAt: date,
        creditorId: data.creditorId || null,
      },
      update: {
        ...data,
        bodyHtml: cleanHtml(data.bodyHtml),
        publishedAt: date,
        creditorId: data.creditorId || null,
      },
    });
    await db.auditLog.create({
      data: {
        userId: u.id,
        action: old ? 'Straipsnis atnaujintas' : 'Straipsnis sukurtas',
        target: saved.title,
      },
    });
  } catch {
    return {
      error: 'Nepavyko išsaugoti. Patikrinkite, ar slug unikalus ir kreditorius egzistuoja.',
    };
  }
  revalidatePath('/', 'layout');
  redirect('/admin?tab=naujienos');
}
const creditorSchema = z.object({
  id: text(100),
  slug,
  name: text(100).min(2),
  tagline: text(180).min(3),
  summary: text(3000).min(10),
  reviewHtml: text(200000),
  logo: image,
  applyUrl: https,
  sourceUrl: https.refine((v) => v.length > 0, 'Nurodykite šaltinį.'),
  amountMin: nullableNumber(1000000),
  amountMax: nullableNumber(1000000),
  termMin: nullableNumber(600),
  termMax: nullableNumber(600),
  apr: nullableNumber(1000),
  annualRate: nullableNumber(1000),
  monthlyFee: nullableNumber(100000),
  originationPercent: nullableNumber(100),
  pricingVerified: z.enum(['true', 'false']),
  verifiedAt: text(40),
  example: text(5000),
  rating: nullableNumber(5),
  ratingBasis: text(2000),
  firstFree: z.enum(['', 'true', 'false']),
  fast: z.enum(['', 'true', 'false']),
  payout247: z.enum(['', 'true', 'false']),
  firstTerms: text(2000),
  speed: text(1000),
  requirements: text(5000),
  documents: text(5000),
  suitableFor: text(5000),
  pros: text(5000),
  cons: text(5000),
  faq: text(20000),
  verificationNotes: text(10000),
});
export async function saveCreditor(_: FormState, f: FormData): Promise<FormState> {
  const u = await requireUser(true);
  const parsed = creditorSchema.safeParse(Object.fromEntries(f));
  if (!parsed.success)
    return {
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  const { id, pros, cons, faq, pricingVerified, verifiedAt, ...data } = parsed.data;
  let faqs;
  try {
    faqs = JSON.parse(faq);
    if (
      !Array.isArray(faqs) ||
      faqs.length > 50 ||
      faqs.some((i) => typeof i.q !== 'string' || typeof i.a !== 'string' || !i.q || !i.a)
    )
      throw new Error();
  } catch {
    return { error: 'DUK turi būti JSON masyvas, pvz., [{"q":"Klausimas?","a":"Atsakymas."}].' };
  }
  const date = verifiedAt ? new Date(verifiedAt + 'Z') : null;
  if (date && (!Number.isFinite(date.getTime()) || date > new Date()))
    return { error: 'Patvirtinimo data turi būti galiojanti ir ne ateityje.' };
  if (
    (data.amountMin != null && data.amountMax != null && data.amountMin > data.amountMax) ||
    (data.termMin != null && data.termMax != null && data.termMin > data.termMax)
  )
    return { error: 'Minimali riba negali viršyti maksimalios.' };
  if (
    [data.amountMin, data.amountMax, data.termMin, data.termMax].some(
      (n) => n != null && !Number.isInteger(n),
    )
  )
    return { error: 'Sumų ir mėnesių ribos turi būti sveikieji skaičiai.' };
  if (
    pricingVerified === 'true' &&
    (!date ||
      !data.example ||
      [
        data.amountMin,
        data.amountMax,
        data.termMin,
        data.termMax,
        data.apr,
        data.annualRate,
        data.monthlyFee,
        data.originationPercent,
      ].some((n) => n === null) ||
      data.termMin! < 1)
  )
    return {
      error:
        'Kainodarai patvirtinti būtini visi skaičiai (0 jei mokesčio nėra), patvirtinimo data ir reprezentatyvus pavyzdys.',
    };
  if (data.rating != null && !data.ratingBasis)
    return { error: 'Vertinimui būtinas jo pagrindimas ir metodika.' };
  try {
    const old = id ? await db.creditor.findUnique({ where: { id } }) : null;
    if (id && !old) return { error: 'Kreditorius nerastas.' };
    if (old && old.slug !== data.slug) return { error: 'Esamo kreditoriaus URL nekeičiamas.' };
    const values = {
      ...data,
      firstFree: data.firstFree === '' ? null : data.firstFree === 'true',
      fast: data.fast === '' ? null : data.fast === 'true',
      payout247: data.payout247 === '' ? null : data.payout247 === 'true',
      reviewHtml: cleanHtml(data.reviewHtml),
      pros: JSON.stringify(
        pros
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      ),
      cons: JSON.stringify(
        cons
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      ),
      faq: JSON.stringify(faqs),
      pricingVerified: pricingVerified === 'true',
      verifiedAt: date,
    };
    const saved = await db.creditor.upsert({
      where: { id: id || 'new' },
      create: { ...values, sourceCapturedAt: new Date() },
      update: values,
    });
    await db.auditLog.create({
      data: {
        userId: u.id,
        action: old ? 'Kreditorius atnaujintas' : 'Kreditorius sukurtas',
        target: saved.name,
      },
    });
  } catch {
    return { error: 'Nepavyko išsaugoti. Patikrinkite unikalų slug ir laukus.' };
  }
  revalidatePath('/', 'layout');
  redirect('/admin?tab=kreditoriai');
}
export async function deleteArticle(f: FormData) {
  const u = await requireUser();
  const id = String(f.get('id'));
  const a = await db.article.findUniqueOrThrow({ where: { id } });
  await db.$transaction([
    db.article.delete({ where: { id } }),
    db.auditLog.create({ data: { userId: u.id, action: 'Straipsnis ištrintas', target: a.title } }),
  ]);
  revalidatePath('/', 'layout');
}
