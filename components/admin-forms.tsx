'use client';
import { useActionState, useState } from 'react';
import type { Article, Creditor } from '@prisma/client';
import { saveArticle, saveCreditor, deleteArticle } from '@/app/admin/actions';
import { Editor, Upload } from './editor';
import { arrayField } from '@/lib/content-client';
const dateValue = (v: Date | string | null | undefined) =>
  v ? new Date(v).toISOString().slice(0, 16) : '';
export function ArticleForm({
  article: a,
  creditors,
}: {
  article: Article | null;
  creditors: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(saveArticle, { error: '' });
  const [html, setHtml] = useState(a?.bodyHtml || '<p></p>'),
    [image, setImage] = useState(a?.image || ''),
    [og, setOg] = useState(a?.ogImage || '');
  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="id" value={a?.id || ''} />
      <label className="field">
        Pavadinimas
        <input name="title" defaultValue={a?.title} required />
      </label>
      <label className="field">
        Slug (esamas adresas išsaugomas)
        <input
          name="slug"
          defaultValue={a?.slug}
          readOnly={!!a}
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
        />
      </label>
      <label className="field">
        Trumpas aprašymas
        <textarea name="excerpt" defaultValue={a?.excerpt} required />
      </label>
      <div className="field">
        <span>Straipsnio tekstas</span>
        <Editor value={html} onChange={setHtml} />
        <input type="hidden" name="bodyHtml" value={html} />
      </div>
      <div className="split">
        <label className="field">
          Kategorija
          <input name="category" defaultValue={a?.category || 'Palyginimo gidas'} required />
        </label>
        <label className="field">
          Susijęs kreditorius
          <select name="creditorId" defaultValue={a?.creditorId || ''}>
            <option value="">Bendras straipsnis</option>
            {creditors.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="split">
        <label className="field">
          Būsena
          <select name="status" defaultValue={a?.status || 'DRAFT'}>
            <option value="DRAFT">Juodraštis</option>
            <option value="PUBLISHED">Paskelbta</option>
            <option value="SCHEDULED">Suplanuota</option>
          </select>
        </label>
        <label className="field">
          Publikavimo data (UTC)
          <input
            type="datetime-local"
            name="publishedAt"
            defaultValue={dateValue(a?.publishedAt)}
          />
          <span className="tiny">Laikas įrašomas UTC, viešai rodomas Lietuvos laiku.</span>
        </label>
      </div>
      <label className="field">
        Autorius
        <input name="author" defaultValue={a?.author || 'Paskolų palyginimo redakcija'} required />
      </label>
      <Upload onChange={setImage} />
      <label className="field">
        Paveikslėlio adresas
        <input
          name="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/uploads/…webp"
        />
      </label>
      <label className="field">
        Alternatyvus paveikslėlio tekstas
        <input name="imageAlt" defaultValue={a?.imageAlt || ''} />
      </label>
      <h2>SEO</h2>
      <label className="field">
        SEO pavadinimas
        <input name="seoTitle" defaultValue={a?.seoTitle || ''} />
      </label>
      <label className="field">
        Meta aprašymas
        <textarea name="seoDescription" defaultValue={a?.seoDescription || ''} />
      </label>
      <Upload onChange={setOg} />
      <label className="field">
        OG paveikslėlio adresas
        <input name="ogImage" value={og} onChange={(e) => setOg(e.target.value)} />
      </label>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn" disabled={pending}>
        {pending ? 'Saugoma…' : 'Išsaugoti straipsnį'}
      </button>
    </form>
  );
}
export function DeleteArticle({ id }: { id: string }) {
  return (
    <form
      action={deleteArticle}
      onSubmit={(e) => {
        if (!window.confirm('Tikrai ištrinti straipsnį? Šio veiksmo atšaukti negalima.'))
          e.preventDefault();
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button className="btn outline">Ištrinti</button>
    </form>
  );
}
export function CreditorForm({ creditor: c }: { creditor: Creditor | null }) {
  const [state, action, pending] = useActionState(saveCreditor, { error: '' });
  const [html, setHtml] = useState(c?.reviewHtml || '<p></p>'),
    [logo, setLogo] = useState(c?.logo || '');
  const fields = [
    ['name', 'Pavadinimas'],
    ['tagline', 'Trumpa antraštė'],
    ['sourceUrl', 'Informacijos šaltinio HTTPS nuoroda'],
    ['applyUrl', 'Paraiškos / affiliate HTTPS nuoroda'],
  ] as const;
  const numbers = [
    ['amountMin', 'Minimali suma, €'],
    ['amountMax', 'Maksimali suma, €'],
    ['termMin', 'Minimalus terminas, mėn.'],
    ['termMax', 'Maksimalus terminas, mėn.'],
    ['annualRate', 'Metinės nominalios palūkanos, %'],
    ['apr', 'BVKKMN, %'],
    ['monthlyFee', 'Fiksuotas mėnesio mokestis, €'],
    ['originationPercent', 'Vienkartinis mokestis nuo sumos, %'],
    ['rating', 'Redakcinis vertinimas, 0–5'],
  ] as const;
  const texts = [
    ['summary', 'Santrauka'],
    ['suitableFor', 'Kam tinka'],
    ['requirements', 'Reikalavimai'],
    ['documents', 'Dokumentai'],
    ['firstTerms', 'Pirmos paskolos sąlygos'],
    ['speed', 'Išmokėjimo laikas ir sąlygos'],
    ['ratingBasis', 'Vertinimo metodika ir pagrindimas'],
    [
      'example',
      'Reprezentatyvus pavyzdys (suma, terminas, normos, mokesčiai, įmoka, visa grąžintina suma)',
    ],
    ['verificationNotes', 'Ką dar PATIKRINTI'],
  ] as const;
  return (
    <form action={action} className="admin-form">
      <input name="id" type="hidden" value={c?.id || ''} />
      <label className="field">
        Slug (be „-apzvalga“)
        <input name="slug" defaultValue={c?.slug} required readOnly={!!c} />
      </label>
      {fields.map(([k, l]) => (
        <label className="field" key={k}>
          {l}
          <input
            name={k}
            defaultValue={c?.[k] || ''}
            required={['name', 'tagline', 'sourceUrl'].includes(k)}
          />
        </label>
      ))}
      <Upload onChange={setLogo} />
      <label className="field">
        Logotipo adresas
        <input name="logo" value={logo} onChange={(e) => setLogo(e.target.value)} />
      </label>
      <div className="filters">
        {numbers.map(([k, l]) => (
          <label className="field" key={k}>
            {l}
            <input
              type="number"
              min="0"
              step={k.startsWith('amount') || k.startsWith('term') ? '1' : '0.01'}
              name={k}
              defaultValue={c?.[k] ?? ''}
            />
          </label>
        ))}
      </div>
      <p className="notice">
        Kainodaros modelis: fiksuota anuitetinė paskola, nekintamos nominalios palūkanos, fiksuotas
        mėnesinis mokestis ir pradinis mokestis nuo sumos. Kredito linijoms ar kitokiai kainodarai
        šio modelio netvirtinkite. Visų mokesčių nebuvimą pažymėkite 0, nežinomus laukus palikite
        tuščius.
      </p>
      <label className="field">
        Kainodara ir modelis patvirtinti
        <select name="pricingVerified" defaultValue={String(c?.pricingVerified || false)}>
          <option value="false">Ne — kainos neskaičiuoti</option>
          <option value="true">Taip — visi parametrai ir pavyzdys patikrinti</option>
        </select>
      </label>
      <label className="field">
        Patvirtinimo data (UTC)
        <input type="datetime-local" name="verifiedAt" defaultValue={dateValue(c?.verifiedAt)} />
      </label>
      <div className="filters">
        {[
          ['firstFree', 'Pirma paskola 0 %'],
          ['fast', 'Greitas išmokėjimas'],
          ['payout247', 'Išmokėjimas 24/7'],
        ].map(([k, l]) => (
          <label className="field" key={k}>
            {l}
            <select
              name={k}
              defaultValue={c?.[k as 'firstFree'] === null || !c ? '' : String(c[k as 'firstFree'])}
            >
              <option value="">PATIKRINTI</option>
              <option value="true">Taip</option>
              <option value="false">Ne</option>
            </select>
          </label>
        ))}
      </div>
      {texts.map(([k, l]) => (
        <label className="field" key={k}>
          {l}
          <textarea name={k} defaultValue={c?.[k] || ''} rows={3} />
        </label>
      ))}
      <label className="field">
        Privalumai (po vieną eilutėje)
        <textarea
          name="pros"
          defaultValue={c ? arrayField<string>(c.pros).join('\n') : ''}
          rows={5}
        />
      </label>
      <label className="field">
        Trūkumai (po vieną eilutėje)
        <textarea
          name="cons"
          defaultValue={c ? arrayField<string>(c.cons).join('\n') : ''}
          rows={5}
        />
      </label>
      <label className="field">
        DUK JSON — klausimai „q“, atsakymai „a“
        <textarea name="faq" defaultValue={c?.faq || '[]'} rows={7} />
      </label>
      <div className="field">
        <span>Apžvalgos tekstas</span>
        <Editor value={html} onChange={setHtml} />
        <input name="reviewHtml" type="hidden" value={html} />
      </div>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn" disabled={pending}>
        {pending ? 'Saugoma…' : 'Išsaugoti kreditorių'}
      </button>
    </form>
  );
}
