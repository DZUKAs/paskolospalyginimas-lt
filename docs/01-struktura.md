# 1 etapas — struktūra ir duomenų modelis

Darbas vykdomas esamame `/workspace/paskolospalyginimas-lt` projekte. Technologijos: Next.js App Router, TypeScript, Tailwind CSS, Prisma + SQLite, Auth.js (NextAuth). SQLite skirtas vieno VPS procesui su patvariu disku. Vercel diegimui būtina pereiti prie PostgreSQL ir objektinės failų saugyklos; negalima naudoti laikino serverless disko.

## Maršrutai
- `/`: skaičiuoklė, kreditorių santrauka, darbo eiga, straipsniai, DUK.
- `/palyginimas`: filtrai, rūšiavimas, iki 3 kreditorių greta.
- `/loans/[slug]-apzvalga/`: visi šeši senieji URL išsaugomi.
- `/naujienos`, `/naujienos/[slug]`: turinys, paieška, kategorijos, puslapiavimas.
- `/apie-mus`, `/kontaktai`, `/privatumo-politika`, `/slapuku-politika`, `/reklamos-atskleidimas`, `/duk`.
- `/admin`: prisijungimas, naujienų ir kreditorių redagavimas, statistika; redaktoriui tik naujienos.

## Modelis
`Creditor` saugo sumas eurais, terminus mėnesiais, atskirai metinę palūkanų normą ir BVKKMN, mokesčius, kainodaros patvirtinimo būseną, pavyzdį, reikalavimus, privalumus, trūkumus, DUK, šaltinį ir datas. Nežinomi skaičiai yra null, ne nulis. `firstFree`, `fast`, `payout247` yra trijų būsenų: taip / ne / nepatikrinta. Paraiškų priėmimas 24/7 nereiškia išmokėjimo 24/7.

`Article` turi publikavimo būseną, suplanuotą datą, kategoriją, kreditorių, autorių ir SEO laukus. `User` turi rolę ir scrypt slaptažodžio maišą. `LoginAttempt` saugo bandymų limitus DB, `AuditLog` — redagavimo veiksmus.

## Turinio šaltiniai
2026-10-21 surinkti 31 adresas: pagrindinis, 24 sitemap turinio adresai ir 6 apžvalgos (tikslus inventorius `migration/source/inventory.json`). Išsaugoti ištraukti tekstai ir sitemap XML. HTML 200 nepatvirtina turinio tikrumo. Angliški demonstraciniai FINVIEW tekstai ir komentarų šlamštas neperkeliami kaip faktai.

- Credit24: šaltinyje 100–5000 €, iki 36 mėn., 23,88 % MPN / 27,09 % BVKKMN. Nesutampa 3 ir 6 mėn. atidėjimo bei akcijų sąlygos.
- Finbee: minimos 7 % palūkanos ir 1–6 % sutarties mokestis; nėra pakankamo pilno kainodaros modelio, dalis turinio demonstracinė.
- Bobutės paskola: 50–15000 €, 12–72 mėn. santraukoje, bet kitur 50–10000 € ir nuo 3 mėn.; 27,6 % MPN, 62,35 % BVKKMN, 3,3 €/mėn. mokestis. Prieštaravimai žymimi.
- SMS pinigai: 100–15000 €, 3–72 mėn., 21,99 % ir kitur nuo 3,67 % palūkanų; 7,50 €/mėn., BVKKMN iki 59,95 %. Akcijos nepatvirtintos.
- Savy: demonstracinis turinys; visi finansiniai laukai null.
- Vivus: 300–15000 €, iki 84 mėn., palūkanos nuo 9 %, administravimas 0,3–1 %, tačiau mokesčio bazė ir periodiškumas neaiškūs.

Nė vieno seno šaltinio kainodara nelaikoma šiandien patvirtintu pasiūlymu. Skaičiavimas leidžiamas tik administratoriui patvirtinus pilną modelį ir reprezentatyvų pavyzdį. BVKKMN nenaudojama vietoj nominalių palūkanų normos. Seni redakciniai balai nekeliami į AggregateRating.

## SEO migracija
Visos 6 apžvalgos išlaiko adresus. Visi 6 straipsniai gauna individualius 301 į `/naujienos/<tas-pats-slug>`. Senos sąrašo, apie ir kontaktų nuorodos turi semantinius 301. Šablono parduotuvės/krepšelio/paskyros adresai neliečia paskolų darbo eigos: grąžina 404, sprendimą dėl 410 patvirtinti pagal Search Console. Dabartiniame pagrindiniame puslapyje yra `noindex, nofollow`; nauja aplinka iki faktų ir teisinių duomenų patvirtinimo taip pat neindeksuojama.
