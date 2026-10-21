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

## Lokale back-up (voorbereiding voor versie 4.0)

Acer Atlas bevat in Instellingen de functies **Back-up downloaden** en **Back-up terugzetten**. Het back-upbestand is een JSON-bestand met de lokale collectie, de foto-data (ingesloten in het bestand), kleurthema en taal. Het bestand wordt door de browser rechtstreeks naar het apparaat van de gebruiker gedownload; Acer Atlas uploadt dit bestand niet naar een server.

De gebruiker kan het bestand zelf opslaan in OneDrive, Dropbox, Google Drive, op een USB-stick of op de eigen computer en het op een ander apparaat weer importeren. Terugzetten vervangt de huidige collectie na een bevestigingsvraag. Adviseer gebruikers eerst een back-up te maken van hun huidige collectie.

Dit is een lokale back-upfunctie, geen online account of synchronisatie. De toekomstige account-/database-laag en de eenmalige Plus-betaling moeten apart worden ontworpen en getest voordat ze worden gepubliceerd. De back-up bevat foto's als data-URL's; grote collecties kunnen daardoor grote bestanden opleveren en de beschikbare browseropslag blijft een beperking.
