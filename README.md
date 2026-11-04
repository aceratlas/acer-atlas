# Acer Atlas v10.5.10 — cache-updatecorrectie

Deze release lost het terugkerende probleem op waarbij telefoons een oude appversie bleven tonen.

- Appversie: v10.5.10.
- Nieuwe, unieke serviceworker-cache: `acer-atlas-pwa-v10.5.10`.
- De serviceworker haalt de appbestanden bij installatie opnieuw op met `cache: reload`.
- De nieuwe serviceworker activeert direct (`skipWaiting`) en neemt de pagina over (`clients.claim`).
- Oude Acer Atlas-cacheversies worden bij activatie verwijderd.
- `index.html` en `cultivar-database.json` worden bij gebruik opnieuw van de server opgehaald met `no-store`.
- Offline terugval is alleen mogelijk op bestanden uit de huidige releasecache; oude releasecaches worden niet gebruikt.

## Installatie
Vervang in de GitHub-hoofdmap alle vier bestanden uit deze ZIP:
`index.html`, `sw.js`, `README.md` en `cultivar-database.json`.

Upload alle bestanden in één keer. De database blijft versie 8.2.36.
