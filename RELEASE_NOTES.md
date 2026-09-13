# AirGradient Test API App v2.2.0-rc.2

**Release candidate — for testing and demonstration.** The Python + localhost app remains the main product. This update refines the supplementary web preview and adds optional Ko-fi support links.

## Install and run

1. **Install Python** from [python.org](https://www.python.org/downloads/). Python 3.9+ is the compatibility minimum; use a currently supported stable version for a new setup. [Windows setup](https://docs.python.org/3/using/windows.html) · [macOS downloads](https://www.python.org/downloads/macos/) · [Linux guidance](https://docs.python.org/3/using/unix.html).
2. **Connect to the internet** to fetch live API readings and load online map/library resources.
3. Download **AirGradient-Test-API-App-v2.2.0-rc.2.zip** from this release's **Assets** and extract it.
4. Open a terminal in the extracted folder. Run `py serve.py` on Windows or `python3 serve.py` on macOS/Linux.
5. Open the exact local URL printed by Python. Leave the terminal open; stop it with Ctrl+C.

No extra Python packages are needed. Do not open the HTML directly.
[Short setup guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.2.0-rc.2/START_HERE.md) ·
[Full user guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.2.0-rc.2/README.md)

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
| Device controls, corrected/raw selection, illustrative AQI, authorized hourly history | Four fixed devices, raw PM2.5, returned fields, world map, and published JSON |
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
or use the main local app. [Full supplementary guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.2.0-rc.2/web/README.md).

## Changes in this release candidate

- Moved **Device map** above **Latest published readings by device** in the supplementary page.
- Kept the main-download button at the top and added the full main-release URL as a text link at the very bottom, wrapping on small screens.
- Added GitHub sponsorship configuration with Ko-fi username `gadash` and the project-specific support link.
- Added optional support information to the user guides and supplementary page. The main Python + localhost app remains the primary version.

## Optional project support

[https://ko-fi.com/s/3f1e7ff9a0](https://ko-fi.com/s/3f1e7ff9a0) · [Gadash on Ko-fi](https://ko-fi.com/gadash).
Support is voluntary; the app remains free under MIT-0. The repository's Sponsor section offers the same links.

## License

**MIT No Attribution (MIT-0).** Freely use, change, share, and sell the original
code and documentation. Attribution is not required; optional credit to Akila DJ
is welcome. No requirement to publish changes or use the same license. Provided
as is, without warranty. Third-party data, libraries, and maps keep their own terms.

[Full project license](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.2.0-rc.2/LICENSE) ·
[Official MIT-0 license](https://opensource.org/license/mit-0) ·
[Third-party notices](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.2.0-rc.2/THIRD_PARTY_NOTICES.md)

## Testing scope and limitations

The release checks cover Python and inline JavaScript syntax and ZIP integrity.
Regression tests cover zero/null values, stale timestamps, and retained readings
after failed collection. Local smoke checks cover the served page, API status/error routes, and the renamed
client/server response header. Authenticated hourly history needs a suitable user
token and has not been live-tested. Original device-selection readings are
historical notes, not a guarantee that devices are currently online. AQI values
are illustrative; this is not a production server or an official AirGradient app.

The ZIP distributes the main local app plus the supplementary website source.
Generated live snapshots are not bundled. GitHub also provides source ZIP/tar
downloads; the named app ZIP includes an additional per-file checksum manifest.
The supplementary hosted page is available separately at the link above.
