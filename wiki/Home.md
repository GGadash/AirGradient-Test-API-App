# AirGradient Test API App

**v2.3.0-rc.2 · independent testing and demonstration project.** Made by Akila DJ
using OpenAI ChatGPT / Codex to test and demonstrate AirGradient API connections:
fetch public readings, inspect fields and raw JSON, compare devices, and explore
air-quality data on a map. Click a location or read its device card for compact
parameter/value rows, with explained N/A, N/D and missing-field notation. This is not an official AirGradient product.

**Testing and demo only:** software, labels, calculations and source readings may
contain mistakes. Values are not independently validated; check original records
and timestamps before relying on results. AQI is an illustrative PM2.5 estimate.

## Choose your edition

**The Python + localhost app is the main version.** It provides on-demand requests,
configurable devices, raw/corrected PM2.5 selection and optional authorized hourly
history. Install [Python](https://www.python.org/downloads/) (3.9+ compatibility;
a currently supported stable release is recommended) and keep an internet connection.
Download and extract the [release ZIP](https://github.com/GGadash/AirGradient-Test-API-App/releases/tag/v2.3.0-rc.2), run
`py serve.py` on Windows or `python3 serve.py` on macOS/Linux, then open the exact
local address printed by Python. Keep the terminal running. No pip packages needed.
[Full installation guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/main/README.md#install-python-first).

The [supplementary website](https://ggadash.github.io/AirGradient-Test-API-App/)
is an easy first look without installation. It shows five fixed devices using
snapshots collected about every 15 minutes. GitHub delays may make them older;
reloading only reloads published data. No token entry, device additions or hourly
history. Use the main app for fuller API testing; it does not improve sensor accuracy.

## Explore Air Quality Data

- [Devices and parameters](https://github.com/GGadash/AirGradient-Test-API-App/wiki/Devices-and-Parameters): device order, NO2/O3, units and interpretation.
- [Credits and licensing](https://github.com/GGadash/AirGradient-Test-API-App/wiki/Credits-and-Licensing): courtesy to data providers, tool licenses and app reuse.
- [Source and user guide](https://github.com/GGadash/AirGradient-Test-API-App) · [Release notes](https://github.com/GGadash/AirGradient-Test-API-App/blob/main/RELEASE_NOTES.md).

Original code and documentation: **MIT No Attribution (MIT-0)**. Use, change, share
and sell freely; attribution is optional and welcome. No share-alike requirement
for original code. Provided as is without warranty; third-party terms remain separate.

Thank you to **AirGradient**, its API team, and the monitor owners and contributors
who choose to share data publicly. Their measurements make this demo possible.

---
Enjoying the experiment? **Fuel the next API adventure** with an optional
[Ko-fi contribution](https://ko-fi.com/s/3f1e7ff9a0) or visit
[Gadash on Ko-fi](https://ko-fi.com/gadash). Free to use; a coffee is always optional.
