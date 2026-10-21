'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export function Calculator() {
  const [amount, setAmount] = useState(3000);
  const [months, setMonths] = useState(24);
  return (
    <div className="calculator" id="skaiciuokle">
      <div className="calc-head">
        <h2>Jūsų planas prasideda čia</h2>
        <span>01 / 02</span>
      </div>
      <div className="field">
        <label className="field-row" htmlFor="hero-amount">
          Norima paskolos suma{' '}
          <span>
            <input
              id="hero-amount"
              type="number"
              min={50}
              max={15000}
              step={50}
              value={amount}
              onChange={(e) => setAmount(Math.max(50, Math.min(15000, Number(e.target.value))))}
            />{' '}
            €
          </span>
        </label>
        <input
          aria-label="Paskolos sumos slankiklis"
          type="range"
          min={50}
          max={15000}
          step={50}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className="range-ends">
          <span>50 €</span>
          <span>15 000 €</span>
        </div>
      </div>
      <div className="field">
        <label className="field-row" htmlFor="hero-months">
          Grąžinimo terminas{' '}
          <span>
            <input
              id="hero-months"
              type="number"
              min={3}
              max={84}
              value={months}
              onChange={(e) => setMonths(Math.max(3, Math.min(84, Number(e.target.value))))}
            />{' '}
            mėn.
          </span>
        </label>
        <input
          aria-label="Termino slankiklis"
          type="range"
          min={3}
          max={84}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
        />
        <div className="range-ends">
          <span>3 mėn.</span>
          <span>84 mėn.</span>
        </div>
      </div>
      <p className="calc-info">
        Pasirinkite sumą ir terminą. Kainą skaičiuosime tik pagal patvirtintas kreditorių sąlygas.
      </p>
      <Link href={`/palyginimas?suma=${amount}&terminas=${months}`} className="btn lime full">
        Palyginti galimybes <ArrowUpRight size={18} />
      </Link>
      <p className="tiny center" style={{ margin: '12px 0 0' }}>
        Be registracijos · Neįpareigoja skolintis
      </p>
    </div>
  );
}
