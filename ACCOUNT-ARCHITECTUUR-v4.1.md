# Acer Atlas v4.1 — accountfundament

Deze versie is de voorbereidende technische basis voor accounts. De bestaande appfuncties, collectie en back-upfunctie zijn behouden. Er zijn nog geen echte accounts of betalingen geactiveerd.

## Besluiten voor de accountarchitectuur

- De Acer Atlas-encyclopedie blijft openbaar en vereist geen account.
- Gratis accounts krijgen maximaal 10 exemplaren in hun persoonlijke collectie.
- Acer Atlas Plus wordt een eenmalige aankoop voor een onbeperkte collectie en persoonlijke lijsten.
- Persoonlijke collectiegegevens, lijsten en foto's blijven lokaal op het apparaat.
- Een volledige back-up bevat de collectiegegevens, lijsten en de daadwerkelijke foto's; de gebruiker slaat dit bestand zelf op, bijvoorbeeld in OneDrive, Dropbox of lokaal.
- Het accountplatform bewaart alleen accountgegevens en de Plus-toegangsstatus; geen persoonlijke foto's.
- Geen automatische upgrade naar een betaald backendabonnement. Voor overschrijding van gratis limieten moet eerst expliciet een nieuwe keuze worden gemaakt.

## Voorgestelde backend: Firebase Authentication + Firestore (Spark)

Begin met het gratis Spark-plan. De app mag niet automatisch upgraden naar een betaald plan. Database- en authenticatielimieten moeten worden gemonitord; 10.000 accounts betekent niet dat elk gebruikspatroon gratis blijft.

## Nog nodig vóór registratie echt kan werken

1. Maak een Firebase-project aan op https://console.firebase.google.com/ en kies het gratis Spark-plan.
2. Schakel Email/Password in bij Authentication.
3. Registreer een Web App in het Firebase-project.
4. Lever de Firebase webconfiguratie aan (apiKey, authDomain, projectId, appId; deze clientconfiguratie is bedoeld voor de webapp, maar servergeheimen mogen nooit in de app komen).
5. Stel Firestore Security Rules in zodat gebruikers alleen hun eigen account-/rechtenrecord kunnen lezen en wijzigen. De client mag nooit zelf een Plus-status kunnen toekennen.
6. Voor latere betalingen: valideer betalingen server-side via een vertrouwde webhook of serverfunctie; pas daarna de Plus-status aan. Niet alleen op basis van een browserwaarde.

## Datamodel (voorstel)

`users/{uid}`
- `email`
- `tier`: `free` of `plus` (alleen vertrouwde backend mag `plus` toekennen)
- `createdAt`
- `paymentStatus`: `none`, `pending`, `paid`, `refunded` (door backend beheerd)

Geen foto's of collectie-items in Firestore. De gratis limiet van 10 is een gebruikerservaring-/productregel voor de lokale collectie; Plus-rechten moeten later veilig worden gevalideerd waar dat nodig is.

## Status van deze ZIP

Deze versie legt de architectuur en de voorbereidingsstappen vast. Er is nog geen werkende registratie, wachtwoordherstel, accountdatabase of betaalverwerking in de app, omdat daarvoor een eigen Firebase-projectconfiguratie en beveiligingsregels nodig zijn. Bestaande lokale collectiegegevens worden niet gemigreerd of gewist.
