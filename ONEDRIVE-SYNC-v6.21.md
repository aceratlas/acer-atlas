# Acer Atlas v6.21 — OneDrive handmatige back-up test

Gebaseerd op de v6.20-testversie die succesvol toegang kreeg tot de OneDrive-appmap. De bestaande lokale opslag wordt niet automatisch gesynchroniseerd.

## Functies
- **Bewaar collectie in OneDrive** uploadt `AcerAtlas-backup.json` met collectie, wensenlijst, Seedlings, thema en taal naar de persoonlijke appmap. Een bestaand bestand met die naam wordt vervangen na bevestiging.
- **Herstel collectie vanuit OneDrive** downloadt dat bestand, valideert de gegevens en vraagt eerst bevestiging voordat lokale gegevens worden vervangen.
- De app blijft lokaal opslaan zoals voorheen. Geen automatische synchronisatie of conflictbehandeling is geïmplementeerd.

## Veilig testen
1. Houd v6.17 als herstelversie.
2. Gebruik een aparte testbranch/repository met de geregistreerde redirect-URI, of pas eerst de redirect-URI aan als de URL anders is.
3. Test eerst upload met onbelangrijke/testgegevens.
4. Test restore alleen nadat je een lokale export/back-up hebt gemaakt.
5. Na upload, test de download/restore op een tweede browser/apparaat met testgegevens.

De code is syntax-gecontroleerd; echte Graph-upload/download moet nog in de browser worden getest.
