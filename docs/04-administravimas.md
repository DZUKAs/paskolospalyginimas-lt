# 4 etapas — administravimas

`/admin`: Auth.js kredencialų autentifikavimas, 8 val. pasirašyta / užšifruota JWT sesija, HttpOnly slapukas, Secure naudojant HTTPS, CSRF apsauga. Kiekvienam apsaugotam serverio veiksmui iš DB iš naujo tikrinama paskyra ir rolė. `sessionVersion` padidinimas atšaukia ankstesnes sesijas. Paskyros kuriamos CLI; viešos registracijos nėra. Slaptažodžiai išvedami scrypt su individualiu atsitiktiniu salt.

Ne daugiau kaip 5 bandymai vienai paskyrai per 15 min. ir 150 bendrų bandymų per 15 min., būseną laikant DB. Limito klaida neišduoda, ar paskyra egzistuoja. VPS papildomai rekomenduojamas reverse proxy / WAF limitas pagal patikimą kliento IP, ypač prieš kenkėjišką paskyrų blokavimą.

Administratorius kuria ir redaguoja kreditorius bei naujienas. Redaktorius gali tvarkyti tik naujienas. Rolės pakeitimas atliekamas administruojant DB / CLI, ne vieša forma. TipTap redaktorius ir serverinis HTML išvalymas. Naujienoms: juodraštis / paskelbta / suplanuota, publikavimo data UTC, autorius, kategorija, kreditorius, SEO ir OG laukai. Esami slug nekeičiami, kad nebūtų sugadintos nuorodos.

Paveikslėliai: prisijungimo ir Origin tikrinimas, JPG/PNG/WebP iki 5 MB, iki 24 mln. pikselių. Sharp tikrina realų formatą, pašalina metaduomenis ir perkuria WebP su atsitiktiniu UUID vardu. SVG nepriimamas. Produkcijoje reverse proxy privalo riboti viso kūno dydį iki 6 MB. `data/uploads` ir SQLite failas turi būti patvariame diske ir atsarginėse kopijose. Naudotojo įvedami failų keliai ir išorinės nuorodos validuojami serveryje.

Kainodaros patvirtinimui būtini visi skaičiai, patvirtinimo data, pavyzdys ir modelio tinkamumas. Kad nepatvirtinta sąlyga nebūtų palaikyta faktu, savybėms naudojamos trys būsenos. Pakeitimai fiksuojami audito žurnale.
