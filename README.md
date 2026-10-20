# Acer Atlas v3.0 — collectie, favorieten en PDF-export

Deze versie bouwt voort op de aangeleverde v2.7-bestanden. De 58 cultivarrecords en bestaande lokale collectieopslag zijn behouden.

## Nieuw in v3.0
- In de catalogus staat de afbeelding links naast de cultivarnaam, in een vergelijkbare indeling als Mijn collectie. De afbeelding opent het cultivarprofiel.
- Per boom in Mijn collectie kan een favoriet worden ingesteld en weer uitgezet.
- Filter om alleen favoriete bomen te tonen.
- PDF/afdrukexport van de volledige collectie.
- PDF/afdrukexport van alleen favorieten.
- De export bevat precies de kolommen Naam, Soort, Aankoop en Leeftijd. Kies in het afdrukvenster 'Opslaan als PDF'.
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
4. Open de app en controleer de versie, favorieten en beide PDF-knoppen.

## Volgende fase
De backendkeuze moet worden gemaakt voordat we accounts en codes veilig kunnen implementeren. Daarna kunnen we accountregistratie, persoonlijke collectie-synchronisatie, foto-inzendingen met goedkeuring, beheerdersrechten en instelbare toegangscodes bouwen.


## v3.0
- Herstelde collectie-rendering door ontbrekende status- en favorietenfuncties toe te voegen.
- PDF-exportknoppen verplaatst naar aparte tab Uitvoer.
- PDF-export gebruikt uitsluitend Naam, Soort, Aankoop en Leeftijd.


## v3.0 — herstel collectie-koppelingen
- Veiliger migreren van eerder opgeslagen collectiegegevens uit bekende oudere opslagvormen.
- Bestaande collectie-items kunnen opnieuw aan cultivars gekoppeld worden op database-ID, cultivar-naam, geaccepteerde naam of synoniem.
- Bronopslag wordt niet verwijderd tijdens herstel.


## v3.1 — collectie zichtbaar en aantallen
- Collectiesortering beperkt tot naam en soort; favorietenfilter blijft beschikbaar.
- Aantal exemplaren per collectie-item instelbaar (standaard 1).
- PDF-overzicht toont totaal aantal exemplaren en aantal unieke cultivars boven de tabel.
- Collectie-weergave bevat een defensieve foutmelding als renderen mislukt; opgeslagen gegevens worden niet verwijderd.


## v3.2
- Encyclopedia filters now include only dynamic group and species filters; evidence-status filter removed.
- Group and species choices are generated from the loaded cultivar database.
- Collection cultivar suggestions are limited to cultivars already present in the user collection, not the full database.
