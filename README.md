# Acer Atlas v10.5.8

## Encyclopedie – volledige lijst
- Versienummer verhoogd naar v10.5.8 zodat de update herkenbaar is.
- De beperking van 60 zichtbare cultivars per laadronde is verwijderd: de volledige gefilterde en gesorteerde lijst wordt getoond.
- Zoekfunctie en soortfilter blijven werken op de volledige ingeladen database.
- Databasebestand en persoonlijke collectiegegevens worden niet gewijzigd.
- Serviceworker-cache vernieuwd.

## Installatie
Vervang in de GitHub-hoofdmap `index.html`, `sw.js` en `README.md`. Laat `cultivar-database.json` ongewijzigd staan.

## Controle
ZIP-integriteit en JavaScript-syntaxis zijn gecontroleerd. De live weergave kan pas na publicatie in de browser worden bevestigd.


Encyclopedia search correction: one-character searches (such as “a”) match cultivar names, not generic botanical metadata. Longer searches cover cultivar names, synonyms, and cultivar-specific descriptive fields. The complete v8.2.36 database (1,016 records) is included in this package.
