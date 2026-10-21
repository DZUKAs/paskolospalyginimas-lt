# Hostinger Node.js diegimas ir tuščios DB pataisymas

Žurnalo klaida `The table main.Creditor does not exist` patvirtina, kad vykdymo aplinkoje atidaryta SQLite DB be aplikacijos lentelių. Vien build metu atliktų migracijų nepakanka, jei vykdymas naudoja kitą failą arba build failai neperkeliami į runtime.

## Paleidimo eiga

Next.js `instrumentation.ts` Node serverio `register()` kabliukas prieš aptarnaujant aplikacijos užklausas paleidžia `scripts/prepare-runtime.mjs`. Tai veikia ir kai valdomas hostingas pats paleidžia Next serverį, ne mūsų npm start wrapperį.

1. Patikrinamas `DATABASE_URL`, jo santykinis failo kelias suvienodinamas į absoliutų nuo projekto `prisma/` katalogo.
2. Jei reikia, sukuriamas katalogas ir neegzistuojantis tuščias failas. Esamas failas netrumpinamas ir nekeičiamas kitu.
3. Vykdomas Prisma `migrate deploy`; istorija saugoma įprastoje `_prisma_migrations` lentelėje.
4. Paleidžiamas natyvus Node `prisma/seed.mjs --once`. DB lentelėje SeedState saugomas užbaigimo žymeklis, todėl automatinis seed atliekamas tik vieną kartą vienai DB, vienoje transakcijoje. Esami įrašai pagal slug neperrašomi; vėliau ištrintos publikacijos per restartą neatsiranda iš naujo. Automatinis administratorius nekuriamas. Rankinis npm run db:seed išlieka aiški komanda trūkstamam pradiniam turiniui atkurti.
5. Tik sėkmingai užbaigus paruošimą aplikacija aptarnauja turinį. Migracijos klaida nestumiama į šalį ir neužmaskuojama tuščiu palyginimu.

Prisma CLI yra produkcinė priklausomybė; runtime nepriklauso nuo `tsx` ar kitų dev paketų. Next output tracing apima migracijas, pradinius duomenis ir paruošimo skriptus.

## hPanel nustatymai peržiūrai

- Next.js, šaka main, Node.js 24.x, katalogas ./.
- Build komanda: `npm run build`. npm automatiškai prieš ją vykdo `prebuild`: sugeneruoja Prisma klientą, pritaiko migracijas ir vieną kartą paruošia pradinius duomenis. Tai suderinama su hPanel vienos komandos pasirinkimo sąrašu.
- Jei rodomas start laukas: `npm start`. Valdomo Next.js paleidimo atveju bootstrap vykdomas per instrumentation.
- `DATABASE_URL=file:./dev.db` — peržiūros DB šio konkretaus leidimo `prisma/` kataloge.
- `NEXTAUTH_URL` ir `SITE_URL` — tikras HTTPS laikino domeno adresas.
- `ALLOW_INDEXING=false`.
- `NEXTAUTH_SECRET` — privati atsitiktinė reikšmė hPanel, ne Git ar pokalbyje.

Naujo leidimo vykdymo žurnale turi būti `[database] Preparing migrations and initial content.` ir `[database] Ready. Existing records preserved.`. Po to tikrinkite pagrindinį, palyginimo, apžvalgos ir naujienų puslapius.

## Duomenų išlikimo riba

Šis pataisymas paruošia realią runtime DB ir išsaugo joje esančius įrašus per restartą. **Jis neįrodo, kad Hostinger išsaugo leidimo katalogą per naują diegimą.** Loguose matyti versijuotas `hbuilds/versions/.../nodejs` kelias. `file:./dev.db` tame kataloge nėra patvaraus bendro saugojimo garantija. Prieš naudodami administravimą tikram turiniui, būtina patvirtinti teikėjo patvaraus disko vietą ir nustatyti absoliutų DATABASE_URL, arba pasirinkti palaikomą išorinę DB ir saugyklą. Nepriskirkite spėjamo absoliutaus Hostinger kelio.

Panašiai atskirai patvirtinkite `data/uploads` išsaugojimą ir atsargines kopijas. Veikianti WordPress svetainė ir jos DB šiuo pataisymu neliečiamos.

## Pataisymo patikros

- Produkcinis Next.js build ir TypeScript patikra — sėkmingi.
- 10 testų — visi praėjo. Nauji testai atkuria tuščią DB, tikrina lenteles ir 6 kreditorių / 6 publikacijų turinį, pakartotinį paleidimą, redaguoto teksto išlikimą bei sąmoningai ištrintos publikacijos neatsikūrimą.
- Serveris paleistas su nauja DB, neleidus rankinių migracijų. Pagrindinis, palyginimo, Credit24 apžvalgos ir naujienų puslapiai grąžino HTTP 200 bei tikrą turinį.
- Atskirame kataloge atliktas `npm ci --omit=dev`, be vietinės .env ir DB, ir patikrintas toks pats serverio paleidimas. Tai patikrina, kad bootstrap nepriklauso nuo tsx ar dev-only Prisma CLI.
- Tai vietinės produkcinės kopijos patikra; ji nėra Hostinger jau paskelbto leidimo veikimo patvirtinimas.

## Kai hPanel rodo tik bendrą instrumentation klaidą

Kai naudojama paveldima child proceso stderr išvestis, valdomas hostingas gali išsaugoti tik viršutinę Next.js klaidą `Command failed ... prepare-runtime.mjs` ir prarasti vidinę priežastį. `scripts/run-command.mjs` dabar užfiksuoja subprocess stdout/stderr, grąžinimo statusą ir signalą, o nesėkmės atveju įtraukia juos į tėvinį Error. Pranešimai žymimi `[database:bootstrap]`, `[database:migrate]` arba `[database:seed]`. Žinomos aplinkos paslapčių reikšmės užmaskuojamos; pats aplinkos turinys neišvedamas.

Registravimas nekeičia migracijų ar DB duomenų ir nepaverčia nesėkmingo paleidimo sėkmingu. Jo paskirtis — pateikti konkrečią Hostinger runtime nesėkmę, prieš parenkant kitą pataisymą. Du papildomi testai patvirtina išlaikytą child stderr / exit status ir paslapčių pašalinimą, taip pat ankstyvo paruošimo sutrikimo priežasties išlikimą tėviniame pranešime.
