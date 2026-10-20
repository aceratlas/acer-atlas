# Acer Atlas v0.4

Bilingual Dutch/English PWA for a Japanese maple cultivar encyclopedia and personal collection.

## Database
- `index.html` contains the 50 cultivar starter records used by the app and suggestions.
- `cultivar-database.json` is the transparent export of those same 50 records.
- Search and add-tree suggestions match cultivar names and the included orthographic aliases.
- Unknown selectors/introducers are always `Onbekend` / `Unknown`.
- RHS AGM-listing status only confirms inclusion in that list; it does not establish cultivar history. Other records remain candidates pending cultivar-specific review.

## Publish
Upload/replace the files in the repository root, then commit the changes. GitHub Pages should deploy from `main` and `/ (root)`. The service worker cache version is bumped to v0.4.

## Important
This is a starter database, not a fully researched authoritative cultivar registry. Historical data is deliberately marked as unverified until reliable cultivar-specific sources are checked.
