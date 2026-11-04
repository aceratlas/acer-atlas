# Acer Atlas v10.5.6 — schone GitHub Pages-release

Deze map bevat de bestanden die nodig zijn voor de statische Acer Atlas-website, plus `firestore.rules` als configuratiebestand voor Firebase.

## Publiceren op GitHub Pages
1. Bewaar eerst de huidige GitHub-versie als terugvalkopie.
2. Vervang daarna de inhoud van de publicatiemap/repository-root door de inhoud van deze ZIP.
3. Laat GitHub Pages naar dezelfde branch en map verwijzen als voorheen.
4. Open de website en voer zo nodig een harde verversing uit; de serviceworker-cache is vernieuwd naar v10.5.6.

## Inhoud
- `index.html` — app en interface
- `cultivar-database.json` — cultivar-database v8.2.36 (1.016 records)
- `sw.js` — PWA/serviceworker-cache v10.5.6
- `manifest.webmanifest`, `icon.svg`, `apple-touch-icon.png`, `acer-maple-leaf.png` — PWA- en beeldassets
- `firestore.rules` — Firebase-beveiligingsregels (configuratiebron; niet door GitHub Pages uitgevoerd)

De oude rapporten, historische release-notities, CSV-importbestanden en losse scripts die niet door de huidige HTML worden geladen, zijn niet opgenomen in deze schone publicatie-ZIP.

Persoonlijke collectie-, zaailing- en wensenlijstgegevens worden door de app lokaal in de browser opgeslagen. Deze bestanden vervangen of wissen die lokale gegevens niet.


## Correctie encyclopedieweergave (v10.5.6)
- Databasevelden met zowel de nieuwe als oudere veldnamen worden nu correct ingelezen.
- Ontbrekende naamgegevens krijgen veilige terugvalwaarden op basis van de cultivarrecord.
- Groei- en standplaatsvelden gebruiken ook de oudere veldnamen `height`, `width`, `rate`, `light` en `hardiness`.
- De database zelf is ongewijzigd gebleven; de serviceworker-cache is vernieuwd zodat de correctie wordt opgehaald.
