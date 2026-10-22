# Acer Atlas v6.13 — lokale opslag of OneDrive

## Opslagkeuze
Instellingen bevat nu een keuze tussen lokaal opslaan en OneDrive-synchronisatie. Lokale opslag blijft standaard actief. De app houdt een lokale kopie bij; OneDrive synchroniseert een JSON-bestand met collectie, wensen, seedlings, taal en kleurstijl naar de persoonlijke OneDrive App Folder. De app-map wordt via Microsoft Graph `Files.ReadWrite.AppFolder` benaderd.

## Eenmalige Microsoft-configuratie vereist
Automatische OneDrive-synchronisatie werkt pas nadat een Microsoft Entra ID-appregistratie is aangemaakt en de Application (client) ID in Instellingen is ingevuld. Configureer de app als Single-page application (SPA) en voeg de exacte huidige GitHub Pages-app-URL (origin + pathname) toe als redirect URI. Gebruik delegated permissions `User.Read` en `Files.ReadWrite.AppFolder`. Gebruik geen client secret in de webapp.

Bij de eerste verbinding uploadt Acer Atlas de lokale gegevens als er nog geen cloudbestand bestaat. Als er al een cloudbestand bestaat, vraagt de app of je OneDrive-gegevens wilt laden of lokale gegevens naar OneDrive wilt uploaden. De lokale gegevens worden niet gewist bij loskoppelen. De OneDrive-kopie wordt bij loskoppelen niet verwijderd.

## Publiceren
Upload de inhoud van de ZIP naar de hoofdmap van de bestaande GitHub Pages-repository. Test eerst met een back-up.
