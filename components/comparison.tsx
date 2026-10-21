'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Creditor } from '@prisma/client';
import { Logo, Range } from './shared-client';
import { calculate, money } from '@/lib/pricing';
export function Comparison({
  creditors,
  initialAmount = 3000,
  initialMonths = 24,
}: {
  creditors: Creditor[];
  initialAmount?: number;
  initialMonths?: number;
}) {
  const [amount, setAmount] = useState(initialAmount),
    [months, setMonths] = useState(initialMonths),
    [sort, setSort] = useState('name'),
    [free, setFree] = useState(false),
    [fast, setFast] = useState(false),
    [always, setAlways] = useState(false),
    [chosen, setChosen] = useState<string[]>([]),
    [side, setSide] = useState(false);
  const filtered = creditors
    .filter(
      (c) =>
        (c.amountMin == null || amount >= c.amountMin) &&
        (c.amountMax == null || amount <= c.amountMax) &&
        (c.termMin == null || months >= c.termMin) &&
        (c.termMax == null || months <= c.termMax) &&
        (!free || c.firstFree === true) &&
        (!fast || c.fast === true) &&
        (!always || c.payout247 === true),
    )
    .sort((a, b) =>
      sort === 'price'
        ? (calculate(a, amount, months)?.total ?? Infinity) -
          (calculate(b, amount, months)?.total ?? Infinity)
        : sort === 'amount'
          ? (b.amountMax ?? -1) - (a.amountMax ?? -1)
          : sort === 'rating'
            ? (b.rating ?? -1) - (a.rating ?? -1)
            : a.name.localeCompare(b.name, 'lt'),
    );
  function toggle(id: string) {
    setChosen((v) => (v.includes(id) ? v.filter((i) => i !== id) : v.length < 3 ? [...v, id] : v));
  }
  function price(c: Creditor) {
    const p = calculate(c, amount, months);
    return p ? (
      <>
        <strong>{money(p.total)}</strong>
        <p>
          {money(p.monthly)} / mėn. + {money(p.upfront)} pradinis mokestis. Orientacinis anuitetas.
        </p>
        <p>BVKKMN {c.apr} %</p>
        <p>{c.example}</p>
      </>
    ) : (
      <span className="tiny">PATIKRINTI — trūksta patvirtintos kainodaros ir pavyzdžio.</span>
    );
  }
  function actions(c: Creditor) {
    return (
      <>
        {c.applyUrl ? (
          <a className="btn" href={c.applyUrl} rel="sponsored noopener noreferrer" target="_blank">
            Pateikti paraišką <ArrowUpRight size={14} />
          </a>
        ) : (
          <span className="tiny">Paraiškos nuoroda: PATIKRINTI</span>
        )}
        <Link className="review" href={`/loans/${c.slug}-apzvalga/`}>
          Skaityti apžvalgą
        </Link>
      </>
    );
  }
  const selected = creditors.filter((c) => chosen.includes(c.id));
  return (
    <>
      <section className="filter-panel" aria-label="Palyginimo filtrai">
        <div className="filters">
          <label className="field">
            Paskolos suma, €
            <input
              type="number"
              min="50"
              max="1000000"
              step="50"
              value={amount}
              onChange={(e) => setAmount(Math.max(50, Math.min(1000000, Number(e.target.value))))}
            />
          </label>
          <label className="field">
            Terminas, mėn.
            <input
              type="number"
              min="1"
              max="360"
              value={months}
              onChange={(e) => setMonths(Math.max(1, Math.min(360, Number(e.target.value))))}
            />
          </label>
          <label className="field">
            Rūšiuoti
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name">Pagal pavadinimą</option>
              <option value="price">Pagal bendrą kainą</option>
              <option value="amount">Pagal didžiausią sumą</option>
              <option value="rating">Pagal vertinimą</option>
            </select>
          </label>
        </div>
        <div className="checkboxes">
          <label>
            <input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} />{' '}
            Pirmoji paskola 0 %
          </label>
          <label>
            <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} />{' '}
            Greitas išmokėjimas
          </label>
          <label>
            <input type="checkbox" checked={always} onChange={(e) => setAlways(e.target.checked)} />{' '}
            Išmokėjimas 24/7
          </label>
        </div>
        <p className="tiny" style={{ margin: '15px 0 0' }}>
          Filtrai remiasi tik patvirtintomis savybėmis. Nežinoma sąlyga nereiškia „taip“. Ribos iš
          seno šaltinio dar tikslinamos.
        </p>
      </section>
      <p role="status" className="status-line">
        Rasti {filtered.length} kreditoriai · Kainos be patvirtintų duomenų neskaičiuojamos ·
        Nepatvirtinti balai nerodomi
      </p>
      {!filtered.length && (
        <div className="notice">
          Pagal pasirinktus filtrus patvirtintų rezultatų nėra. Pakeiskite sumą, terminą arba
          išjunkite savybių filtrus.
        </div>
      )}
      <div className="table-wrap desktop">
        <table>
          <caption className="sr-only">Kreditorių sąlygų palyginimas</caption>
          <thead>
            <tr>
              {[
                'Kreditorius / lyginti',
                'Suma / terminas',
                'BVKKMN',
                'Bendra grąžintina suma',
                'Pirmoji paskola',
                'Išmokėjimas',
                'Vertinimas',
                'Veiksmai',
              ].map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <Logo c={c} />
                  <label className="tiny">
                    <input
                      type="checkbox"
                      aria-label={`Lyginti ${c.name}`}
                      checked={chosen.includes(c.id)}
                      disabled={!chosen.includes(c.id) && chosen.length >= 3}
                      onChange={() => toggle(c.id)}
                    />{' '}
                    Lyginti
                  </label>
                </td>
                <td>
                  <Range min={c.amountMin} max={c.amountMax} unit="€" />
                  <p>
                    <Range min={c.termMin} max={c.termMax} unit="mėn." />
                  </p>
                  <span className="tiny">PATIKRINTI</span>
                </td>
                <td>
                  {c.pricingVerified && c.verifiedAt && c.apr != null ? `${c.apr} %` : 'PATIKRINTI'}
                </td>
                <td>{price(c)}</td>
                <td>{c.firstTerms || 'PATIKRINTI'}</td>
                <td>{c.speed || 'PATIKRINTI'}</td>
                <td>
                  {c.rating != null && c.ratingBasis
                    ? `${c.rating}/5 · ${c.ratingBasis}`
                    : 'PATIKRINTI'}
                </td>
                <td>{actions(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="comparison-mobile">
        <div className="cards">
          {filtered.map((c) => (
            <article className="card" key={c.id}>
              <div className="card-top">
                <Logo c={c} />
                <label className="tiny">
                  <input
                    type="checkbox"
                    checked={chosen.includes(c.id)}
                    disabled={!chosen.includes(c.id) && chosen.length >= 3}
                    onChange={() => toggle(c.id)}
                    aria-label={`Lyginti ${c.name}`}
                  />{' '}
                  Lyginti
                </label>
              </div>
              <dl className="metrics">
                <div>
                  <dt>Suma*</dt>
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
                * PATIKRINTI. BVKKMN:{' '}
                {c.pricingVerified && c.apr != null ? `${c.apr} %` : 'PATIKRINTI'}
              </p>
              <div>{price(c)}</div>
              <p className="tiny">
                Pirmoji paskola: {c.firstTerms || 'PATIKRINTI'}
                <br />
                Išmokėjimas: {c.speed || 'PATIKRINTI'}
                <br />
                Vertinimas: {c.rating != null && c.ratingBasis ? `${c.rating}/5` : 'PATIKRINTI'}
              </p>
              <div className="card-foot">{actions(c)}</div>
            </article>
          ))}
        </div>
      </div>
      {chosen.length > 0 && (
        <div className="compare-tray">
          <span>
            Pasirinkta {chosen.length} iš 3: {selected.map((c) => c.name).join(', ')}
          </span>
          <button className="btn lime" onClick={() => setSide(!side)}>
            {side ? 'Uždaryti' : 'Palyginti greta'}
          </button>
          <button
            className="btn lime"
            onClick={() => {
              setChosen([]);
              setSide(false);
            }}
          >
            Išvalyti
          </button>
        </div>
      )}
      {side && (
        <section aria-label="Kreditoriai greta" className="side-grid">
          {selected.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.name}</h3>
              <p>
                <Range min={c.amountMin} max={c.amountMax} unit="€" />
              </p>
              <p>
                <Range min={c.termMin} max={c.termMax} unit="mėn." />
              </p>
              <p className="tiny">{c.summary}</p>
              {price(c)}
              <p className="tiny">{c.verificationNotes}</p>
              {actions(c)}
            </div>
          ))}
        </section>
      )}
    </>
  );
}
