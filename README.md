# Pörssisähkövahti × Home Assistant

Suomen pörssisähkön 15 minuutin hinnat Home Assistantiin ilman custom-komponenttia: yksi YAML-paketti, joka lukee [porssisahkovahti.fi](https://porssisahkovahti.fi/) avointa JSON-rajapintaa. Ei API-avainta, ei rekisteröitymistä.

*Finnish spot electricity prices (Nord Pool day-ahead, bidding zone FI, 15-minute resolution, VAT 25.5 % included) for Home Assistant using only the built-in `rest` and `template` integrations. English summary at the end.*

## Mitä saat

| Entiteetti | Sisältö |
|---|---|
| `sensor.porssisahko_nyt` | Tämän vartin hinta snt/kWh (ALV 25,5 %). Attribuutit: veroton hinta, tunnin ja päivän keskihinta, hintataso, seuraava halvin vartti |
| `sensor.porssisahko_tanaan` | Päivän keskihinta; attribuutti `hinnat` = kaikki 96 varttia (kaavioihin) |
| `sensor.porssisahko_huomenna` | Huomisen keskihinta klo 14:45 jälkeen; attribuutti `hinnat` |
| `sensor.porssisahko_halvin_2h` / `_4h` / `_8h` | Halvimman 2/4/8 tunnin jakson alkuaika seuraavien 48 h aikana; attribuutit `paattyy`, `keskihinta` |
| `binary_sensor.porssisahko_halvin_4h_kaynnissa` | Päällä, kun halvin 4 h jakso on meneillään (sama 2 h ja 8 h) |
| `binary_sensor.porssisahko_halpaa` | Päällä, kun hinta on alle päivän keskihinnan |

## Asennus

1. Kopioi [`packages/porssisahkovahti.yaml`](packages/porssisahkovahti.yaml) kansioon `config/packages/`.
2. Varmista, että `configuration.yaml` sisältää paketit:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```
3. Käynnistä Home Assistant uudelleen. Hinnat päivittyvät 15 minuutin välein.

## Automaatio: lataa auto tai lämmitä varaaja halvimmalla jaksolla

Tuo blueprint [`blueprints/automation/porssisahkovahti/halvin_jakso.yaml`](blueprints/automation/porssisahkovahti/halvin_jakso.yaml) (Asetukset → Automaatiot → Blueprintit → Tuo) tai lisää se kansioon `config/blueprints/automation/porssisahkovahti/`. Valitse kytkin ja jakson pituus; automaatio kytkee laitteen päälle jakson alkaessa ja pois sen päättyessä.

## Kaavio (ApexCharts)

[`lovelace/apexcharts.yaml`](lovelace/apexcharts.yaml) piirtää tämän päivän ja huomisen 96 vartin hinnat [apexcharts-card](https://github.com/RomRider/apexcharts-card)-kortilla.

## Shelly

[`shelly/porssisahkovahti.js`](shelly/porssisahkovahti.js) on Shelly Plus/Pro -laitteiden skripti, joka kytkee releen päälle halvimman 4 tunnin jakson ajaksi ilman Home Assistantia.

## Rajapinta

Dokumentaatio: <https://porssisahkovahti.fi/api>. Osoitteet: `/api/v1/nyt.json`, `/api/v1/hinnat.json?paiva=tanaan|huomenna|eilen|YYYY-MM-DD`, `/api/v1/halvimmat.json?tuntia=4`, `/api/v1/keskihinnat.json?vuosi=2026`, `/api/v1/latest-prices.json`. Data: ENTSO-E Transparency Platform. Käyttö on maksutonta lähdemaininnalla (linkki porssisahkovahti.fi); välimuistita vähintään 15 minuutiksi.

## English

Finnish day-ahead spot prices (bidding zone FI, 15-minute resolution, VAT 25.5 % included, source ENTSO-E) for Home Assistant with the built-in `rest` and `template` integrations only. Copy `packages/porssisahkovahti.yaml` into `config/packages/`, restart, and you get the current price, today's and tomorrow's 96 quarter-hour prices as attributes, the cheapest 2/4/8-hour windows for the next 48 hours and binary sensors that are on while a cheapest window is running. A blueprint switches any entity on during the cheapest window. No API key; free with attribution to porssisahkovahti.fi. API docs (Finnish): <https://porssisahkovahti.fi/api>.

## Lisenssi

MIT. Hintadata: ENTSO-E Transparency Platform.
