// Editorial data supplied by the site owner; not a universal pricing model.
export const providerUpdates = [
  {
    slug: 'bobutes-paskola',
    name: 'Bobutės paskola',
    tagline: 'Vartojimo paskola',
    summary:
      'BnP Finance, UAB (302447985). Vartojimo paskolos nuo 50 iki 10 000 €. Minimali trukmė skirtinguose puslapiuose nesutampa.',
    amountMin: 50,
    amountMax: 10000,
    termMin: null,
    termMax: 84,
    sourceUrl: 'https://www.bobutespaskola.lt/',
    apr: 62.35,
    annualRate: 27.6,
    example:
      '300 € / 12 mėn. · 12 įmokų po 32,19 € · MPN 27,6 % · sutarties mokestis 3,30 €/mėn. · BVKKMN 62,35 % · bendra grąžintina suma 386,28 €.',
    firstTerms:
      'Nurodomos 10 % palūkanų nuolaidos 50–500 € sumoms ir 20 % nuolaidos 600–5 000 € sumoms. Akcijos galiojimą ir kodą tikrinkite pas teikėją. Tai nėra nemokama paskola.',
    speed: 'Bendrovė nurodo kelias minutes; faktinis laikas priklauso nuo patvirtinimo ir banko.',
    verificationNotes:
      'DUK nurodo 3–84 mėn., skaičiuoklė – 12–84 mėn. Minimalią trukmę tikrinkite skaičiuoklėje. Skelbiamas BVKKMN intervalas 22,68–136,27 % nėra vienodas tarifas visiems.',
    pros: ['Galimos nedidelės paskolos nuo 50 €.'],
    cons: [
      'Skirtingai nurodyta minimali trukmė.',
      'Pavyzdyje taikomas mėnesinis sutarties mokestis.',
    ],
  },
  {
    slug: 'credit24',
    name: 'Credit24',
    tagline: 'Kredito linija',
    summary:
      'IPF Digital Lietuva, UAB (300622891). Kredito linija nuo 100 iki 7 000 €. Palūkanos skaičiuojamos už panaudotą kreditą, nepanaudotas limitas pristatomas kaip nekainuojantis.',
    amountMin: 100,
    amountMax: 7000,
    termMin: 3,
    termMax: 36,
    sourceUrl: 'https://credit24.lt/kredito-linija',
    apr: 27.09,
    annualRate: 23.88,
    example:
      'Panaudotas limitas 500 € · šaltinyje nurodomas 3–36 mėn. grąžinimas · fiksuota MPN 23,88 % · minimali mėnesio įmoka 19,69 € · BVKKMN maks. 27,09 % · bendra mokama suma 708,70 €. Tikslų šios bendros sumos grafiką tikrinkite pas teikėją.',
    firstTerms:
      'Naujiems klientams gali būti individualių pasiūlymų. Nemokama pirmoji paskola nepatvirtinta.',
    speed:
      'Reklamuojama 15 min., negarantuojama. Darbo laikas: I–V 08–20, VI 08–17, VII 08–15; priklauso nuo patvirtinimo ir mokėjimų.',
    verificationNotes:
      'Lyginama kredito linija iki 7 000 €, ne atskira vartojimo paskola. Kai kuriuose puslapiuose likusi 5 000 € riba. Konkretų limitą ir terminą patvirtina individualus pasiūlymas. Kredito linijai netaikome anuiteto formulės.',
    pros: ['Galima naudoti dalį limito.'],
    cons: [
      'Pavyzdyje nurodyta minimali, ne universali mėnesio įmoka.',
      'Puslapiuose skiriasi limito informacija.',
    ],
  },
  {
    slug: 'finbee',
    name: 'Finbee',
    tagline: 'P2P vartojimo paskola',
    summary:
      'UAB „Finansų bitė“. Tarpusavio skolinimo platforma: finansavimas siejamas su investuotojų lėšomis. 300–25 000 €, 12–120 mėn.',
    amountMin: 300,
    amountMax: 25000,
    termMin: 12,
    termMax: 120,
    sourceUrl: 'https://www.finbee.lt/vartojimo-paskola/',
    apr: 17.76,
    annualRate: 10,
    example:
      'Sutarties suma 1 000 € / 60 mėn. · į sąskaitą pervedama 940 € · MPN 10 % · sutarties mokestis 4 % (40 €), kreditingumo vertinimas 20 € · administravimas 0,37 % nuo likučio per mėn. · įmoka 23,09 € · BVKKMN 17,76 % · iš viso grąžinama 1 385,23 €.',
    firstTerms: 'Specialus nemokamos pirmos paskolos pasiūlymas nepatvirtintas.',
    speed: 'Vienodas išmokėjimo laikas nenurodytas. Priklauso nuo mokumo vertinimo ir finansavimo.',
    verificationNotes:
      'Skelbiamos palūkanos nuo 7 %, maksimalus BVKKMN 63,97 %. Pavyzdžio 10 % norma nėra universalus tarifas. Išskaičiuojami mokesčiai sumažina klientui pervedamą sumą.',
    pros: ['Terminas iki 120 mėn.'],
    cons: [
      'Išmokama suma mažesnė už sutarties sumą.',
      'Taikomi sutarties, vertinimo ir administravimo mokesčiai.',
    ],
  },
  {
    slug: 'savy',
    name: 'SAVY',
    tagline: 'P2P / vartojimo paskola',
    summary:
      'UAB „Bendras finansavimas“. Tarpusavio skolinimo platforma, taip pat nurodanti teisę teikti paskolas tiesiogiai. 300–35 000 €, 3–120 mėn.',
    amountMin: 300,
    amountMax: 35000,
    termMin: 3,
    termMax: 120,
    sourceUrl: 'https://gosavy.com/vartojimo-paskola/',
    apr: 9.64,
    annualRate: 6,
    example:
      '5 000 € / 60 mėn. · fiksuota MPN 6 % · vienkartinis tarpininkavimo mokestis 1,40 % · mėnesinis tarpininkavimas 0,22 % nuo negrąžintos sumos · įmoka 102,92 € · BVKKMN 9,64 % · bendra grąžintina suma 6 245,22 €.',
    firstTerms:
      '0 % pirmos paskolos pasiūlymas nepatvirtintas. Galimus nuolaidų kodus ir galiojimą tikrinkite pas teikėją.',
    speed:
      'Atsakymas dėl galimybės skolintis paprastai per 1 val.; tai nėra pinigų įskaitymo terminas.',
    verificationNotes:
      'Palūkanos nuo 6 %. Tarpininkavimo mokesčiai priklauso nuo reitingo ir sumos; įkainiai: https://gosavy.com/paslaugu-ikainiai/. Bendra suma apima daugiau nei mėnesio įmokų sandaugą.',
    pros: ['Suma iki 35 000 €, terminas iki 120 mėn.'],
    cons: ['Taikomas vienkartinis ir mėnesinis tarpininkavimo mokestis.'],
  },
  {
    slug: 'smspinigai',
    name: 'SMS Pinigai',
    tagline: 'Vartojimo paskola',
    summary:
      'UAB „Nordecum“. Vartojimo paskola nuo 100 iki 20 000 €, 3–96 mėn. Kitų produktų – kredito linijos, refinansavimo ir paskolos su įkeitimu – ribos čia netaikomos.',
    amountMin: 100,
    amountMax: 20000,
    termMin: 3,
    termMax: 96,
    sourceUrl: 'https://smspinigai.lt/vartojimo-paskola',
    apr: 22,
    annualRate: 4.32,
    example:
      '3 000 € / 36 mėn. · fiksuota MPN 4,32 % · administravimas 23,25 €/mėn. · sutarties mokestis 0 € · įmoka 112,34 € · BVKKMN 22 % · bendra mokama suma 4 044,04 €.',
    firstTerms:
      'Reklamuojamas pirmas kreditas iki 1 000 € ir iki 12 mėn. be palūkanų. Akcijos galiojimas, mokesčiai ir išimtys nepatvirtinti; tai nėra patvirtinimas, kad visa paskola nemokama.',
    speed: 'Sprendimas paprastai per kelias minutes. Konkretus lėšų pervedimo laikas nenurodytas.',
    verificationNotes:
      'Reklamuojama norma nuo 8,9 % ir pavyzdžio 4,32 % yra skirtingi pasiūlymai. Maža nominali norma neapima mėnesinio administravimo mokesčio.',
    pros: ['Suma iki 20 000 €.'],
    cons: [
      'Pavyzdyje reikšmingas mėnesinis administravimo mokestis.',
      'Akcijos bendra kaina ir išimtys tikslinamos.',
    ],
  },
  {
    slug: 'vivus',
    name: 'Vivus',
    tagline: 'Vartojimo paskola',
    summary:
      'UAB „Credit Service“ (302431575). Vartojimo paskola iki 15 000 €, 3–84 mėn. Minimali suma pateiktoje informacijoje nepatvirtinta.',
    amountMin: null,
    amountMax: 15000,
    termMin: 3,
    termMax: 84,
    sourceUrl: 'https://www.vivus.lt/',
    apr: 32.4,
    annualRate: 27.37,
    example:
      '1 500 € / 36 mėn. · MPN 27,37 % · administravimo ir sutarties mokesčiai 0 % · įmoka 62,35 € · BVKKMN 32,4 % · bendra mokama suma 2 244,54 €.',
    firstTerms: 'Nemokamos pirmos paskolos pasiūlymas nepatvirtintas.',
    speed:
      'Po patvirtinimo bendrovė nurodo įprastai 10–15 min.; tai nėra garantija ir priklauso nuo mokėjimų vykdymo.',
    verificationNotes:
      'Minimalią sumą tikrinkite tiesioginėje skaičiuoklėje. Naudojamas vienas pagrindinio puslapio pavyzdys; kitų produktų puslapių pavyzdžiai gali skirtis.',
    pros: ['Pateiktame pavyzdyje nėra sutarties ir administravimo mokesčių.'],
    cons: ['Minimali suma nepatvirtinta.', 'Galutinė kaina priklauso nuo individualaus pasiūlymo.'],
  },
];

export async function updateProviders(db) {
  await db.$transaction(
    async (tx) => {
      const key = 'provider-conditions-2026-10-22-v1';
      if (await tx.seedState.findUnique({ where: { key } })) return;
      for (const { slug, pros, cons, ...values } of providerUpdates) {
        await tx.creditor.updateMany({
          where: { slug },
          data: {
            ...values,
            applyUrl: values.sourceUrl,
            sourceCapturedAt: new Date('2026-10-22T00:00:00Z'),
            verifiedAt: null,
            pricingVerified: false,
            monthlyFee: null,
            originationPercent: null,
            firstFree: null,
            fast: null,
            payout247: null,
            rating: null,
            ratingBasis: null,
            pros: JSON.stringify(pros),
            cons: JSON.stringify(cons),
            requirements:
              'Mokumo ir tinkamumo reikalavimus pateikia kreditorius individualaus vertinimo metu.',
            documents:
              'Tikslų dokumentų sąrašą pateikia teikėjas; turimame sąlygų sąraše jis nepatvirtintas.',
            reviewHtml: `<h2>Produktas ir kaina</h2><p>${values.summary}</p><p>${values.verificationNotes}</p><h2>Pirmoji paskola</h2><p>${values.firstTerms}</p><h2>Išmokėjimas</h2><p>${values.speed}</p>`,
            faq: JSON.stringify([
              {
                q: 'Ar tai mano individualus pasiūlymas?',
                a: 'Ne. Pateiktas teikėjo pavyzdys iš 2026-10-22 sąlygų suvestinės. Galutinę kainą ir mokėjimų grafiką pateikia kreditorius.',
              },
              {
                q: 'Ar pavyzdys perskaičiuojamas pagal filtrus?',
                a: 'Ne. Sumos ir termino filtrai atrenka galimus produktus. Pavyzdys išlieka su savo nurodyta suma ir terminu.',
              },
            ]),
          },
        });
      }
      await tx.seedState.create({ data: { key } });
    },
    { maxWait: 30000, timeout: 30000 },
  );
}
