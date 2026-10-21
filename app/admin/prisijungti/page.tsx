import { Login } from '@/components/login';
export const metadata = {
  title: 'Administravimo prisijungimas',
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="wrap">
      <Login />
    </div>
  );
}
