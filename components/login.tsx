'use client';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
export function Logout() {
  return (
    <button className="btn outline" onClick={() => signOut({ callbackUrl: '/admin/prisijungti' })}>
      Atsijungti
    </button>
  );
}
export function Login() {
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  return (
    <form
      className="card login-card"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        const f = new FormData(e.currentTarget);
        try {
          const r = await signIn('credentials', {
            email: f.get('email'),
            password: f.get('password'),
            redirect: false,
          });
          if (r?.ok) window.location.assign('/admin');
          else
            setError(
              'Prisijungti nepavyko. Patikrinkite duomenis arba po 15 minučių bandykite dar kartą.',
            );
        } catch {
          setError('Prisijungimas laikinai neveikia. Bandykite vėliau.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="eyebrow">Tik redakcijai</div>
      <h1 style={{ fontSize: 30 }}>Sveiki sugrįžę.</h1>
      <label className="field">
        El. paštas
        <input name="email" type="email" autoComplete="username" required maxLength={254} />
      </label>
      <label className="field">
        Slaptažodis
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button className="btn full" disabled={busy}>
        {busy ? 'Jungiamasi…' : 'Prisijungti →'}
      </button>
    </form>
  );
}
