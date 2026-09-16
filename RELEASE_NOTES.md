# AirGradient Test API App v2.3.0-rc.1

**Release candidate — for testing and demonstration.** The Python + localhost app remains the main product. This update adds ESYair Pro as the first of five devices and displays API-reported NO2/O3 in ppb.

## Install and run

1. **Install Python** from [python.org](https://www.python.org/downloads/). Python 3.9+ is the compatibility minimum; use a currently supported stable version for a new setup. [Windows setup](https://docs.python.org/3/using/windows.html) Â· [macOS downloads](https://www.python.org/downloads/macos/) Â· [Linux guidance](https://docs.python.org/3/using/unix.html).
2. **Connect to the internet** to fetch live API readings and load online map/library resources.
3. Download **AirGradient-Test-API-App-v2.3.0-rc.1.zip** from this release's **Assets** and extract it.
4. Open a terminal in the extracted folder. Run `py serve.py` on Windows or `python3 serve.py` on macOS/Linux.
5. Open the exact local URL printed by Python. Leave the terminal open; stop it with Ctrl+C.

No extra Python packages are needed. Do not open the HTML directly.
[Short setup guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.3.0-rc.1/START_HERE.md) Â·
[Full user guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.3.0-rc.1/README.md)

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
or use the main local app. [Full supplementary guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.3.0-rc.1/web/README.md).

## Changes in this release candidate

- Added **ESYair Pro (196780)** first. Original four devices retain their order as slots 2–5 in both editions; responsive layout accommodates five cards.
- Added NO2/O3 concentration values in **ppb** to cards, main-app detail tiles and parameter metadata. Both are selectable on the main map. Raw electrode fields use mV when supplied; NOx index remains separate.
- Preserve and flag negative gas readings; preserve zero; show missing/null values as unavailable. Positive numbers alone do not prove accuracy.
- Migrate saved device/display settings on the same browser origin, prepend ESYair without duplication and move the non-gas Max replacement control to slot 3.
- Updated parameter guides, testing/demo disclaimers and credits/licensing. Added the [published wiki](https://github.com/GGadash/AirGradient-Test-API-App/wiki), with identical local Markdown copies in `wiki/`.
- Kept optional Ko-fi support, main-download button at the top, map above cards and full main-release link at the bottom of the supplementary page.

## Optional project support

[https://ko-fi.com/s/3f1e7ff9a0](https://ko-fi.com/s/3f1e7ff9a0) Â· [Gadash on Ko-fi](https://ko-fi.com/gadash).
Support is voluntary; the app remains free under MIT-0. The repository's Sponsor section offers the same links.

## License

**MIT No Attribution (MIT-0).** Freely use, change, share, and sell the original
code and documentation. Attribution is not required; optional credit to Akila DJ
is welcome. No requirement to publish changes or use the same license. Provided
as is, without warranty. Third-party data, libraries, and maps keep their own terms.

[Full project license](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.3.0-rc.1/LICENSE) Â·
[Official MIT-0 license](https://opensource.org/license/mit-0) Â·
[Third-party notices](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.3.0-rc.1/THIRD_PARTY_NOTICES.md)

## Testing scope and limitations

Validation covers Python/JavaScript syntax, release ZIP integrity, six Python tests
and ten JavaScript tests, including gas zero/negative/null handling, four-to-five
snapshot transitions, device order and saved-preference migration. Desktop/mobile
browser checks cover both editions, five successful public requests, map gas
selection, slot 3 replacement and the top/bottom release links. Negative gas values
were observed upstream and remain flagged. Authenticated hourly history requires
an authorized user token and was not live-tested. This is a release candidate,
not an accuracy certification or an official AirGradient product.

The ZIP distributes the main local app plus the supplementary website source.
Generated live snapshots are not bundled. GitHub also provides source ZIP/tar
downloads; the named app ZIP includes an additional per-file checksum manifest.
The supplementary hosted page is available separately at the link above.
