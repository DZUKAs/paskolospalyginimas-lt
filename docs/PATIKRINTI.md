# Duomenų ir paleidimo patikros sąrašas

## Kas perimta
- 6 kreditorių pavadinimai ir tikslūs apžvalgų URL.
- Credit24, Finbee, Bobutės paskolos, SMS pinigų ir Vivus lietuviškų apžvalgų tinkami faktiniai fragmentai, apibūdinimai, reikalavimai ir trūkumai. Finansiniai laukai saugomi kaip nepatvirtinta migracija.
- 6 senų straipsnių temos, originalūs tekstai archyve ir individualūs nukreipimai į perrašytus straipsnius.
- Svetainės paskirtis: palyginimas ir apžvalgos, o ne paskolų suteikimas.
- Sitemap URL inventorius ir pagrindinės navigacijos reikšmės.

- Perimtos dvi esamos HTTPS partnerių nuorodos: Credit24 ir SMS pinigai. Jų partnerystės galiojimas dar PATIKRINTI. Bobutės paskolos senas partnerio URL naudoja HTTP; Savy ir Vivus nuorodų nėra, Finbee likusi localhost šablono nuoroda. Šių keturių aktyvūs CTA neįjungiami be tinkamų adresų.

## PATIKRINTI prieš viešą paleidimą
1. Visų šešių kreditorių dabartinės sumos, terminai, nominalios palūkanos, BVKKMN, visi mokesčiai, individualus reprezentatyvus pavyzdys ir kainodaros modelis.
2. Savy — visi finansiniai, tinkamumo, dokumentų, privalumų ir trūkumų duomenys, nes senas puslapis demonstracinis.
3. Credit24 — kredito linijos ir vartojimo paskolos atskyrimas, 3/6 mėn. atidėjimo prieštaravimas, akcijų 3 mėn./50 dienų sąlygos. Kredito linijai dabartinės anuiteto formulės netvirtinti.
4. Finbee — 7 % ir 1–6 % dydžių galiojimas, sumos, terminai ir mokesčio bazė.
5. Bobutės paskola — 10 000/15 000 € ir 3/12 mėn. neatitikimai; sutarties ir mėnesio mokesčio tipas; 27,6 % / 62,35 % duomenų aktualumas.
6. SMS pinigai — 21,99 % / nuo 3,67 % neatitikimas, BVKKMN iki 59,95 % reikšmė, 7,50 € mokestis, 0 % pirmos paskolos akcija, refinansavimo ir įmokų atidėjimo teiginiai.
7. Vivus — nuo 9 % norma, 0,3–1 % mokesčio bazė ir periodiškumas, BVKKMN, minimalus terminas; šabloniniai balai atmetami.
8. Visų kreditorių oficialios / affiliate paraiškų nuorodos, tikri logotipai ir teisės juos naudoti. Neįrodyti reitingai ir vertinimo metodika.
9. Svetainės valdytojo vardas / įmonė, kodas jei taikoma, adresas, kontaktinis el. paštas; partnerystės sutartys ir komisinio atskleidimas.
10. Prieglobos teikėjas, duomenų tvarkymo sutartys, gavėjai, geografinis saugojimas, teisėti pagrindai ir žurnalų saugojimo terminai. Galutinė teisininko patikrinta politikų redakcija.
11. Tikras administratoriaus el. paštas. Slaptažodis perduodamas tik saugiu terminalo / paslapčių valdymo būdu, ne pokalbyje. Produkcijos NEXTAUTH_SECRET turi būti unikalus ir saugomas saugiai.
12. Search Console: senų nenaudojamų shop/cart/checkout/my-account/puslapio-pavyzdys URL lankomumas, sprendimas dėl 404/410, likusios indeksuotos nuorodos ir canonical. Dabartinio seno puslapio noindex buvimo priežastis.
13. Perrašytų publikacijų autorius ir naujos redakcijos data; šaltinio publikavimo datos ne visur patvirtintos. Pradiniai naujų redakcijų seed duomenys naudoja 2026-10-21.
14. Diegimo vieta: ši versija pritaikyta vienam VPS su patvariu SQLite ir uploads disku. Vercel reikia PostgreSQL ir objektinės saugyklos adaptacijos.

## Rekomendacijos
- Kreditorių sąlygas reguliariai tikrinti oficialiuose šaltiniuose; įvesti redakcinį tvirtinimą ir patikros terminą.
- Kredito linijoms ir akcijoms sukurti atskirus kainodaros modelius, patikrintus pagal kreditoriaus grafikus.
- Pridėti administratoriaus MFA / passkey ir paskyros atkūrimo procesą; nustatyti reverse proxy limitus.
- Automatizuoti patvaraus disko kopijas ir reguliariai tikrinti atkūrimą.
- Prieš pakeičiant svetainę išsaugoti WordPress DB, uploads ir serverio konfigūracijos kopiją; atlikti migracijos bei 301 patikrą bandomajame domene.
- Rinkti tikrus vertinimus pagal skaidrią metodiką; nepradėti nuo išgalvotų reitingų ar pasitikėjimo ženklų.
- Analitiką jungti tik pasirinkus tiekėją, atnaujinus politiką ir susiejus skriptų įkėlimą su sutikimu.
