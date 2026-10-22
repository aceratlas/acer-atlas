# Acer Atlas v6.20 — geïsoleerde OneDrive-verbindingstest

Deze testversie is gebaseerd op de aangeleverde GitHub-download van v6.17. De bestaande Acer Atlas-code en lokale opslag sleutels zijn niet aangepast; er is alleen een apart testpaneel toegevoegd.

## Wat de test doet
- Microsoft-aanmelding met de eerder opgegeven appregistratie.
- Vraagt de gedelegeerde machtigingen `User.Read` en `Files.ReadWrite.AppFolder`.
- Controleert via Microsoft Graph of de persoonlijke OneDrive-appmap bereikbaar is.
- Maakt, leest of wijzigt geen bestanden in de appmap en raakt de lokale Acer Atlas-collectie niet aan.

## Testen
1. Bewaar v6.17 als herstelversie.
2. Test bij voorkeur in een aparte GitHub-branch of kopie van de repository; overschrijf de werkende site nog niet.
3. De geregistreerde redirect-URI is momenteel `https://aceratlas.github.io/acer-atlas/`, dus de test moet op die oorsprong draaien.
4. Klik in de app op **Verbind met OneDrive** en controleer de statusmelding.
5. Deze test bevestigt alleen authenticatie en toegang tot de appmap; synchronisatie van de collectie is nog niet geïmplementeerd.

Geen browsergegevens wissen.


Persoonlijke-accounttest: kies in het Microsoft-aanmeldvenster expliciet het persoonlijke Microsoft-account (niet het zakelijke werk- of schoolaccount). Deze versie controleert alleen toegang tot de OneDrive-appmap; de collectie wordt niet gesynchroniseerd of gewijzigd.
