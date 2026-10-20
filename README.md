# Acer Atlas — PWA prototype v0.2

Tweetalige mobiele webapp (Nederlands/Engels) voor een cultivar-encyclopedie en persoonlijke Japanse-esdoorncollectie.

## Wat werkt
- 50 startrecords, met duidelijke labels voor RHS AGM-lijstvermeldingen versus records die nog cultivar-specifiek moeten worden onderzocht.
- Zoeken, filteren en cultivarprofielen bekijken.
- De selecteur/introducteur wordt getoond als **Onbekend / Unknown** totdat een betrouwbare cultivar-specifieke bron een persoon bevestigt.
- Persoonlijke collectie: cultivars toevoegen en eigen bomen registreren met aankoopjaar, kweker, standplaats en notities.
- Nederlands/Engels wisselen.
- Lokale opslag op hetzelfde apparaat/browser.
- PWA-manifest, service worker en iPhone home-screen icon; offline shell na eerste succesvolle online bezoek.

## Belangrijke inhoudelijke grens
De 50 records zijn een startset, geen 50 volledig geverifieerde historische profielen. Een RHS AGM-lijstvermelding bewijst alleen dat de naam in die lijst staat. De geschiedenis, introductiejaar en selecteur moeten per cultivar met passende bronnen worden onderzocht. Kandidaten zijn expliciet gemarkeerd.

## Lokaal testen
Gebruik een lokale webserver, bijvoorbeeld `python -m http.server 8000`, en open `http://localhost:8000/acer_atlas_pwa/`. PWA-installatie en service-worker-gedrag vereisen HTTPS of localhost.

## Op een telefoon installeren
1. Publiceer de map op een HTTPS-host.
2. Android: open de URL in Chrome en kies **Install app** of **Add to Home screen**.
3. iPhone: open de URL in Safari, tik op **Deel**, kies **Zet op beginscherm**, laat **Open als webapp** ingeschakeld en tik op **Voeg toe**.

## Nog niet aanwezig
- Online accounts en synchronisatie tussen apparaten.
- Backend-database, beheerinterface, moderatie en community-bijdragen.
- Automatisch ophalen van internetbronnen.
- Volledige handmatige verificatie van alle 50 cultivarprofielen.
- App Store / Google Play publicatie.
