# Acer Atlas v5.8 — Seedling journal and OneDrive preparation

## Seedlings
- Open Mijn collectie and choose Mijn seedlings.
- Add a seedling with working name, origin, first date, description and optional spring/summer/autumn photos.
- Add dated observations over time, with season, notes and optional photo.
- Data is stored locally in this browser. Photos are resized to reduce storage use.
- Use Instellingen → Back-up maken regularly. Backups include collection, wishlist and seedling records/photos. Keep the backup file in OneDrive to preserve it and manually import it on another device.

## OneDrive automatic sync status
Automatic OneDrive synchronization is NOT enabled in this version. It requires a Microsoft Entra app registration, a client ID, allowed redirect URI(s), delegated Microsoft Graph permission (preferably Files.ReadWrite.AppFolder), and secure OAuth/MSAL implementation. Do not paste client secrets into index.html. The current safe interim method is export the backup JSON and store it in OneDrive; this is manual backup/restore, not live multi-device sync.

## Upload
Upload the contents of `acer-atlas-main` to the GitHub Pages repository. This package has not been deployed to the live site.
