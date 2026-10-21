# Acer Atlas v5.1 — interesse in Plus meten

## Wat is nieuw
- De Plus-pagina legt uit wat Plus beoogt: onbeperkt bomen in de collectie.
- Prijs blijft bewust nog open; het uitgangspunt is een eenmalige betaling.
- De knop **Ik heb interesse in Plus** registreert alleen een expliciete klik van een ingelogde gebruiker.
- Er wordt niets betaald en de gebruiker wordt niet automatisch Plus.
- De registratie wordt als `plusInterest: true` op het bestaande eigen document `users/{uid}` in Firestore opgeslagen. Er wordt geen collectie-, foto- of wenslijstdata geüpload.
- De bestaande Firestore-regels worden uitgebreid zodat een gebruiker alleen de boolean `plusInterest` aan het eigen profiel kan toevoegen/wijzigen; het accountplan kan niet door de gebruiker worden veranderd.

## Firestore-regels bijwerken
Omdat de knop een nieuw profielveld gebruikt, moet je de meegeleverde volledige `firestore.rules` publiceren in Firebase Console → Firestore Database → Rules → Publish. Bewaar desgewenst eerst een kopie van de huidige regels.

## Hoe de belangstelling bekijken
Firebase Console → Firestore Database → Data → `users`. Profielen met `plusInterest: true` hebben op de knop gedrukt. Dit is een eenvoudige eerste indicatie, geen volledige verkoopanalyse: het telt alleen ingelogde gebruikers die expliciet op de knop drukken. Het is geen unieke betaalintentiecontrole en het systeem verwerkt geen betalingen.

## Veiligheid en privacy
De app schrijft alleen naar het profiel van de ingelogde gebruiker. `plan` kan niet via de browser worden gewijzigd. Interesse is opt-in en er worden geen betaalgegevens verzameld. De bestaande lokale collectie, foto's en wensenlijst blijven lokaal.
