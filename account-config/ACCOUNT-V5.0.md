# Acer Atlas v5.0 — accountbeheer

Deze versie voegt accountbeheer toe:
- wachtwoord wijzigen (met opnieuw invoeren van het huidige wachtwoord);
- account verwijderen (met bevestiging en opnieuw invoeren van het huidige wachtwoord);
- status van e-mailverificatie zichtbaar;
- informatiepagina Acer Atlas Plus. Betalen/upgraden is nog niet actief.

De collectie, foto's, notities en wensenlijst blijven lokaal. Account verwijderen wist deze lokale gegevens nadrukkelijk niet. Maak vooraf een back-up.

## Firestore-regels

Het bestand `firestore.rules` is bijgewerkt zodat een ingelogde gebruiker alleen zijn eigen `users/{uid}`-profiel kan verwijderen. Als je deze wijziging nog niet in Firebase hebt gepubliceerd, open Firebase Console → Firestore Database → Rules, plaats de inhoud van `firestore.rules` en klik Publish. De bestaande regels voor het aanmaken/updaten blijven beperkt zodat de browser het plan niet naar `plus` kan wijzigen.

## Belangrijk

- Plus-betaling is niet geactiveerd en een gebruiker kan zichzelf niet upgraden.
- Accountverwijdering vereist recente herauthenticatie en werkende Firestore-regels.
- De JavaScript-syntax moet nog in een echte browser worden getest.
