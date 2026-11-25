# Acer Atlas Community — ontwikkelomgeving

Deze map wordt ontwikkeld op de aparte branch `community-dev`. De productiebranch `main` en de live Acer Atlas-app blijven ongewijzigd.

## Huidige fase
- Alleen een zelfstandige, statische pagina-opzet.
- Geen koppeling met Firebase, Cloudflare, R2, accounts, collectie, wensenlijst of foto's.
- Geen productieknop of navigatie-item toegevoegd.
- Geen echte leden, foto's of gebruikersgegevens.

## Vastgelegde productkeuzes
- Fotogalerij met filters op seizoen.
- Foto's worden uitsluitend bewust vanuit de eigen collectie gedeeld.
- Meerdere foto's per cultivar zijn toegestaan.
- Iedere foto krijgt een koppeling naar de cultivar in de encyclopedie.
- De gebruiker kan de cultivar aan de eigen wensenlijst toevoegen.
- Likes zijn toegestaan; reacties/discussies niet.
- De plaatser kan informatie/beschrijving bij een foto zetten.
- Profielpagina's voor leden.
- Moderator kan communityberichten verwijderen.
- Datamodel en architectuur moeten later uitbreidbaar zijn met leden volgen en een persoonlijke tijdlijn.

## Veiligheidsregels voor verdere ontwikkeling
1. Productiecollectie, wishlist, seedlings en bestaande foto-opslag nooit gebruiken als testdata.
2. Eerst een geïsoleerde testbackend en testaccounts opzetten voordat uploads of interacties worden gebouwd.
3. Foto's blijven privé totdat een lid expliciet een specifieke foto publiceert.
4. Community-verwijderen mag nooit het originele exemplaar of de privéfoto uit de persoonlijke collectie verwijderen.
5. Pas na volledige tests en expliciete vrijgave integreren in `main` en publiceren.
