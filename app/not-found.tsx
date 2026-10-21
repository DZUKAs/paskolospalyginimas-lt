import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="wrap section">
      <div className="eyebrow">404 / Puslapis nerastas</div>
      <h1>
        Šis kelias čia baigiasi.
        <br />
        Raskime kitą.
      </h1>
      <p>Nuoroda galėjo pasikeisti arba puslapio nebėra.</p>
      <Link href="/" className="btn">
        Grįžti į pradžią →
      </Link>
    </div>
  );
}
