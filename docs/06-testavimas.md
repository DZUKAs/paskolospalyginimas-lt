# 6 etapas — testavimo rezultatai

Patikrinta 2026-10-21 šioje Linux cloud mašinoje, Node 24.19.0, Next 16.4.2, Prisma 6.19.3, sisteminis Chromium. Tai dabartinės mašinos ir lokalaus produkcinio build patikra, ne diegimo į paskolospalyginimas.lt ar atkūrimo naujoje užduotyje patvirtinimas.

## Rezultatai

- `npm run build` — sėkmingas produkcinis build su TypeScript patikra.
- `npm run typecheck` — sėkminga.
- `npm test` — **8 passed, 0 failed, 0 skipped**: scrypt, individualūs salt, klaidingas slaptažodis, DB bandymų limitas ir jo intervalo atnaujinimas, anuitetas su mokesčiais, nulinė norma, nepatvirtintos kainodaros ir ribų atmetimas, HTML XSS išvalymas, JSON-LD script apsauga.
- `npm run test:e2e` — **11 passed, 0 failed, 0 skipped**: skaičiuoklė ir URL parametrai, filtrai, greta palyginimas, 6 apžvalgos ir metaduomenys, naujienų paieška, straipsnis, 301, tikri 404, administravimo apsauga, mobilus vaizdas ir tema, prisijungimas, naujienos sukūrimas / publikavimas / redagavimas / ištrynimas, redaktoriaus apribojimas, suplanuota publikacija, kreditoriaus sukūrimas ir tikras WebP įkėlimas bei jo HTTP 200.
- Axe patikros WCAG 2 A/AA ir 2.1 A/AA pagrindiniame, palyginimo ir prisijungimo puslapiuose, **šviesia ir tamsia tema** — automatinių pažeidimų nerasta.
- Pakeitus robots į runtime generavimą, paveiktos WCAG / robots patikros pakartotos: **2 passed**.
- `npm audit --omit=dev` — **0 žinomų pažeidžiamumų**. Sharp ir tranzityvinis deepmerge-ts atnaujinti per testuotus overrides. Tai nėra pilnas saugumo auditas.
- Atskirame naujame `/tmp/paskolos-repeatability.db`: migracija ir du seed paleidimai; gauti tiksliai **6 kreditoriai, 6 publikacijos**, be dublikatų.
- Po E2E pašalinti testiniai naudotojai ir turinys. Pagrindinėje DB 6 kreditoriai, 6 publikacijos, **0 naudotojų**; tikrą administratorių kurti pagal README.
- `git diff --check` — be klaidų. Esamas `hello_world.txt` nepakeistas.

## Lighthouse

Mobili emuliacija, produkcinis build, atskiras vietinis serveris su `ALLOW_INDEXING=true`:

| Kategorija | Balas |
| --- | --- |
| Greitis | 98 |
| Prieinamumas | 100 |
| Gerosios praktikos | 100 |
| SEO | 100 |

Skaitinis rezultatas: [reports/lighthouse.json](reports/lighthouse.json). Matuotas pagrindinis puslapis; neteigiama, kad kiekvienas galimas puslapis ar tikras VPS išmatuotas. Vienas matavimas nepakeičia realių naudotojų Core Web Vitals.

Ankstesnė peržiūros patikra su `noindex` gavo 94 / 100 / 100 / 69; SEO mažino meta noindex ir robots disallow. Patikrinta, kad atskirame indeksuojamame režime šių draudimų nėra. Pagrindinė peržiūra lieka `ALLOW_INDEXING=false`. Tikras viešas domenas nepakeistas.

## Vaizdo peržiūra

- [Stalinis vaizdas](screenshots/pradzia.png)
- [Mobilus vaizdas](screenshots/mobilus.png)
- [Tamsi tema](screenshots/tamsi-tema.png)

Patikrintos vietinės iliustracijos, šriftas su lietuviškomis raidėmis, rodyklių SVG, skaičiuoklės vienetų išdėstymas ir horizontalus mobiliojo puslapio tilpimas. Tikrus prekių ženklų logotipus turi pateikti savininkas.

## Kas dar nepatvirtinta

Tikri kreditorių pasiūlymai, affiliate nukreipimai, teisinė politikų redakcija, tikras administratoriaus sukūrimas, DNS / HTTPS / VPS diegimas, WordPress atsarginė kopija ir naujos cloud užduoties atkūrimas. Tikslus sąrašas — [PATIKRINTI.md](PATIKRINTI.md). Šie punktai nėra praeitų testų rezultatai.
