# Fantasy VN — kostra hry

Jednoduchý vizuálny novel engine: JSON scény → JS ich vykresľuje → CSS štýluje.
Žiadny build krok, žiadne závislosti. Číry HTML/CSS/JS.

## Štruktúra

```
index.html      - kostra stránky
style.css       - vzhľad
script.js       - engine (číta story.json, prepína scény)
story/story.json - TU PÍŠEŠ PRÍBEH
manifest.json   - PWA nastavenia
sw.js           - offline cache
assets/         - sem dávaj obrázky (zatiaľ prázdne, treba doplniť)
```

## Ako písať príbeh

Otvor `story/story.json`. Každá scéna má:
- `bg` - cesta k obrázku pozadia
- `lines` - pole dialógových riadkov (speaker + text), postupne sa preklikávajú
- `choices` - voľby na konci scény, každá vedie na `next` (id ďalšej scény)

Pridáš novú scénu jednoduchým pridaním nového kľúča do `scenes` a odkázaním
naň cez `"next": "nazov_scény"` z inej voľby. Netreba sa dotýkať JS vôbec,
kým chceš len rozširovať príbeh.

## Chýbajúce obrázky

Zatiaľ v `story.json` odkazuje na `assets/mesto_brana.jpg` a pod. — tie súbory
tam ešte nie sú. Priprav si obrázky (napr. AI generované) a nahraj ich do
priečinka `assets/` pod presne tými menami, alebo si zmeň cesty v JSON-e.

## Ako to dostať na GitHub + Vercel (celé z mobilu)

1. Vytvor nový repozitár na github.com (appka alebo web).
2. Nahraj tieto súbory - buď cez "Add file → Upload files" v GitHub webe/appke,
   alebo cez github.dev editor (stlač `.` v repe na webe → otvorí sa VS Code
   v prehliadači, kde vieš rovno editovať a commitovať).
3. Choď na vercel.com → New Project → Import Git Repository → vyber repo.
   Framework preset nastav na "Other" (je to statický web, netreba build).
4. Deploy. Vercel ti pri každom ďalšom pushi na GitHub automaticky
   redeployne stránku.

## Rozšírenia na neskôr (keď bude kostra fungovať)

- Flagy/premenné (napr. `"setFlag": "vie_o_zradcovi"`) pre vetvenie podľa
  predošlých rozhodnutí - dá sa pridať jednoduchým objektom v `state`.
- Tlačidlo "Späť na hlavné menu" / "Nová hra" (vymaže localStorage).
- Zvuk/hudba na pozadí (`<audio>` tag + fade podobne ako bg).
- Typewriter efekt písania textu namiesto okamžitého zobrazenia.
