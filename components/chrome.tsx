'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, ArrowUpRight } from 'lucide-react';
export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <ArrowUpRight size={26} />
          </span>
          <span>
            paskolų<span style={{ fontWeight: 400 }}>palyginimas</span>
            <small>AIŠKIAU APIE FINANSUS</small>
          </span>
        </Link>
        <nav
          aria-label="Pagrindinė navigacija"
          className={`nav-links ${open ? 'open' : ''}`}
          onClick={() => setOpen(false)}
        >
          <Link href="/palyginimas">Palyginti paskolas</Link>
          <Link href="/naujienos">Finansų gidas</Link>
          <Link href="/apie-mus">Apie mus</Link>
          <Link href="/duk">DUK</Link>
        </nav>
        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={toggle}
            aria-label={dark ? 'Įjungti šviesią temą' : 'Įjungti tamsią temą'}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link className="btn outline" href="/palyginimas">
            Rasti paskolą <ArrowUpRight size={15} />
          </Link>
          <button
            className="icon-btn menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Meniu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Cookies() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => setVisible(!localStorage.getItem('cookie-consent')), []);
  function choose(analytics: boolean) {
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, analytics, version: 1, date: new Date().toISOString() }),
    );
    setVisible(false);
    setStatus('Slapukų pasirinkimas išsaugotas.');
  }
  return (
    <>
      <span role="status" className="sr-only">
        {status}
      </span>
      <button
        className="tiny"
        style={{
          background: 'none',
          border: 0,
          textDecoration: 'underline',
          padding: 0,
          color: 'inherit',
        }}
        onClick={() => setVisible(true)}
      >
        Slapukų nustatymai
      </button>
      {visible && (
        <section className="cookie-banner" aria-label="Slapukų pasirinkimas">
          <h3>Jūsų privatumas svarbus.</h3>
          <p>
            Būtinieji slapukai užtikrina prisijungimą. Analitikos įrankiai šiame projekte neįdiegti.
            Pasirinkimą galite pakeisti bet kada.{' '}
            <Link href="/slapuku-politika">Apie slapukus →</Link>
          </p>
          <div className="cookie-actions">
            <button className="btn outline" onClick={() => choose(false)}>
              Tik būtinieji
            </button>
            <button className="btn" onClick={() => choose(true)}>
              Leisti ir analitiką
            </button>
          </div>
        </section>
      )}
    </>
  );
}
