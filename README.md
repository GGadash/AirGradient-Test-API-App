# AirGradient Test API App

Version **2.1.0**. A local browser app for exploring AirGradient API data.

Made by Akila DJ using OpenAI. For demonstrational purposes.

[Source repository](https://github.com/GGadash/AirGradient-Test-API-App) ·
[Download releases](https://github.com/GGadash/AirGradient-Test-API-App/releases) ·
[Release history](CHANGELOG.md) · [Development and publishing steps](CONTRIBUTING.md)

## Quick start

1. Download `AirGradient-Test-API-App-v2.1.0.zip` from the release page and extract it. Open a terminal in the extracted folder containing `serve.py`.
2. Run: `py serve.py` (Windows) or `python3 serve.py` (Linux / Mac).
3. Open the localhost / 127.0.0.1 link printed by Python. Keep the terminal open.

Requires Python 3.9+ and internet. Do NOT open the HTML file directly.

## Detailed instructions — Windows

1. Install Python 3.9 or newer from https://www.python.org/downloads/ if needed.
   Enable the Python launcher / PATH options when offered by the installer.
2. Right-click the downloaded ZIP and select Extract All. Open its extracted
   folder containing `serve.py`. Do not run files from inside the ZIP viewer.
3. Click the File Explorer address bar, type cmd, and press Enter. This opens
   Command Prompt in that folder. Check Python with: py --version
4. Run: py serve.py
   If py is unavailable but Python is installed, try: python serve.py
5. Copy the exact http://127.0.0.1:PORT/ address printed by the launcher into
   your browser. Usually it is http://127.0.0.1:8765/; an occupied port changes it.
6. Leave the terminal open. Press Ctrl+C there when finished.

## Detailed instructions — Linux & Mac

1. Extract the ZIP using your file manager. Check Python in Terminal:
   python3 --version
   Python 3.9+ is required. Use your Linux distribution's package manager or
   https://www.python.org/downloads/macos/ if you need to install Python.
2. Open Terminal and change into the extracted folder, using your actual path:
   `cd "/path/to/AirGradient-Test-API-App-v2.1.0"`
3. Run: python3 serve.py
4. Open the exact localhost / 127.0.0.1 URL printed in Terminal in your browser.
   Leave Terminal running; stop with Ctrl+C when finished.
No pip packages, build tools, or API key are required for public latest data.

## The four default slots

Device selection checked against AirGradient's public API on 12 September 2026.
Hardware identity is based on API model codes matched to AirGradient models;
it is not an independent physical inspection. A contributor is the operator,
not necessarily the manufacturer. Unknown / third-party models are rejected.

1. Sir Apollo Kagwa Road — Kampala, Uganda
   AirGradient Open Air Max Outdoor Air Quality Monitor
   Location ID: 172350. Model: O-M-1PPSTON-CE.
   Reference coordinates: 0.33354, 32.56861. Operator/contributor: AirQo.
   AirGradient hardware is identified by the model code; AirQo is the operator.
   This model includes O3 / NO2 hardware, but the public response did not expose
   their concentrations. Missing gas readings remain unavailable.
   Non-zero PM2.5 checked at release; see the verification note below.

2. BANTHI, LAMPHUN — Banthi, Lamphun, Thailand
   AirGradient Open Air Max Outdoor Air Quality Monitor
   Location ID: 189546. Model: O-M-1PPST-CE (without dedicated O3 / NO2 sensors).
   Reference coordinates: 18.65725, 99.1126667.
   Selected under the Thailand fallback requested when no Indian Max was found.
   Settings > Max without O3/NO2 — slot 2 can replace this with another Max;
   the model is checked against the API. Country is shown only when known.

3. Sri Jayawardenepura Kotte — Sri Lanka
   AirGradient Open Air Outdoor Air Quality Monitor (standard / non-Max)
   Location ID: 189917. Model: O-1PST.
   Reference coordinates: 6.906103824237833, 79.90479420041291.

4. Siththimaavaa Hingun — Male, Maldives
   AirGradient Open Air Outdoor Air Quality Monitor (standard / non-Max)
   Location ID: 76611. Model: O-1PS.
   Reference coordinates: 4.17278, 73.51027.

Live API names and coordinates take precedence over these reference values.
No saved measurement snapshots are used to simulate live data. All FOUR default devices are configured. Zero readings remain visible when
reported later; devices are not automatically swapped to force positive values.

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
- Page order: map, four AQ cards, selected AQ data, comparison/API details,
  Timing & interpretation, Documentation & examples.
- Each device card and location table list returned measurement fields.
- Select a card or a location name for the full parameter/metadata table and
  original JSON. Nulls are shown as unavailable. Unknown fields retain their
  original names, values and unknown units; new fields are not discarded.
- Use Map parameter to display any returned numeric measurement on the map.
- Available fields can include PM1, PM2.5, PM10, particle count, CO2, temperature,
  humidity, TVOC, VOC / NOx index or firmware values, heat index, signal strength,
  corrections and Max battery/solar values. Actual availability varies.
- O3 / NO2 model capability is separate from API availability. Electrode signals
  cannot be interpreted as calibrated gas concentrations without the vendor's
  applicable calibration. NOx index is not NO2 concentration.
- The API details table includes Location ID, model, coordinates, contributor,
  firmware, serial number, timestamps, JSON links and active settings. Public
  current requests need no key. Optional private tokens are always hidden.

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
or browse their public records. The demo supports up to 40 configured slots.
Unknown model codes are rejected rather than assumed to be AirGradient hardware.
To support an additional documented model, update MODELS in the HTML and the
matching model list in serve.py after checking its official model documentation.
Version 2.1.0 uses the renamed app's browser preference key. It starts with fresh
preferences, so saved settings from the previous app name are not carried over.
Restore four default slots resets the device list. Preferences are browser-local.
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

https://api.airgradient.com/public/api/v1/world/locations/172350/measures/current
https://api.airgradient.com/public/api/v1/world/locations/189546/measures/current
https://api.airgradient.com/public/api/v1/world/locations/189917/measures/current
https://api.airgradient.com/public/api/v1/world/locations/76611/measures/current
Example: open one of these links in your browser to inspect its current JSON.
All four locations have public JSON links; availability can change.

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
README.md — these instructions.
CHANGELOG.md — release history.
scripts/build_release.py — builds and verifies a portable source ZIP.
.github/workflows/check.yml — automated source and packaging checks.
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
`Get-FileHash .\AirGradient-Test-API-App-v2.1.0.zip -Algorithm SHA256` and compare
it with the accompanying `.sha256` file. On Linux, use
`sha256sum -c AirGradient-Test-API-App-v2.1.0.zip.sha256`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for Git and GitHub release steps.

## Licensing and attribution

No project source-code license has been selected. Publication on GitHub does not
by itself grant an open-source license. Existing third-party terms continue to
apply: Leaflet, OpenStreetMap tiles/data, AirGradient services/data, and Natural
Earth land data retain their respective terms and attribution.
