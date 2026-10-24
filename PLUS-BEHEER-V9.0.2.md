# Acer Atlas v9.0.2 — Plus-interesse beheren en e-mailmelding

## Wat is toegevoegd
- Na klikken op **Ik heb interesse in Plus** wordt `plusInterest: true` opgeslagen op het gebruikersprofiel, samen met `plusInterestAt`.
- Er wordt geprobeerd een e-mailmelding klaar te zetten in de Firestore-collectie `mail` voor `aceratlas.maple@outlook.com`.
- Het account van `aceratlas.maple@outlook.com` krijgt in de accountpagina een beheerdersoverzicht met geïnteresseerde gebruikers en datum.
- De Firestore-regels beperken het lezen van alle gebruikersprofielen tot dat beheerdersadres. Gewone gebruikers kunnen alleen hun eigen profiel lezen.

## Vereiste stappen voor publicatie
De ZIP alleen activeert de beveiligingsregels of e-maildienst niet. Doe dit in Firebase voordat je de nieuwe website publiceert:

1. Open https://console.firebase.google.com/project/acer-atlas/firestore/rules
2. Vergelijk de bestaande regels met `firestore.rules` in deze ZIP en publiceer ze. Let op: deze regels gaan ervan uit dat `aceratlas.maple@outlook.com` het beheeraccount is.
3. Controleer in Firebase Authentication dat dit e-mailadres bestaat en is geverifieerd.
4. Voor daadwerkelijke e-mails: installeer de officiële Firebase Extension **Trigger Email** via Firebase Extensions en configureer een werkende SMTP-server/afzender. Laat de extensie documenten in de collectie `mail` verwerken.
5. Publiceer daarna de bestanden uit deze ZIP op GitHub Pages.

## Test
- Log in met het geverifieerde beheeraccount `aceratlas.maple@outlook.com`; open Account. Het beheerdersoverzicht verschijnt automatisch.
- Test met een tweede account: open Acer Atlas Plus en klik op **Ik heb interesse in Plus**.
- Controleer in het beheerdersoverzicht of de gebruiker verschijnt.
- Controleer de mailcollectie en de status van Trigger Email om te bevestigen dat de e-mail daadwerkelijk is afgeleverd.

## Belangrijk
De websitecode kan het verzoek aan Firestore toevoegen, maar kan geen e-mail afleveren zonder een geconfigureerde e-mailprovider/Trigger Email-extensie. De beheerdersfunctie is beperkt met zowel een controle in de interface als Firestore Security Rules. Publiceer de regels voordat je de beheerdersfunctie gebruikt.
