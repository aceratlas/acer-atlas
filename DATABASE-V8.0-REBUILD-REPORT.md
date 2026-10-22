# Acer Atlas v8.0 — database rebuild report

## Result
- Baseline: user-provided `acer-atlas-main (6).zip` (v7.5).
- Original records: 1030
- Clean records after merging same normalized accepted botanical names: 1015
- Merged spelling/duplicate groups: 15
- Photos referenced in database: 9
- Validation errors: 0

## What changed
- Kept the v7.5 app layout and existing features as the baseline.
- Created a cleaned `cultivar-database.json` with a consistent record count.
- Merged only records whose accepted botanical names normalize to the same value; cultivar names that match but belong to different Acer species remain separate.
- Kept alternate spellings as synonyms and merged source links and Esveld inventory codes where records were merged.
- Added visible status text in the encyclopedia showing whether the database loaded, how many records were read, and how many cards are displayed.
- Added a visible error message if the database cannot be fetched or parsed.
- Bumped the service-worker cache key and database query version to reduce stale-cache problems.

## Important limitation
This is a structural cleanup and migration of existing data, not a claim that every cultivar profile has been independently fact-checked. Existing source claims and horticultural details still need a staged review.

## Validation
- JSON parses successfully.
- Record count matches the number of records.
- IDs are present and unique.
- Names are present.
- Sources and synonyms use list fields.

## Merged groups
- **Beni-maiko** (Acer palmatum 'Beni-maiko'): Beni-maiko, Beni maiko; kept ID `cultivar-benimaiko`.
- **Beni-tsukasa** (Acer palmatum 'Beni-tsukasa'): Beni-tsukasa, Beni tsukasa; kept ID `cultivar-benitsukasa`.
- **Chitose-yama** (Acer palmatum 'Chitose-yama'): Chitose-yama, Chitose yama; kept ID `cultivar-chitoseyama`.
- **Inaba-shidare** (Acer palmatum 'Inaba-shidare'): Inaba-shidare, Inaba shidare; kept ID `cultivar-inabashidare`.
- **Kiyohime** (Acer palmatum 'Kiyohime'): Kiyohime, Kiyo hime; kept ID `cultivar-kiyohime`.
- **Sango-kaku** (Acer palmatum 'Sango-kaku'): Sango-kaku, Sango kaku; kept ID `cultivar-sangokaku`.
- **Shishi-gashira** (Acer palmatum 'Shishi-gashira'): Shishi-gashira, Shishi gashira; kept ID `cultivar-shishigashira`.
- **Sumi-nagashi** (Acer palmatum 'Sumi-nagashi'): Sumi-nagashi, Sumi nagashi; kept ID `cultivar-suminagashi`.
- **Ukigumo** (Acer palmatum 'Ukigumo'): Ukigumo, Uki gumo; kept ID `cultivar-ukigumo`.
- **Koto-no-ito** (Acer palmatum 'Koto-no-ito'): Koto-no-ito, Koto no ito; kept ID `cultivar-kotonoito`.
- **Higasayama** (Acer palmatum 'Higasayama'): Higasayama, Higasa yama; kept ID `cultivar-higasayama`.
- **Tamukeyama** (Acer palmatum 'Tamukeyama'): Tamukeyama, Tamuke yama; kept ID `cultivar-tamukeyama`.
- **Summer Gold** (Acer palmatum 'Summer Gold'): Summer Gold, Summergold; kept ID `cultivar-acer-palmatum-summer-gold`.
- **Hana chiru sato** (Acer buergerianum 'Hana chiru sato'): Hana chiru sato, Hanachiru sato; kept ID `cultivar-hana-chiru-sato`.
- **Hi no tsukasa** (Acer palmatum 'Hi no tsukasa'): Hi no tsukasa, Hino tsukasa; kept ID `esveld-acer-palmatum-hi-no-tsukasa`.


## Cache hardening added in v8.1
- New service-worker cache name: `acer-atlas-v81-cache-safe`.
- The app asks the browser to update the service worker on launch with `updateViaCache: 'none'`.
- The service worker uses network-first for the HTML and cultivar database, with cache fallback only when offline.
- Database fetch URL changed to `?build=810`.
- Old Acer Atlas service-worker caches are deleted when the new worker activates.
