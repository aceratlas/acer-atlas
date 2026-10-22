# Acer Atlas v7.4 — Esveld inventory import report

## Source
User-provided PDF: `esveld lijst.pdf` (38 pages).
Source attribution: Plantentuin Esveld inventory/catalog list. Official catalog URL recorded in entries: https://www.esveld.nl/catal/gedruktecat.pdf

## Import counts
- Parsed inventory lines (name + location/catalog code): 1469
- Unique Acer names after Unicode/whitespace/case normalization: 1018
- Names matched to an existing record: 94
- New name-only records added: 924
- Existing records before import: 223
- Total records after import: 1147

## Data integrity notes
- Repeated entries for the same normalized Acer name were collapsed.
- Inventory codes (such as `c05`, `a12`, `wes`) are preserved in `esveld_inventory_codes`.
- Matching existing records were annotated with the inventory codes and a source entry.
- New records include the exact listed botanical/cultivar name and a source URL.
- The inventory PDF itself does not provide cultivar traits, photos, historical origins, or reliable selectors for each entry. These fields are intentionally marked unknown; `review_needed=true`.
- No nursery photographs were copied.
- This is a name-inventory import, not yet a fully enriched horticultural encyclopedia.

## Next enrichment pass
Use cultivar-specific Esveld pages and other reliable sources to fill traits and licensed photos. Do not infer cultivar properties from names alone.
