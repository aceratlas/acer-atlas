# Acer Atlas v5.8 — controleverslag

## Uitgevoerde technische controles
- `index.html`: alle inline JavaScript-blokken zijn gecontroleerd met `node --check`.
- `cultivar-database.json`: JSON succesvol geparseerd.
- Database: 58 records, 58 unieke ID’s en elk record heeft ten minste één bronverwijzing.
- Service worker-cache verhoogd naar `acer-atlas-v5.8`; database cacheparameter verhoogd naar `build=358`.
- Taalkeuze uitgebreid tot Nederlands → Engels → Duits → Frans → Nederlands; keuze wordt lokaal bewaard.
- Hoofdinterface en profielkoppen/veldlabels hebben Duitse en Franse vertalingen. Bestaande Engelse cultivarhistorie wordt als fallback gebruikt wanneer geen vertaling voor de geselecteerde taal bestaat.

## Beperkingen die niet als afgerond mogen worden beschouwd
- Dit is geen volledige botanische verificatie van alle 58 cultivars. De records bevatten bestaande informatie, maar verschillende eigenschappen zijn bewust als Onbekend gemarkeerd.
- Er zijn 9 fotovermeldingen gekoppeld aan 6 cultivars. De overige cultivars hebben nog geen gecontroleerde vrije foto.
- De cultivarseizoensbeschrijvingen zijn nog niet allemaal volledig vertaald naar Duits en Frans; sommige blijven in de oorspronkelijke Nederlandse formulering.
- De code is syntactisch gecontroleerd, maar er is geen volledige interactietest in een echte browser voltooid. De poging tot headless browsercontrole is vastgelopen. Test daarom de app op een tijdelijke GitHub-branch of lokaal vóór publicatie.
- Geen gegevens uit de lokale collectie worden gewist. Wis de browseropslag niet tijdens het testen.

## Bronnen en foto’s
- Plantentuin Esveld: cultivar-specifieke productpagina’s waar aanwezig; zoekresultaten zijn als zoekhulp, niet als bevestiging, te behandelen.
- MrMaple: cultivar-informatie wordt samengevat in eigen woorden. MrMaple-productfoto’s worden niet gebruikt zonder expliciete schriftelijke toestemming.
- Baumschule Nielsen: opgenomen als aanvullende gespecialiseerde catalogus; alleen specifieke productpagina’s kunnen cultivar-specifieke beweringen onderbouwen.
- Wikimedia Commons: alleen bestaande fotovermeldingen met auteur/licentie/bronlink blijven gekoppeld. De licentievoorwaarden, inclusief eventuele ShareAlike-voorwaarden, moeten per foto worden gevolgd.
