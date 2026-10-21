# Paskolospalyginimas.lt

Nauja lietuviška paskolų palyginimo svetainė su administravimu. Next.js App Router, TypeScript, Tailwind CSS, Prisma + SQLite, Auth.js, TipTap. Šviesi ir tamsi temos, vietiniai Manrope šriftai, mobile-first dizainas.

Saugykla: `DZUKAs/paskolospalyginimas-lt`.

## Paleidimas

Reikia Node.js **24 LTS**, npm ir Linux su OpenSSL 3. Darbo katalogas — šios saugyklos šaknis (debesijos aplinkoje `/workspace/paskolospalyginimas-lt`).

```bash
npm ci
node scripts/setup-env.mjs
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Naršyklėje naudokite vietinio serverio 3000 prievadą. Produkcijos patikrai: `npm run build`, tada `npm start`. Cloud užduotis jau izoliuota; naudokite esamą checkout, nekurkite Git worktree.

`setup-env.mjs` tik jei failo nėra sukuria `.env` ir atsitiktinę sesijos paslaptį, neišveda jos į terminalą, nekeičia esamo failo. `db:migrate` prieš Prisma sukuria trūkstamą SQLite failą (šio runtime suderinamumui). Seed yra pakartojamas, nekeičia esamų to paties slug įrašų ir **nekuria administratoriaus**. Pridedami 6 kreditoriai ir 6 perrašytos senos publikacijos, iš jų daugiau nei reikalauti 3 pavyzdžiai.

## Aplinkos kintamieji

| Pavadinimas | Paskirtis |
| --- | --- |
| `DATABASE_URL` | SQLite adresas; santykinis kelias skaičiuojamas nuo `prisma/`, pvz., `file:./dev.db`. Produkcijoje naudokite absoliutų patvaraus disko kelią. |
| `NEXTAUTH_URL` | Tikslus aplikacijos origin, vietoje `http://localhost:3000`, produkcijoje tikras HTTPS adresas. |
| `NEXTAUTH_SECRET` | Ilga atsitiktinė, slapta, stabili sesijos pasirašymo / šifravimo reikšmė. Niekada necommitinkite. |
| `SITE_URL` | Viešasis canonical ir sitemap pagrindas, numatyta `https://paskolospalyginimas.lt`. |
| `ALLOW_INDEXING` | `false` iki duomenų, politikų ir domeno patvirtinimo; `true` tik viešam paleidimui. Pakeitus perkurkite build (robots generuojamas build metu). |
| `ADMIN_PASSWORD` | Tik vienkartinei CLI paskyros kūrimo komandai, ne bendram aplikacijos darbui. |

Nereikia kreditorių API raktų, GitHub tokeno ar trečiųjų šalių analitikos prisijungimų. `.env` ir DB neįtraukti į Git. Diegimo aplinkoje reikšmes laikykite paslapčių valdymo sistemoje.

## Pirmas administratorius

Bash terminale, saugiai įveskite slaptažodį (jis nebus rodomas):

```bash
read -rsp 'Administratoriaus slaptažodis (bent 14 simbolių): ' ADMIN_PASSWORD
export ADMIN_PASSWORD
npm run admin:create -- --email jusu-tikras-adresas@example.lt --role ADMIN
unset ADMIN_PASSWORD
```

Redaktoriui naudokite `--role EDITOR`. Prisijungimas — `/admin`. Viešos registracijos nėra. Nekelkite slaptažodžio į komandų argumentus, kodą ar pokalbį. Sesija galioja 8 val.; paskyros DB `sessionVersion` padidinimas atšaukia ankstesnes sesijas. Paskyros el. paštas unikalus; CLI esamos paskyros neperrašo.

## Administravimas

- Naujienos: kurti, redaguoti, trinti su patvirtinimu; juodraštis, paskelbta ar suplanuota; TipTap, kategorija, autorius, kreditorius, paveikslėliai, SEO ir OG.
- Datos įvedamos **UTC**, lankytojui rodomos Lietuvos laiku. Suplanuotas turinys viešas nuo datos, nereikia atskiro cron.
- Kreditoriai: pridėti be programavimo, redaguoti skaičius, nuorodas, logotipą, apžvalgą, privalumus, trūkumus ir DUK. DUK JSON formato pavyzdys: `[{"q":"Klausimas?","a":"Atsakymas."}]`.
- Esami slug išsaugomi, kad nelūžtų SEO nuorodos. Naujiems kreditoriams URL sukuriamas automatiškai.
- Redaktorius turi tik naujienų teises. Kiekvienas mutavimas patikrinamas serveryje ir įrašomas į audito žurnalą.
- Paveikslėliai JPG/PNG/WebP iki 5 MB perrašomi į WebP. Produkcijos proxy nustatykite ne didesnę kaip 6 MB užklausos ribą.

## Kainodara ir faktai

**Visų šešių kreditorių pradinė kainodara nepatvirtinta.** Nežinomi laukai yra `null` ir viešai žymimi `PATIKRINTI`. Finansinių teiginių iš demonstracinio šablono neperkeliame. Pirmoji paskola 0 %, greitas išmokėjimas ir išmokėjimas 24/7 taip pat turi nežinomą būseną, kol patikrinti. Paraiškų priėmimas 24/7 nėra išmokėjimas 24/7.

Skaičiavimas aktyvus tik su patvirtinta data, reprezentatyviu pavyzdžiu, BVKKMN ir pilnais kainodaros parametrais. Formulė skirta **fiksuotam anuitetui** su fiksuotu mėnesio mokesčiu ir vienkartiniu procentiniu mokesčiu nuo sumos. Kredito linijoms, kintamoms palūkanoms ar kitokiai mokesčių struktūrai šio modelio netvirtinkite. Rezultatas orientacinis; galutinį grafiką pateikia kreditorius.

[Perimta informacija, PATIKRINTI ir rekomendacijos](docs/PATIKRINTI.md). Pirminiai tekstai ir sitemap XML — `docs/migration/source/`; pilni HTML originalai dabartinės cloud mašinos `/workspace/site-migration/source/` kataloge.

## Testavimas

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
```

Playwright naudoja sisteminį `/usr/bin/chromium`; jei jo nėra, įdiekite Chromium arba pakeiskite `playwright.config.ts` į Playwright valdomą naršyklę. E2E paleidžia produkcinį serverį, jei 3000 prievade jo nėra. Naudojama **vietinė testinė DB**, niekada neleiskite testų prieš tikrą produkcinę DB: jie sukuria ir pašalina atsitiktinius testinius naudotojus bei turinį. Paleisti prieš lokaliai paruoštą seed. Automatinė prieinamumo patikra naudoja axe WCAG 2 A/AA ir 2.1 AA; ji nepakeičia pilno rankinio audito.

## Diegimas į VPS

Ši versija pasirinkta vienam Node procesui su SQLite ir patvariu disku. **Vercel serverless šiai SQLite + vietinių uploads versijai netinka**. Vercel reikia PostgreSQL ir objektinės saugyklos adaptacijos; README neteigia, kad ji jau atlikta.

1. Prieš keisdami seną svetainę padarykite WordPress DB, uploads ir serverio konfigūracijos kopiją.
2. Paruoškite Node 24, HTTPS reverse proxy, paslaugos paskyrą ir patvarų SQLite failo bei `data/uploads` katalogą. Proxy užklausos riba 6 MB, pridėkite prisijungimo užklausų ribojimą pagal patikimą IP.
3. Nustatykite `NEXTAUTH_URL`, `SITE_URL`, unikalų `NEXTAUTH_SECRET`, absoliutų `DATABASE_URL`. Įjunkite automatines SQLite ir uploads kopijas, patikrinkite atkūrimą.
4. `npm ci && npm run db:generate && npm run db:migrate && npm run db:seed && npm run build`.
5. Sukurkite tikrą administratorių. Paleiskite `npm start` per systemd ar kitą procesų valdiklį, reverse proxy nukreipkite į 3000 prievadą, tikrinkite puslapius ir 301 HTTPS bandomajame domene.
6. Patvirtinkite finansinius faktus, partnerių nuorodas ir teisinius tekstus. Tik tada `ALLOW_INDEXING=true`, naujas build ir restartas; Search Console pateikite sitemap.

`data/uploads` failus patiekia saugus `/uploads/[filename]` maršrutas, todėl nauji įkėlimai veikia be build ar restarto. Produkcijoje galima šį kelią patiekti reverse proxy tiesiai iš patvaraus katalogo. Jei turėsite daugiau nei vieną serverį, pereikite prie PostgreSQL ir bendros objektinės failų saugyklos.

Seni šeši apžvalgų adresai veikia. Šešiems straipsniams ir seniems semantiškai atitinkamiems puslapiams sukonfigūruoti 301. Šabloniniai shop/cart/checkout/my-account adresai grąžina 404; dėl 410 spręsti patikrinus Search Console.

## Etapų aprašai

1. [Struktūra ir modelis](docs/01-struktura.md)
2. [Dizaino sistema](docs/02-dizainas.md)
3. [Viešieji puslapiai](docs/03-viesieji-puslapiai.md)
4. [Administravimas](docs/04-administravimas.md)
5. [SEO ir teisinė dalis](docs/05-seo-teise.md)
6. [Testavimo rezultatai](docs/06-testavimas.md)

Tai naujos svetainės projektas cloud aplinkoje. Veikianti `paskolospalyginimas.lt` svetainė nepakeista ir projektas į produkciją neišdiegtas.
