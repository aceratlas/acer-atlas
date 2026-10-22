## Latest update — v8.2.13 (photo batch 21 / source audit)

- Added cultivar-specific Wikimedia Commons photo references for Acer palmatum 'Waterfall' and 'Viridis', with source page, photographer, license and credit.
- Normalized stale photo-status labels for records already containing photo references.
- Database: 1,016 cultivar records, 68 photo references, 40 records with photos; 976 records remain without a photo reference.
- Full audit scope and letter-by-letter missing-photo counts are in PHOTO-AUDIT-v8.2.13.txt. The app has not been live-browser tested.
- Database cache key updated to build=8213. GitHub has not been changed.

## Latest update — v8.2.10 (photo batch 17)

- Added a cultivar-specific Wikimedia Commons image for Acer palmatum 'Beni kawa'.
- Photographer: Drew Avery; CC BY 2.0. Commons confirms the original Flickr source and license; attribution and license link are stored in the database.
- Preserved all 1,016 cultivar records; photo references now total 54.
- B cultivar records without photos: 49 (down from 50); A cultivar records without photos: 56.
- App/database version set to 8.2.10; database cache key updated to build=8210.

## Latest update — v8.2.8 (photo batch 15)

- Added a licensed, cultivar-specific Wikimedia Commons photo for Acer palmatum 'Butterfly'.
- Photographer: David J. Stang; CC BY-SA 4.0; attribution and license link recorded in the database.
- Photo count updated from the database records; record count unchanged.
- B records without photos: 55 (down from 56); A records without photos: 58.
- App/database version set to 8.2.8; database cache key updated to build=828.

## Latest update — v8.2.8 (photo batch 15)

- Added a verified CC BY 3.0 photo for Acer palmatum 'Burgundy Lace'.
- A-series remains at 58 records without a verified photo after this search pass.
- B-series starts with 56 records without a verified photo.
- Total cultivar records: 1016; photo references: 51.

Acer Atlas v6.17 — herstel na fout in OneDrive-testversie

Gebaseerd op de eerder door de gebruiker bevestigde werkende v6.14. De experimentele OneDrive-wijzigingen uit v6.15/v6.16 zijn teruggedraaid. Opslagsleutels voor collectie, wensenlijst en Seedlings zijn niet gewijzigd. Service-worker cacheversie verhoogd naar v6.17. Deze herstelversie is niet live in een echte browser getest; test na publicatie of pagina’s en knoppen werken. Wis geen browsergegevens.

Acer Atlas v6.14 — herstelrelease

Deze release herstelt de app op basis van de laatst bekende werkende v6.12-codebasis. De experimentele OneDrive-opslagcode uit v6.13 is niet meegenomen. Bestaande lokale gegevens blijven op hetzelfde apparaat behouden doordat de opslag sleutels en gegevensstructuur niet zijn gewijzigd. De nieuwe service-worker-cacheversie dwingt de browser om de appbestanden opnieuw op te halen.

# Acer Atlas v4.0 — collectie, favorieten en lijstweergave en afdrukken-export

Deze versie bouwt voort op de aangeleverde v2.7-bestanden. De 58 cultivarrecords en bestaande lokale collectieopslag zijn behouden.

## Nieuw in v3.0
- In de catalogus staat de afbeelding links naast de cultivarnaam, in een vergelijkbare indeling als Mijn collectie. De afbeelding opent het cultivarprofiel.
- Per boom in Mijn collectie kan een favoriet worden ingesteld en weer uitgezet.
- Filter om alleen favoriete bomen te tonen.
- lijstweergave en afdrukken/afdrukexport van de volledige collectie.
- lijstweergave en afdrukken/afdrukexport van alleen favorieten.
- De export bevat precies de kolommen Naam, Soort, Aankoop en Leeftijd. Kies in het afdrukvenster 'Opslaan als lijstweergave en afdrukken'.
- Versienummer en service-worker-cache bijgewerkt naar v3.0.

## Belangrijk: wat nog niet in v3.0 zit
Accounts, gedeelde collecties tussen apparaten, centrale foto-opslag, moderatie van inzendingen, beheeromgeving en toegangscodes zijn nog niet actief. Die functies vereisen een beveiligde backend/database. Deze versie doet niet alsof die functies al werken en stuurt geen gegevens naar een server.

## Veiligheid en bestaande gegevens
- De bestaande localStorage-sleutel `acerAtlasCollection` is behouden.
- Er wordt geen browseropslag gewist.
- Favorieten worden als eigenschap van de bestaande boomrecords opgeslagen.
- Maak voor het overschrijven van de live site bij voorkeur eerst een reservekopie van de huidige repository en test de nieuwe versie eerst in een aparte branch of kopie.

## Uploaden naar GitHub Pages
1. Pak de ZIP uit.
2. Upload de bestanden uit de map `acer-atlas-main` naar de hoofdmap van de repository en vervang gelijknamige bestanden.
3. Commit de wijzigingen en wacht tot GitHub Pages is bijgewerkt.
4. Open de app en controleer de versie, favorieten en beide lijstweergave en afdrukken-knoppen.

## Volgende fase
De backendkeuze moet worden gemaakt voordat we accounts en codes veilig kunnen implementeren. Daarna kunnen we accountregistratie, persoonlijke collectie-synchronisatie, foto-inzendingen met goedkeuring, beheerdersrechten en instelbare toegangscodes bouwen.


## v3.0
- Herstelde collectie-rendering door ontbrekende status- en favorietenfuncties toe te voegen.
- lijstweergave en afdrukken-exportknoppen verplaatst naar aparte tab Uitvoer.
- lijstweergave en afdrukken-export gebruikt uitsluitend Naam, Soort, Aankoop en Leeftijd.


## v3.0 — herstel collectie-koppelingen
- Veiliger migreren van eerder opgeslagen collectiegegevens uit bekende oudere opslagvormen.
- Bestaande collectie-items kunnen opnieuw aan cultivars gekoppeld worden op database-ID, cultivar-naam, geaccepteerde naam of synoniem.
- Bronopslag wordt niet verwijderd tijdens herstel.


## v3.1 — collectie zichtbaar en aantallen
- Collectiesortering beperkt tot naam en soort; favorietenfilter blijft beschikbaar.
- Aantal exemplaren per collectie-item instelbaar (standaard 1).
- lijstweergave en afdrukken-overzicht toont totaal aantal exemplaren en aantal unieke cultivars boven de tabel.
- Collectie-weergave bevat een defensieve foutmelding als renderen mislukt; opgeslagen gegevens worden niet verwijderd.


## v4.0
- Encyclopedia filters now include only dynamic group and species filters; evidence-status filter removed.
- Group and species choices are generated from the loaded cultivar database.
- Collection cultivar suggestions are limited to cultivars already present in the user collection, not the full database.


## v4.0 wijzigingen
- Suggesties voor cultivars worden uitsluitend opgebouwd uit de zichtbare collectie-items; databasecultivars die niet in die lijst staan worden niet als optie aangeboden.
- Bij het cultivarprofiel staat de knop Favoriet maken boven de sectie Informatie, indien die cultivar in de collectie voorkomt.


## v4.0
- De zoekbalk is contextafhankelijk: in de Encyclopedie zoekt deze door de volledige database; in Mijn collectie toont en filtert deze uitsluitend items die daadwerkelijk in de collectie staan.
- Favorietenknop in het cultivarprofiel staat links uitgelijnd direct boven Informatie.


## v3.5 — stervormige favorieten
- De tekstknop “Favoriet maken” is vervangen door alleen een ster direct achter de cultivarnaam.
- Dezelfde ster wordt naast de naam in het cultivarprofiel getoond wanneer die cultivar in de eigen collectie staat.
- De ster behoudt de bestaande favorietenopslag en heeft een toegankelijke labeltekst voor schermlezers.
- De service-worker-cache is bijgewerkt naar v3.5.


## v3.11
- Favorietenfilter samengevoegd met de sorteerkeuze in Mijn collectie.
- lijstweergave en afdrukken-uitvoer bevat nu ook de kolom Aantal.
- lijstweergave en afdrukken gebruikt liggend A4 en bredere kolommen om koppen op één regel te houden.


## v3.11
- Corrected the visible version label to v3.11.
- Export actions now open a previewable list instead of immediately opening the print dialog. Use the explicit print button to choose a printer or save as list/print.
- Table widths are adjusted for landscape A4; cell text wraps instead of being ellipsized.


## v3.11 — favorietenknop met extra afstand
- De sterknop voor favorieten is verplaatst van naast de cultivarnaam naar een aparte rij onderaan de collectiekaart.
- Er is extra verticale ruimte en een scheidingslijn toegevoegd om onbedoeld klikken op favorieten te voorkomen.


## v3.14 — favorietenknop als actieknop
- Replaced the star-only collection favorite control with a labelled button.
- The button shows a leading ☆ “Toevoegen aan favorieten” or ★ “Verwijderen uit favorieten”.
- Right-aligned the favorite button above “Verwijderen uit collectie”, with a generous gap to reduce accidental taps.
- Kept the existing favorite storage and toggle handler.


## v3.14 — Kleurstijlen
Gebruikers kunnen in Instellingen kiezen uit Botanical Green, Japanese Maple en Modern Japanese. De keuze wordt lokaal bewaard en blijft actief na opnieuw openen.


## v3.14
- Instellingen is verwijderd uit de bovenste tabrij en staat nu als tandwielknop naast de taalkeuze in de kop. De snelkoppeling Instellingen in de onderste navigatie blijft behouden.


## v4.1 account foundation
- Firebase Authentication via email/password (registration, sign-in, password reset, sign-out).
- Personal collections, photos and lists remain local; no personal data is uploaded by this account screen.
- Firestore access remains closed until security rules are deliberately configured.
- Configure/verify the Firebase web app config in `index.html` before publishing.


## Wijzigingen v4.4
- Accountformulier heeft een eigen Account-scherm en staat niet meer onder Instellingen.
- De toelichting onder de kop Instellingen is verwijderd.
- Het accounticoon in de bovenbalk is vervangen door een profielicoon.


## v4.4 — Wenslijst en gratis limiet
- Gratis collectie begrensd op 10 exemplaren; toevoegen boven de limiet leidt naar Account.
- Wenslijst toegevoegd aan de navigatie en aan de encyclopedie.
- PDF/printoptie voor de wenslijst toegevoegd.
- Wenslijst wordt lokaal opgeslagen en opgenomen in back-up/herstel.


## v4.5 — Instellingen en knopteksten
- Back-up en herstel staat onderaan Instellingen.
- De knoppen voor informatie, collectie en wenslijst gebruiken duidelijke, gelijkvormige teksten.


## v6.0 — Seedlings en encyclopediefoto's
- Nieuwe sectie Seedlings onder Mijn collectie: eigen werknaam, soort/ouder, startdatum/kiemjaar, beschrijving en foto's voor voorjaar, zomer en herfst.
- Seedlings worden lokaal opgeslagen in `acerAtlasSeedlings`; foto's worden verkleind voor browseropslag.
- Wanneer een cultivar vanuit de encyclopedie aan de collectie wordt toegevoegd, wordt de beschikbare encyclopediefoto standaard als foto/omslagfoto meegenomen.
- Bij het toevoegen van eigen foto's vraagt de app of de encyclopediefoto's behouden moeten blijven of vervangen worden.
- Taalkeuze kan door Nederlands, Engels, Duits en Frans bladeren. De nieuwe Seedlings-functie en belangrijkste navigatie zijn vertaald; enkele bestaande diepere schermteksten kunnen nog Engels blijven.
- Back-up bevat nu ook Seedlings en accepteert de URL's van encyclopediefoto's.
- Cloud-synchronisatie is nog niet actief. De huidige gegevens blijven lokaal; synchronisatie met OneDrive/Dropbox vereist expliciete OAuth-/API-integratie en een ontwerp voor conflicten tussen apparaten.


## v8.2.5 — Foto insturen
- Cultivars zonder gecontroleerde foto tonen een optie om een e-mailconcept te openen met cultivar, botanische soort en tekst over fotografienaamsvermelding en gebruiksrechten.
- Het ontvangstadres staat voorlopig leeg en kan later worden ingesteld in `index.html` bij `PHOTO_SUBMISSION_EMAIL`. De inzending wordt niet automatisch geüpload; de gebruiker voegt de foto zelf toe aan de e-mail.


Fotobatch 18 (v8.2.10): zes extra gecontroleerde fotoverwijzingen voor cultivars in de D–F-reeks. Zie PHOTO-SOURCES-v8.2.10.txt voor de originele bestands- en licentiepagina’s.


## v8.2.11 — fotobatch 19 (22 oktober 2026)

- Twee gecontroleerde Commons-fotoverwijzingen toegevoegd: Acer palmatum 'Inaba-shidare' (Don McCulley, CC BY-SA 4.0) en Acer palmatum 'Garnet' (David J. Stang, CC BY-SA 4.0).
- Bronpagina, fotograaf en licentie vastgelegd in `PHOTO-SOURCES-v8.2.11.txt` en `cultivar-database.json`.
- Geen nieuwe cultivarrecords toegevoegd; live browser-test niet uitgevoerd.
