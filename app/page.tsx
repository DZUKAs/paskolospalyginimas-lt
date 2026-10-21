import Link from 'next/link';
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/db';
import { publishedWhere } from '@/lib/content';
import { Calculator } from '@/components/calculator';
import { CreditorCard, ArticleCard, Faq } from '@/components/shared';
export const dynamic = 'force-dynamic';
export const metadata = { alternates: { canonical: '/' } };
export default async function Home() {
  const [creditors, articles] = await Promise.all([
    db.creditor.findMany({ orderBy: { createdAt: 'asc' } }),
    db.article.findMany({ where: publishedWhere(), orderBy: { publishedAt: 'desc' }, take: 3 }),
  ]);
  return (
    <div className="wrap">
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="dot" /> Aiškus palyginimas. Apgalvotas sprendimas.
          </div>
          <h1>
            Jūsų planams.
            <br />
            Jūsų sąlygoms.
            <br />
            <em>Jūsų pasirinkimas.</em>
          </h1>
          <p className="hero-copy">
            Paskola prasideda ne nuo paraiškos, o nuo aiškumo. Palyginkite galimybes ir raskite tai,
            kas tinka jūsų situacijai.
          </p>
          <div className="hero-points">
            <span>
              <Check size={14} /> Šeši kreditoriai vienoje vietoje
            </span>
            <span>
              <ShieldCheck size={14} /> Skaidriai apie sąlygas
            </span>
          </div>
        </div>
        <Calculator />
      </section>
      <div className="partner-strip" aria-label="Apžvelgiami kreditoriai">
        <span>PAŽINKITE SAVO GALIMYBES</span>
        {['Credit24', 'savy', 'vivus', 'finbee', 'Bobutės paskola', 'SMS pinigai'].map((n) => (
          <span className="wordmark" key={n}>
            {n}
          </span>
        ))}
      </div>
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <span className="dot" /> Mažiau paieškų. Daugiau aiškumo.
            </div>
            <h2>
              Skirtingi kreditoriai.
              <br />
              Vienas aiškus palyginimas.
            </h2>
            <p>Susipažinkite su pasirinkimais. Nepatvirtintų sąlygų neslepiame.</p>
          </div>
          <Link href="/palyginimas">
            Palyginti visus kreditorius <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="cards">
          {creditors.slice(0, 3).map((c) => (
            <CreditorCard c={c} key={c.id} />
          ))}
        </div>
        <div className="notice">
          Duomenys perimti iš ankstesnės svetainės 2026-10-21. Aktualios kainos, BVKKMN ir
          reprezentatyvūs pavyzdžiai — <strong>PATIKRINTI</strong>. Tai nėra kreditoriaus
          pasiūlymas.
        </div>
      </section>
      <section className="steps-section">
        <div className="eyebrow">Paprastai, nuo pirmo žingsnio</div>
        <h2>
          Daugiau suprasti.
          <br />
          Ramiau pasirinkti.
        </h2>
        <div className="steps">
          {[
            [
              'Nusistatykite poreikį',
              'Pasirinkite sumą ir terminą. Įvertinkite, kokia įmoka būtų pakeliama jūsų biudžetui.',
            ],
            [
              'Palyginkite sąlygas',
              'Peržiūrėkite visą kainą, BVKKMN ir mokesčius. Vien mažiausių palūkanų nepakanka.',
            ],
            [
              'Spręskite neskubėdami',
              'Perskaitykite apžvalgą ir patikrinkite individualų pasiūlymą kreditoriaus svetainėje.',
            ],
          ].map(([h, p], i) => (
            <div key={h}>
              <span className="step-num">0{i + 1}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <span className="dot" /> Žinios, kurios praverčia
            </div>
            <h2>Finansų gidas kasdienai.</h2>
            <p>Aiškūs atsakymai, kad finansiniai sprendimai būtų apgalvoti.</p>
          </div>
          <Link href="/naujienos">
            Visi straipsniai <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="cards">
          {articles.map((a) => (
            <ArticleCard article={a} key={a.id} />
          ))}
        </div>
      </section>
      <section className="section faq">
        <div>
          <div className="eyebrow">
            <span className="dot" /> Turite klausimų?
          </div>
          <h2>
            Pradėkime
            <br />
            nuo atsakymų.
          </h2>
          <p>Apie palyginimą, kainą ir atsakingą skolinimąsi.</p>
          <Link href="/duk" className="btn outline">
            Visi klausimai <ArrowUpRight size={15} />
          </Link>
        </div>
        <Faq />
      </section>
      <section className="cta">
        <div>
          <h2>Aiškesnis vaizdas. Tvirtesnis sprendimas.</h2>
          <p>Skirkite laiko palyginti, prieš įsipareigodami.</p>
        </div>
        <Link href="/palyginimas" className="btn">
          Palyginti paskolas <ArrowUpRight size={16} />
        </Link>
      </section>
    </div>
  );
}
