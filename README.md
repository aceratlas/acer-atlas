# Acer Atlas v10.5.11 — encyclopedie en meertalige correcties

Deze update bevat:
- Eén consistente appversie: v10.5.11 (ook in de HTML-versiemetadata).
- De volledige gefilterde encyclopedielijst wordt in één renderactie opgebouwd. De eerdere asynchrone batches konden door tussentijdse her-renderacties worden afgebroken, waardoor de lijst onvolledig bleef.
- Sortering gebruikt de juiste taalinstelling voor Nederlands, Engels, Duits en Frans.
- Bij een nieuw collectie-item wordt de selecteur/introducteur uit de centrale database overgenomen. Als die onbekend is, wordt de melding in de gekozen taal opgeslagen.
- De persoonlijke collectie en het handmatig toevoegen van een boom blijven toegankelijk zonder account.
- Nieuwe serviceworker-cache voor v10.5.11.

De bestaande cultivar-database is niet aangepast. Databaseversie en alle bestaande records blijven behouden.

## Installatie
Vervang in de GitHub-hoofdmap uitsluitend:
- `index.html`
- `sw.js`

`cultivar-database.json` hoeft niet opnieuw te worden geüpload.
