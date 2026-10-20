# Acer Atlas — vervolgplan na v2.8

## Vastgelegde productkeuzes
- Openbare catalogus is gratis en toegankelijk zonder account.
- Account vereist voor persoonlijke collectie en foto-inzendingen.
- Foto-inzendingen zijn standaard privé/pending en worden pas na goedkeuring openbaar.
- Meerdere goedgekeurde foto's per cultivar.
- Beheerder kan gratis codes uitgeven, intrekken en instellen op functies en geldigheidsduur.
- Mogelijk later betaalde functies/abonnementen.

## Backend-functies die nog gebouwd moeten worden
1. Accountregistratie, login, wachtwoordherstel en rolgebaseerde autorisatie.
2. Centrale database voor profielen, collecties, favorieten, foto's en codes.
3. Beveiligde foto-opslag en limieten/validatie voor uploads.
4. Moderatie-dashboard voor goedkeuren/afwijzen en rechten op ingezonden beelden.
5. Beheerdersscherm voor codes: onbeperkt, tijdelijk, één gebruiker, functiebeperkingen, intrekken.
6. Optionele betaalprovider en toegangsregels voor premiumfuncties.
7. Privacyverklaring, voorwaarden, toestemming voor fotohergebruik en export/verwijdering van persoonsgegevens.

Deze functies zijn bewust niet als nep-front-end toegevoegd: ze moeten server-side worden beveiligd om misbruik en dataverlies te voorkomen.
