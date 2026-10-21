import sanitizeHtml from 'sanitize-html';
export const cleanHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'a'],
    allowedAttributes: { a: ['href', 'title', 'rel'] },
    allowedSchemes: ['https', 'mailto'],
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
  });
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
export const siteUrl = process.env.SITE_URL || 'https://paskolospalyginimas.lt';
export const commonFaq = [
  {
    q: 'Ar ši svetainė suteikia paskolas?',
    a: 'Ne. Čia lyginame kreditorių informaciją. Paraišką pateikiate pasirinkto kreditoriaus svetainėje, o sprendimą dėl paskolos priima kreditorius.',
  },
  {
    q: 'Kuo BVKKMN skiriasi nuo palūkanų?',
    a: 'Palūkanos yra tik dalis paskolos kainos. BVKKMN padeda palyginti metines kredito išlaidas, įskaitant į jos apskaičiavimą įtraukiamus mokesčius. Taip pat lyginkite bendrą grąžintiną sumą.',
  },
  {
    q: 'Ar skaičiuoklės rezultatas yra pasiūlymas?',
    a: 'Ne. Skaičiavimas yra orientacinis ir rodomas tik turint patvirtintą kainodarą. Galutines sąlygas, įvertinęs kreditingumą, pateikia kreditorius.',
  },
  {
    q: 'Ar palyginimas yra finansinė konsultacija?',
    a: 'Ne. Tai bendro pobūdžio informacija. Prieš skolindamiesi įvertinkite pajamas, išlaidas, turimus įsipareigojimus ir galimybę grąžinti paskolą.',
  },
];
export function arrayField<T>(s: string, fallback: T[] = []): T[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}
export const publishedWhere = () => ({
  OR: [
    { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
    { status: 'SCHEDULED', publishedAt: { lte: new Date() } },
  ],
});
