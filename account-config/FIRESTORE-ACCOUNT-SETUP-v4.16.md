# Acer Atlas v4.16 — Firestore-accountprofiel instellen

Deze versie gebruikt Firebase Authentication voor aanmelden/inloggen en Firestore uitsluitend voor het accountprofiel (`users/{uid}`: plan, e-mailadres en tijdstempels). De collectie, foto's, notities en wensenlijst blijven lokaal en worden niet naar Firebase geüpload.

## Eenmalige handeling in Firebase
1. Open Firebase Console → project `acer-atlas` → Firestore Database → Rules.
2. Vervang de huidige regels door de inhoud van `firestore.rules` in deze map.
3. Klik **Publish**.
4. Test met een account: log in en open Account. Het profiel hoort `Gratis` te tonen.

## Belangrijk
- Nieuwe profielen worden standaard met `plan: free` aangemaakt.
- De regels blokkeren dat een client zichzelf naar Plus kan promoveren. Plus moet later via een vertrouwde server/admin-flow worden toegekend; betalingen zijn nog niet geïmplementeerd.
- De bestaande 10-exemplaren-controle is client-side, omdat de collectie lokaal blijft. Dit is bruikbaar als productregel in de app, maar geen fraudebestendige serverlimiet.
- Geen betaalde Firebase-upgrade vereist voor deze stap.
