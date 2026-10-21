export type Pricing = {
  pricingVerified: boolean;
  annualRate: number | null;
  monthlyFee: number | null;
  originationPercent: number | null;
  apr: number | null;
  example: string | null;
  amountMin: number | null;
  amountMax: number | null;
  termMin: number | null;
  termMax: number | null;
  verifiedAt: Date | string | null;
};
export function calculate(p: Pricing, amount: number, months: number) {
  if (
    !Number.isFinite(amount) ||
    !Number.isInteger(months) ||
    amount <= 0 ||
    months < 1 ||
    !p.pricingVerified ||
    !p.verifiedAt ||
    !p.example ||
    [
      p.annualRate,
      p.monthlyFee,
      p.originationPercent,
      p.apr,
      p.amountMin,
      p.amountMax,
      p.termMin,
      p.termMax,
    ].some((x) => x === null)
  )
    return null;
  if (amount < p.amountMin! || amount > p.amountMax! || months < p.termMin! || months > p.termMax!)
    return null;
  if (p.annualRate! < 0 || p.monthlyFee! < 0 || p.originationPercent! < 0) return null;
  const r = p.annualRate! / 1200;
  const base = r === 0 ? amount / months : (amount * r) / (1 - Math.pow(1 + r, -months));
  const fee = (amount * p.originationPercent!) / 100;
  return {
    monthly: base + p.monthlyFee!,
    total: (base + p.monthlyFee!) * months + fee,
    upfront: fee,
  };
}
export const money = (n: number) =>
  new Intl.NumberFormat('lt-LT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(n);
