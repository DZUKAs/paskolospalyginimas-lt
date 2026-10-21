import { PrismaClient } from '@prisma/client';
import { resolveDatabaseUrl } from '../scripts/database-url.mjs';
process.env.DATABASE_URL = resolveDatabaseUrl();
const db = new PrismaClient();
const captured = new Date('2026-10-21T17:08:00Z');
const creditors = [
  {
    slug: 'credit24',
    applyUrl: 'https://doafftracking.tech/credit24.lt/DZUKAs/56402',
    name: 'Credit24',
    tagline: 'Kredito linija ir vartojimo paskolos',
    amountMin: 100,
    amountMax: 5000,
    termMax: 36,
    annualRate: 23.88,
    apr: 27.09,
    monthlyFee: 0,
    originationPercent: 0,
    summary:
      'Senoje apžvalgoje pristatomos vartojimo paskolos ir kredito linija. Kredito linijos lėšos naudojamos pagal poreikį. Prieš pasirinkdami pasitikrinkite galiojančią kainodarą ir akcijų sąlygas.',
    pros: [
      'Šaltinyje nurodyta galimybė grąžinti anksčiau termino.',
      'Apžvelgiama ir refinansavimo galimybė.',
    ],
    cons: [
      'Šaltinyje prieštarauja įmokų atidėjimo terminai.',
      'Kredito linijai netaikytinas paprastos anuitetinės paskolos modelis.',
    ],
    notes:
      'PATIKRINTI: 3 ir 6 mėnesių įmokų pertrauka, 3 mėnesių ir 50 dienų akcijos, dabartinės sumos, terminai ir kainodara.',
    speed: 'Šaltinyje minima 15 min.; PATIKRINTI darbo laiką ir sąlygas.',
    requirements:
      'Šaltinyje: nuo 18 metų, stabilios pajamos, asmens dokumentas ir sąskaita Lietuvoje. PATIKRINTI aktualius reikalavimus.',
    documents: 'Asmens dokumentas, pajamų ir įsipareigojimų informacija; PATIKRINTI sąrašą.',
  },
  {
    slug: 'savy',
    name: 'Savy',
    tagline: 'Apžvalgos duomenys tikslinami',
    summary:
      'Senoje Savy apžvalgoje likęs demonstracinis FINVIEW šablonas anglų kalba. Jo skaičiai ir vertinimai neperimti kaip tikri duomenys.',
    pros: ['PATIKRINTI kreditoriaus oficialiame šaltinyje.'],
    cons: ['Senoje apžvalgoje nėra patikimų palyginimo duomenų.'],
    notes:
      'PATIKRINTI visus finansinius laukus, reikalavimus, dokumentus, išmokėjimo laiką ir reprezentatyvų pavyzdį.',
    requirements: 'PATIKRINTI',
    documents: 'PATIKRINTI',
  },
  {
    slug: 'vivus',
    name: 'Vivus',
    tagline: 'Vartojimo paskolos internetu',
    amountMin: 300,
    amountMax: 15000,
    termMax: 84,
    annualRate: 9,
    summary:
      'Lietuviškoje senos apžvalgos dalyje aprašomos vartojimo paskolos ir individualiai nustatomos palūkanos. Likusiame puslapyje yra demonstracinių tekstų, todėl jų neperkeliame.',
    pros: ['Šaltinyje nurodytas ilgesnis grąžinimo laikotarpis.'],
    cons: [
      'Neaiški administravimo mokesčio bazė ir periodiškumas.',
      'Nėra patvirtinto reprezentatyvaus pavyzdžio.',
    ],
    notes:
      'PATIKRINTI: nuo 9 % palūkanų, 0,3–1 % administravimo mokesčio bazę, BVKKMN ir mažiausią terminą.',
    requirements: 'PATIKRINTI',
    documents: 'PATIKRINTI',
  },
  {
    slug: 'finbee',
    name: 'Finbee',
    tagline: 'Tarpusavio skolinimosi platforma',
    annualRate: 7,
    summary:
      'Senoje apžvalgoje Finbee pristatoma kaip tarpusavio skolinimosi platforma, jungianti paskolų gavėjus ir investuotojus. Galutinės sąlygos priklauso nuo individualaus vertinimo.',
    pros: ['Apžvalgoje pristatomos paskolos be užstato.', 'Minima refinansavimo galimybė.'],
    cons: [
      'Nenurodytas pilnas kainodaros modelis.',
      'Dalis senos apžvalgos yra demonstracinis šablonas.',
    ],
    notes:
      'PATIKRINTI 7 % palūkanas, 1–6 % sutarties mokestį, sumas, terminus, BVKKMN ir tinkamumo kriterijus.',
    requirements:
      'Šaltinyje: nuo 18 metų, sąskaita Lietuvos banke ir asmens dokumentas. PATIKRINTI.',
    documents: 'Asmens dokumentas ir kreditingumui įvertinti reikalingi duomenys; PATIKRINTI.',
  },
  {
    slug: 'bobutes-paskola',
    name: 'Bobutės paskola',
    tagline: 'Vartojimo paskolos ir refinansavimas',
    amountMin: 50,
    amountMax: 15000,
    termMin: 12,
    termMax: 72,
    annualRate: 27.6,
    apr: 62.35,
    monthlyFee: 3.3,
    summary:
      'Senoje apžvalgoje pristatomos vartojimo paskolos ir refinansavimas. Puslapyje pateikti sumų ir minimalių terminų duomenys nesutampa, todėl juos būtina patikrinti.',
    pros: [
      'Šaltinyje minima galimybė skolintis nedidelę sumą.',
      'Aprašytas ankstesnis grąžinimas ir refinansavimas.',
    ],
    cons: ['Prieštaringi sumų ir terminų duomenys.', 'Šaltinyje nurodyti papildomi mokesčiai.'],
    notes:
      'PATIKRINTI: 10 000 ar 15 000 € maksimali vartojimo paskola; nuo 3 ar 12 mėn.; 3,3 €/mėn. mokesčio tipas; BVKKMN ir realus pavyzdys.',
    speed: 'Šaltinyje minima 5 min.; PATIKRINTI taikymo sąlygas.',
    requirements:
      'Šaltinyje: 18–65 metų, pajamos bent 4 mėnesius, nėra pradelstų skolų. PATIKRINTI.',
    documents:
      'Šaltinyje: pasas arba asmens tapatybės kortelė; PATIKRINTI tapatybės ir pajamų patvirtinimo tvarką.',
  },
  {
    slug: 'smspinigai',
    applyUrl: 'https://doafftracking.tech/smspinigai.lt/DZUKAs/48111',
    name: 'SMS pinigai',
    tagline: 'Paskolos ir kredito linija',
    amountMin: 100,
    amountMax: 15000,
    termMin: 3,
    termMax: 72,
    annualRate: 21.99,
    apr: 59.95,
    monthlyFee: 7.5,
    summary:
      'Senoje apžvalgoje pristatomos vartojimo paskolos, kredito linija ir refinansavimas. Nurodytos akcijos ir kainos gali būti pasenusios, o tame pačiame puslapyje pateikiamos skirtingos palūkanos.',
    pros: ['Šaltinyje aprašomos kelios finansavimo rūšys.', 'Minimos galimybės keisti įmokų datą.'],
    cons: [
      'Šaltinyje nurodytas mėnesinis administravimo mokestis.',
      'Nesutampa pateiktos palūkanos; akcija nepatvirtinta.',
    ],
    notes:
      'PATIKRINTI: 21,99 % ar nuo 3,67 % palūkanos, BVKKMN iki 59,95 %, 7,50 € mokestis, pirmos paskolos akcija ir atidėjimo sąlygos.',
    speed: 'Šaltinyje minima 15 min.; PATIKRINTI išmokėjimo laiką.',
    requirements: 'Šaltinyje: nuo 19 metų, registruotas vartotojas. PATIKRINTI.',
    documents: 'PATIKRINTI tapatybės ir pajamų patvirtinimui reikalingus dokumentus.',
  },
];
async function populate(db) {
  for (const c of creditors) {
    const { pros, cons, notes, ...fields } = c;
    await db.creditor.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        ...fields,
        sourceUrl: `https://paskolospalyginimas.lt/loans/${c.slug}-apzvalga/`,
        sourceCapturedAt: captured,
        reviewHtml: `<h2>Ką svarbu žinoti?</h2><p>${c.summary}</p><p>Prieš pateikdami paraišką palyginkite kreditoriaus standartinę informaciją apie vartojimo kreditą, bendrą grąžintiną sumą ir įmokų grafiką.</p>`,
        suitableFor:
          'Norintiems palyginti finansavimo sąlygas ir prieš priimant sprendimą įvertinti visą kredito kainą.',
        pros: JSON.stringify(pros),
        cons: JSON.stringify(cons),
        faq: JSON.stringify([
          {
            q: 'Ar apžvalgos sąlygos jau patvirtintos?',
            a: 'Ne. Tai iš senos svetainės perimta informacija. Laukai PATIKRINTI ir šaltinio data padeda atskirti nepatvirtintus duomenis.',
          },
          {
            q: 'Kaip pateikti paraišką?',
            a: 'Patikrinę aktualias sąlygas kreditoriaus svetainėje, pasirinkite sumą ir terminą, pateikite prašomus duomenis ir perskaitykite sutartį. Sprendimą priima kreditorius.',
          },
        ]),
        verificationNotes: notes,
      },
    });
  }
  const articles = [
    [
      'paskolos-palyginimas-kodel-tai-butina-pries-imant-bet-kokia-paskola-internetu',
      'Paskolos palyginimas: ką įvertinti prieš pasirašant sutartį',
      'Palyginimo gidas',
      'Lyginkite ne tik mėnesio įmoką: svarbios visos paskolos išlaidos ir sutarties sąlygos.',
      '<h2>Pradėkite nuo visos kainos</h2><p>Senoje svetainėje paskolų palyginimas išskiriamas kaip svarbus žingsnis prieš skolinantis. Lyginkite vienodą sumą ir terminą: taip lengviau pastebėsite skirtumus.</p><h2>Patikrinkite daugiau nei palūkanas</h2><p>Peržiūrėkite BVKKMN, bendrą grąžintiną sumą, sutarties bei administravimo mokesčius. Mažesnė mėnesio įmoka gali reikšti ilgesnį ir brangesnį įsipareigojimą.</p><h2>Neskubėkite</h2><p>Perskaitykite išankstinio grąžinimo ir vėlavimo sąlygas. Jei įmokai tektų skolintis dar kartą, iš naujo įvertinkite savo biudžetą.</p>',
    ],
    [
      'greita-paskola-kaip-pasirinkti-geriausia-varianta-internetu',
      'Greita paskola internetu: greitis neturėtų lemti sprendimo',
      'Atsakingas skolinimasis',
      'Paraiškos pateikimas visą parą dar nereiškia pinigų išmokėjimo bet kuriuo metu.',
      '<h2>Atskirkite paraišką nuo išmokėjimo</h2><p>Senoje publikacijoje aptariamas paskolos gavimo internetu patogumas. Tačiau išmokėjimo laikas priklauso nuo kreditingumo vertinimo, kreditoriaus ir banko darbo.</p><h2>Palyginkite sąlygas</h2><p>Prašykite bendros grąžintinos sumos, BVKKMN ir visų mokesčių išklotinės. Akcijų sąlygas tikrinkite jų oficialiame šaltinyje.</p><h2>Įvertinkite alternatyvas</h2><p>Prieš skolindamiesi apsvarstykite galimybę atidėti pirkinį ar susitarti dėl mokėjimo dalimis. Nesiskolinkite vien dėl greito atsakymo pažado.</p>',
    ],
    [
      'paskolos-palyginimas-kaip-rasti-pigiausia-ir-patogiausia-paskola-internetu',
      'Kaip palyginti paskolas pagal vienodą sumą ir terminą',
      'Palyginimo gidas',
      'Nuoseklus palyginimas prasideda nuo vienodų įvesties duomenų ir visų mokesčių.',
      '<h2>Vienoda suma ir laikotarpis</h2><p>Palyginimo rezultatas prasmingas, kai kreditoriams nurodote vienodą paskolos sumą ir grąžinimo terminą. Tai pagrindinis senos publikacijos patarimas.</p><h2>Ilgesnio termino poveikis</h2><p>Ilgesnis terminas gali sumažinti mėnesio įmoką, bet padidinti bendras išlaidas. Palyginkite abu rodiklius.</p><h2>Perskaitykite sutartį</h2><p>Užsirašykite pradinius, mėnesinius ir kitus privalomus mokesčius. Pasiūlymą vertinkite tik gavę individualias sąlygas.</p>',
    ],
    [
      'paskolos-internetu-kaip-pasirinkti-tinkama-varianta-ir-sutaupyti',
      'Paskolos internetu: kaip įvertinti pasiūlymą',
      'Palyginimo gidas',
      'Prieš priimant sprendimą svarbu suprasti kainą ir savo finansines galimybes.',
      '<h2>Susidarykite biudžetą</h2><p>Senoje publikacijoje aptariama, kaip palyginimas padeda pasirinkti finansavimo sąlygas. Pradėkite nuo būtinųjų išlaidų ir jau turimų įsipareigojimų.</p><h2>Visos išlaidos vienoje vietoje</h2><p>Paprašykite kreditoriaus pateikti įmokų grafiką ir bendrą grąžintiną sumą. Netapatinkite nominalių palūkanų su BVKKMN.</p>',
    ],
    [
      'busto-paskolos-dirbantiems-uzsienyje-kaip-gauti-finansavima-lietuvoje',
      'Būsto paskola dirbant užsienyje: nuo ko pradėti',
      'Būsto paskolos',
      'Pajamų dokumentų ir individualių kreditoriaus reikalavimų sąrašą verta pasiruošti iš anksto.',
      '<h2>Individualus vertinimas</h2><p>Senoje svetainėje nagrinėjamas finansavimas Lietuvoje gaunant pajamas užsienyje. Kiekvieno kreditoriaus reikalavimai skiriasi, todėl universalaus patvirtinimo pažadėti negalima.</p><h2>Dokumentai ir valiuta</h2><p>Iš anksto pasiteiraukite, kokių pajamų įrodymų, vertimų ir darbo santykių dokumentų reikės. Įvertinkite valiutos kurso riziką, jei pajamos ir įmokos skirtingomis valiutomis.</p>',
    ],
    [
      'greita-paskola-internetu-greitas-kreditas-greita-paskola',
      'Greitas kreditas: ką pasitikrinti prieš paraišką',
      'Atsakingas skolinimasis',
      'Patikrinkite kreditoriaus tapatybę, kainodarą ir įmokos vietą savo biudžete.',
      '<h2>Patikrinkite teikėją</h2><p>Senoje publikacijoje apžvelgiama greito kredito tema. Prieš perduodami asmens duomenis įsitikinkite, kad kreipiatės į oficialų paslaugos teikėją.</p><h2>Nesiremkite vien reklama</h2><p>Reklamuojama mažiausia palūkanų norma nebūtinai bus taikoma jums. Individualiame pasiūlyme tikrinkite BVKKMN, bendrą sumą ir visus mokesčius.</p><h2>Skolinkitės atsakingai</h2><p>Įvertinkite, ar grąžinsite paskolą ir sumažėjus pajamoms. Svetainės informacija nėra finansinė konsultacija.</p>',
    ],
  ];
  for (const [slug, title, category, excerpt, bodyHtml] of articles)
    await db.article.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title,
        category,
        excerpt,
        bodyHtml,
        status: 'PUBLISHED',
        publishedAt: captured,
        author: 'Paskolų palyginimo redakcija',
        image: '/images/gidas.webp',
        imageAlt: 'Abstrakti geometrinė iliustracija: finansinių sprendimų pusiausvyra',
        sourceUrl: `https://paskolospalyginimas.lt/${slug}/`,
        legacyPath: `/${slug}/`,
        seoTitle: title,
        seoDescription: excerpt,
      },
    });
}
async function main() {
  if (process.argv.includes('--once')) {
    await db.$transaction(
      async (tx) => {
        const key = 'initial-site-content-v1';
        if (await tx.seedState.findUnique({ where: { key } })) return;
        await populate(tx);
        await tx.seedState.create({ data: { key } });
      },
      { maxWait: 30000, timeout: 30000 },
    );
  } else {
    await populate(db);
  }
}
main().finally(() => db.$disconnect());
