// Universal presentation helpers; safe for client bundles (no database imports).
import type { Creditor } from '@prisma/client';
import Image from 'next/image';
export function Logo({ c }: { c: Pick<Creditor, 'name' | 'logo'> }) {
  return (
    <span className="lender-logo">
      {c.logo ? (
        <Image src={c.logo} alt={`${c.name} logotipas`} width={100} height={40} unoptimized />
      ) : (
        <>
          <span className="lender-symbol" aria-hidden="true">
            {c.name[0]}
          </span>
          {c.name}
        </>
      )}
    </span>
  );
}
export function Range({
  min,
  max,
  unit,
}: {
  min: number | null;
  max: number | null;
  unit: string;
}) {
  return (
    <>
      {min != null && max != null
        ? `${min.toLocaleString('lt-LT')}–${max.toLocaleString('lt-LT')} ${unit}`
        : max != null
          ? `Iki ${max.toLocaleString('lt-LT')} ${unit}`
          : 'PATIKRINTI'}
    </>
  );
}
