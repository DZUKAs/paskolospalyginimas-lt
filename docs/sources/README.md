# 2026-10-22 teikėjų sąlygų atnaujinimas

Šaltinis: svetainės savininko įkeltas `paskolu_teikeju_salygos_2026-10-22.txt`, išsaugotas kaip `providers-2026-10-22.txt`. Šiame pakeitime teikėjų svetainės nebuvo nepriklausomai iš naujo patikrintos. Viešai nurodoma suvestinės data ir joje pateikta oficiali produkto nuoroda; `verifiedAt` nepažymima kaip atlikta nepriklausoma patikra.

`prisma/provider-update.mjs` vienkartine transakcija atnaujina šešių esamų kreditorių įrašus, žymeklis `provider-conditions-2026-10-22-v1`. Jis vykdomas po pradinio seed tiek build, tiek runtime metu. Pakartotinis paleidimas nekeičia vėlesnių administratoriaus redagavimų. Straipsniai, paskyros ir įkelti failai neatnaujinami. Esama Credit24 sekimo nuoroda pakeista dokumente pateikta oficialia produkto nuoroda; visų šešių CTA naudoja oficialius šaltinius.

Pavyzdžiai pateikiami pažodžiui pagal suvestinės skaičius, jų įmokos nedauginamos iš termino bendroms sumoms perskaičiuoti (apvalinimai, kintantys mokesčiai ir paskutinė įmoka gali skirtis). Finbee atskiriama nominali ir išmokama suma. Credit24 paliekama pastaba apie nepakankamai apibrėžtą bendros sumos grąžinimo grafiką. Bobutės paskolos minimali trukmė ir Vivus minimali suma yra null su paaiškinimu, o ne spėjamos reikšmės.

`pricingVerified=false`: šie pavyzdžiai nesuteikia bendro kainodaros modelio bet kokiai sumai / terminui. Kainos ir balų rūšiavimas bei nepatvirtintų akcijų / greičio filtrai pašalinti iš viešo palyginimo. Sumos ir termino filtrai atrenka produktus, nekeisdami pavyzdžių skaičių.

Patikros: 13 automatinių testų, produkcinis build, izoliuotas trace failų runtime testas su nauja DB. Naršyklėje patikrinta desktop/mobile lentelė, 30 000 € / 120 mėn. filtras (SAVY), palyginimas greta ir visos šešios apžvalgos; nėra horizontalaus puslapio perpildymo telefone ar JavaScript klaidų.
