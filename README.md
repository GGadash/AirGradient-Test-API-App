# AirGradient Test API App

**v2.3.0-rc.1 — release candidate for testing.** A local browser app for exploring
AirGradient air-quality API data. Made by Akila DJ using OpenAI.

**Main local app: requires an installed Python runtime and an active internet connection to get data.**
Python 3.9+ is the compatibility minimum; install a currently supported stable
Python 3 release (such as 3.14) for a new setup. A modern web browser is also required.

**License: [MIT No Attribution (MIT-0)](LICENSE).** Use, change, share, and sell the
original code and documentation freely. Attribution is not required, but is welcome.
There is no requirement to publish your changes or use the same license. Provided
as is, without warranty. Third-party materials and services keep their own terms.

[Start here](START_HERE.md) ·
[Download this release candidate](https://github.com/GGadash/AirGradient-Test-API-App/releases/tag/v2.3.0-rc.1) ·
[All releases](https://github.com/GGadash/AirGradient-Test-API-App/releases) ·
[Project wiki](https://github.com/GGadash/AirGradient-Test-API-App/wiki) ·
[Release notes](RELEASE_NOTES.md) · [Development and publishing](CONTRIBUTING.md)

## Supplementary web preview

**The Python + localhost app remains the main product.** For convenient viewing
without installing Python, open the [supplementary GitHub Pages preview](https://ggadash.github.io/AirGradient-Test-API-App/).
Use the main app for the fuller experience and better results when testing the API:
on-demand upstream requests, configurable devices, correction selection, and
permission-based hourly access. It does not improve underlying sensor accuracy.

| Main local app (recommended) | Supplementary website |
| --- | --- |
| Install Python, run `serve.py`, open the printed local URL | Open the website; visitors need only internet and a browser |
| Requests data on demand, subject to API cadence/cache | Displays snapshots collected on a nominal 15-minute GitHub schedule |
| Device controls, corrected/raw selection, illustrative AQI, authorized hourly history | Five fixed devices, raw PM2.5, returned fields, world map, and published JSON |
| Tokens stay in your local server's memory | No token entry or private/authenticated data |

The page labels itself as supplementary and links back to the main download.
**Reload published data** only reloads the latest published snapshot; it does not
trigger AirGradient collection. GitHub scheduling/deployment delays add latency.
Measurement time and per-device collection time are displayed separately in UTC.
Failures may retain earlier readings with explicit errors and original timestamps;
missing readings remain unavailable. The browser checks for published updates every
five minutes while visible. Readings older than 20 minutes and collection gaps over
45 minutes are flagged. These are demo thresholds, not a service guarantee.

GitHub may disable scheduled collection after 60 days without repository activity.
If updates stop, check the [Pages workflow](https://github.com/GGadash/AirGradient-Test-API-App/actions/workflows/pages.yml)
or use the main local app. [Full supplementary guide](web/README.md).

## What it does

View five default AirGradient device locations on a map, inspect measurements and
raw API responses, adjust refresh and display settings, and compare returned
parameters. Public latest data needs no API key. Optional hourly history needs
an AirGradient token with permission for the selected locations.

**Testing and demo only:** this independent app tests AirGradient API connections.
Software, labels, calculations and source readings may contain mistakes. Check
original records before relying on results. It is not an official AirGradient
product or a production hosting server. AQI values are illustrative estimates. Device
availability and returned parameters can change.

## Install Python first

Download Python from the official site, then reopen your terminal after installation.
Installing Git is optional for users downloading the release ZIP.

| System | Installation and help | Check after installation |
| --- | --- | --- |
| Windows | [Python downloads for Windows](https://www.python.org/downloads/windows/) and [official Windows setup guide](https://docs.python.org/3/using/windows.html). Follow the Python install manager or installer instructions. If a traditional installer offers an **Add Python to PATH** option, enable it. | `py --version` or `python --version` |
| macOS | [Python downloads for macOS](https://www.python.org/downloads/macos/) and [official macOS guide](https://docs.python.org/3/using/mac.html). Run the downloaded installer. | `python3 --version` |
| Linux | Install Python 3 using your distribution's software manager. See the [official Unix guide](https://docs.python.org/3/using/unix.html). | `python3 --version` |

[All Python downloads](https://www.python.org/downloads/). If `py` says it cannot
find a default Python, the launcher is present but a usable runtime still needs
to be installed/configured. Follow the Windows guide above, reopen the terminal,
and check the version again. No pip packages, npm install, or build tools are
needed to run this app.

## Internet connection

Keep an **active internet connection** while using the app. The local Python
server fetches readings from `api.airgradient.com`; Leaflet loads from `unpkg.com`,
and street-map tiles load from OpenStreetMap. The built-in world outline avoids
street-tile downloads, but it does not make the app or live data work offline.

If access is blocked, ask your network administrator about these services or use
a network that permits them. The app reports retrieval errors; it does not invent
replacement measurements. No incoming internet connection is needed: the launcher
listens only on your computer's loopback address.

## Download and run

1. Install Python using the instructions above and connect to the internet.
2. Open the [release candidate page](https://github.com/GGadash/AirGradient-Test-API-App/releases/tag/v2.3.0-rc.1).
3. Under **Assets**, download `AirGradient-Test-API-App-v2.3.0-rc.1.zip`. Extract the entire ZIP to a normal folder.
4. Open a terminal in the extracted folder containing `serve.py` and `AirGradient-Test-API-App.html`.
5. Run the command for your system:

   ```powershell
   # Windows
   py serve.py
   ```

   ```sh
   # macOS or Linux
   python3 serve.py
   ```

6. Open the exact `http://127.0.0.1:PORT/` URL printed in the terminal. The usual port is `8765`, but it can change if occupied.
7. Keep the terminal open while using the app. Press **Ctrl+C** to stop the server.

On Windows, you can open the extracted folder in File Explorer, click its address
bar, type `cmd`, and press Enter to open a terminal there. If `py` is unavailable
but Python is installed, try `python serve.py`. On macOS/Linux, use
`cd "/path/to/AirGradient-Test-API-App-v2.3.0-rc.1"` before running the command.

Do not double-click the HTML or run files inside the ZIP viewer. Use `serve.py`,
which supplies the API proxy. GitHub stores the source and downloads; this app's
Python backend does not run on GitHub Pages.

## The five default slots

| Slot | Location | Location ID | Country | API model |
| --- | --- | --- | --- | --- |
| 1 | ESYair Pro | 196780 | Switzerland | O-M-1PPSTON-CE |
| 2 | Sir Apollo Kagwa Road | 172350 | Uganda | O-M-1PPSTON-CE |
| 3 | BANTHI, LAMPHUN | 189546 | Thailand | O-M-1PPST-CE |
| 4 | Sri Jayawardenepura Kotte | 189917 | Sri Lanka | O-1PST |
| 5 | Siththimaavaa Hingun | 76611 | Maldives | O-1PS |

ESYair Pro is the new first device; the original four keep their relative order.
The first two are gas-equipped Max models. The third is a Max without dedicated
NO2/O3 sensors; Settings > Max without O3/NO2 — slot 3 replaces that device.
The final two are standard Open Air models. Identity is checked against the API
model code, not a physical inspection. Live API names and coordinates take precedence
and contributor names identify operators, not necessarily manufacturers.

Both gas-equipped defaults now return `no2` and `o3` through their individual
public current endpoints. Availability and values can change. ESYair Pro's API
contributor is EnviroScopY SA; Sir Apollo Kagwa Road's is AirQo. Courtesy to these
contributors and every owner who makes measurements public.

All five defaults are configured in both editions. Zero remains zero; negative gas
values remain visible and flagged; no devices or values are swapped to force
positive readings. The local app fetches current API data; the supplementary page
uses clearly labelled scheduled snapshots.

## Original package selection check — 12 September 2026, about 17:27 UTC

172350: Sir Apollo Kagwa Road — PM2.5 82.3 ug/m3
  Measurement timestamp: 2026-09-12T17:20:34.000Z
189546: BANTHI, LAMPHUN — PM2.5 34.8 ug/m3
  Measurement timestamp: 2026-09-12T17:23:37.000Z
189917: Sri Jayawardenepura Kotte — PM2.5 17.5 ug/m3
  Measurement timestamp: 2026-09-12T17:26:52.000Z
76611: Siththimaavaa Hingun — PM2.5 4.5 ug/m3
  Measurement timestamp: 2026-09-12T17:27:20.000Z
These values were supplied in the original package and were not reverified for
this naming release. They document that earlier selection check only. The app fetches fresh data;
values and availability may change. No positive readings are hard-coded.

## Viewing all parameters

- Map markers prioritize PM2.5 concentration and the PM2.5 AQI estimate.
- Hold Ctrl and scroll over the map to zoom. Command also works on Mac. Normal
  scrolling moves the page; touch pinch and the + / - controls remain available.
- Page order: map, five AQ cards, selected AQ data, comparison/API details,
  Timing & interpretation, Documentation & examples.
- Each device card and location table list returned measurement fields.
- Select a card or a location name for the full parameter/metadata table and
  original JSON. Nulls are shown as unavailable. Unknown fields retain their
  original names, values and unknown units; new fields are not discarded.
- Use Map parameter to display any returned numeric measurement on the map.
- Available fields can include PM1, PM2.5, PM10, particle count, CO2, temperature,
  humidity, NO2/O3 concentrations (ppb), TVOC, VOC / NOx index or firmware values,
  heat index, signal strength, corrections, electrode signals (mV), analog front-end
  temperature (unit unspecified) and Max battery/solar values. Actual availability varies.
- O3 / NO2 model capability is separate from API availability. Electrode signals
  cannot be interpreted as calibrated gas concentrations without the vendor's
  applicable calibration. NOx index is not NO2 concentration.
- The API details table includes Location ID, model, coordinates, contributor,
  firmware, serial number, timestamps, JSON links and active settings. Public
  current requests need no key. Optional private tokens are always hidden.

### Gas parameters and units

| API fields | Display / meaning |
| --- | --- |
| `no2`, `o3` | API-reported NO2 and O3 concentrations, **ppb**; cards, detail tiles, parameter tables and main-app map selector |
| `no2WorkingElectrode`, `no2AuxiliaryElectrode`, `o3WorkingElectrode`, `o3AuxiliaryElectrode` | Raw electrode signals, **mV**, when returned; not gas concentrations |
| `afeTemp` | Analog front-end temperature; unit unspecified in the API schema, so no unit is invented |
| `noxIndex`, `tvocIndex` | Sensor/firmware index fields; **not** NO2/O3 concentrations |

The two concentration fields are supplied by AirGradient; this app does not derive
them from raw signals. Negative values are not physically valid concentrations and
are flagged without altering the API record. Positive or zero values do not prove
accuracy or calibration. Missing and null values remain unavailable. Public world
current responses may omit raw electrodes; authenticated current responses can
expose them. This app's optional authenticated mode fetches hourly buckets, whose
fields depend on upstream availability. No fixed total number of fields is assumed:
parameter lists and counts follow each returned record, including unknown fields.

## Refresh, hourly data and AQI

Settings offer manual refresh or every 3, 5 or 9 minutes, and selectable timezone.
Max firmware documents samples every 3 minutes and cellular batches every
9 minutes; Wi-Fi normally sends each sample. Actual station connection mode is
not confirmed. This schedule does not establish standard Open Air cadence.
Frequent polling does not create newer samples. Latest-only polling may miss
older samples in a batch. Watch measurement age rather than refresh time.
Readings older than 20 minutes, and hourly buckets older than 2 hours, are marked
stale for this demonstration. Failed requests may retain prior data with errors.

1-hour mode uses /locations/{id}/measures/buckets/60 and an authorized AirGradient
API token. Up to seven days of hourly data may be returned. Your token needs
permission for each location; it does not unlock arbitrary public-device history.
The newest returned bucket may be incomplete. No hourly data is fabricated.
The token stays in the local server's memory until cleared or the server stops.
It is never written into the HTML, browser storage, displayed table or ZIP.
Hourly authenticated access could not be live-tested without a suitable token.

AQI is an illustrative US EPA PM2.5 breakpoint calculation on the selected latest
reading or hourly bucket. It is not daily AQI, EPA NowCast, a multi-pollutant AQI,
or AQI-SL. PM2.5 is truncated to 0.1 before interpolation; values above 500 are
extrapolated. Corrected-only mode never silently substitutes raw PM2.5.
Compare vendor data using matching timestamps, averaging and correction settings.

## Adding devices and upgrading

Settings can add recognized AirGradient Max / standard Open Air devices by ID
or browse their public records. The demo supports up to 41 configured slots.
Unknown model codes are rejected rather than assumed to be AirGradient hardware.
To support an additional documented model, update MODELS in the HTML and the
matching model list in serve.py after checking its official model documentation.
This version migrates saved v2.1/v2.2 settings on the same browser origin: ESYair
Pro becomes slot 1, existing slots shift by one, and custom devices and display
preferences are retained. It does not duplicate ESYair if already configured.
Saved settings at a different localhost port remain separate browser storage.
Restore five default slots resets the device list. Preferences are browser-local.
To upgrade, stop the old server, extract this package into a new folder and run
its serve.py. Reload the printed URL. Do not mix old and new package files.

## Map and connection troubleshooting

- Do not double-click the HTML. Do not use py -m http.server: run serve.py,
  which includes the API proxy needed for browser cross-origin restrictions.
- If the street map says access blocked, choose Built-in world outline above
  the map. It uses embedded Natural Earth land outlines, with no map tile calls.
  Street tiles use an explicit referrer policy; request errors trigger fallback.
  The outline is a small-scale map, without streets or every tiny island.
- Leaflet still loads from unpkg.com; internet is also needed for live API data.
  If Leaflet is blocked, the page reports this and data tables remain usable.
- If data fail, check internet access, location availability and the error shown
  for that device. Rate limits require waiting before retrying.
- No admin rights or incoming network access are needed. The Python server binds
  only to this computer. It is a local demo, not a production hosting server.

## Public JSON links (no key)

https://api.airgradient.com/public/api/v1/world/locations/196780/measures/current
https://api.airgradient.com/public/api/v1/world/locations/172350/measures/current
https://api.airgradient.com/public/api/v1/world/locations/189546/measures/current
https://api.airgradient.com/public/api/v1/world/locations/189917/measures/current
https://api.airgradient.com/public/api/v1/world/locations/76611/measures/current
Example: open one of these links in your browser to inspect its current JSON.
All five locations have public JSON links; availability can change.

## Documentation and comparison

Vendor global map: https://www.airgradient.com/map/
API docs: https://api.airgradient.com/public/docs/api/v1/
API specification: https://api.airgradient.com/public/docs/api/v1/swagger.json
Max firmware, gas model and timing:
https://github.com/Open-Air-Foundation/firmware-openair-max
Token and Location ID instructions:
https://www.airgradient.com/documentation/kb/where-do-i-access-the-api-documentation-api-token-and-local-api

## Package contents

AirGradient-Test-API-App.html — UI, styles, JavaScript and embedded world outline.
serve.py — standard-library Python launcher and fixed AirGradient API proxy.
README.md — the full setup and operation guide.
START_HERE.md — short setup guide at the top level.
SUPPORT.md — optional project support and help links.
.github/FUNDING.yml — GitHub sponsorship links.
LICENSE — MIT-0 license text.
THIRD_PARTY_NOTICES.md — external data, library, and map terms.
RELEASE_NOTES.md — release candidate information.
CONTRIBUTING.md — development and publishing steps.
CHANGELOG.md — release history.
scripts/build_release.py — builds and verifies a portable source ZIP.
.github/workflows/check.yml — automated source and packaging checks.
web/ — supplementary website source and its guide.
scripts/build_pages.py — public-data collection and Pages build.
.github/workflows/pages.yml — scheduled supplementary website publication.
tests/ — checks for data handling, gas values, preferences and freshness labels.
wiki/ — local copies of the published GitHub wiki pages.
Credits: Akila DJ using OpenAI; AirGradient data; Leaflet; OpenStreetMap;
Natural Earth public-domain land data. Independent demonstrational project.

## Optional port setting

The launcher uses port `8765`, or an available local port if it is occupied.
To request a different port in PowerShell:

```powershell
$env:AIRGRADIENT_TEST_API_PORT = "9000"
py serve.py
```

On macOS/Linux:

```sh
AIRGRADIENT_TEST_API_PORT=9000 python3 serve.py
```

Always use the actual URL printed by the launcher.

## Build a portable release

Run `py scripts/build_release.py` on Windows or `python3 scripts/build_release.py`
on macOS/Linux. The builder writes the ZIP and its SHA-256 checksum to `dist/`,
then verifies every archived file. The ZIP includes source, documentation, and
`SHA256SUMS.txt`; it excludes Git history, credentials, caches, and local output.
The runtime still requires Python and internet on the destination computer.

To verify the downloaded ZIP in PowerShell, run
`Get-FileHash .\AirGradient-Test-API-App-v2.3.0-rc.1.zip -Algorithm SHA256` and compare
it with the accompanying `.sha256` file. On Linux, use
`sha256sum -c AirGradient-Test-API-App-v2.3.0-rc.1.zip.sha256`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for Git and GitHub release steps.

## Support development

Support is optional and appreciated. The project remains free to use under MIT-0.

- Project support: [https://ko-fi.com/s/3f1e7ff9a0](https://ko-fi.com/s/3f1e7ff9a0)
- Creator profile: [https://ko-fi.com/gadash](https://ko-fi.com/gadash)

You can also use this repository's **Sponsor** section. [Support details](SUPPORT.md).

## Licensing and attribution

**MIT No Attribution (MIT-0)** applies to this project's original source code and
documentation. You may use, copy, change, distribute, sublicense, or sell them,
including commercially. You do not have to credit the author, publish your changes,
or apply the same license to your changes. Optional credit to **Akila DJ** is welcome.
The software is provided as is, without warranty.

Read the full [LICENSE](LICENSE) and the [official MIT-0 text](https://opensource.org/license/mit-0).
Published AirGradient public measurements use **CC BY-SA 4.0**, with provider and
contributor attribution retained; their data share-alike terms remain separate
from MIT-0 for this project's original code. This permission does not replace
the terms for AirGradient services/data, Leaflet,
OpenStreetMap, or other third-party materials. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
Existing credits identify sources; they are not an extra attribution requirement
for this project's original code.
