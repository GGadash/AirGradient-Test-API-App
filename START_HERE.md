# Start here — Air Quality Data with AirGradient Test API App

**Version: v2.3.0-rc.2 (release candidate).** For testing and demonstration.

## Which version should I use?

**Use the main Python + localhost app for fuller features and on-demand requests.**
The steps below install and run that main version. For an easier first look, open
the [supplementary website](https://ggadash.github.io/AirGradient-Test-API-App/).
It needs internet but no Python installation. It shows scheduled snapshots of five
fixed public devices; no private tokens, hourly history, or added devices. Reloading
does not fetch new AirGradient readings. Check the measurement/collection times.
GitHub schedules can be delayed or disabled after inactivity. For better results
when testing the API, return to the main app. [Web limitations](web/README.md).

## Before you begin

- **Install Python.** Python 3.9 is the compatibility minimum; use a currently supported stable Python 3 release for a new installation.
- **Connect to the internet.** An active connection is required to get AirGradient readings and load online library/map resources. The included world outline does not make live data available offline.
- Use a modern browser. You do not need pip packages, Node.js, Git, or an API key for public latest readings.

## Install and check Python

| System | Official download/help | Verify in a terminal |
| --- | --- | --- |
| Windows | [Download](https://www.python.org/downloads/windows/) · [Installation guide](https://docs.python.org/3/using/windows.html) | `py --version` or `python --version` |
| macOS | [Download](https://www.python.org/downloads/macos/) · [Installation guide](https://docs.python.org/3/using/mac.html) | `python3 --version` |
| Linux | Use your distribution's package manager; [Python Unix guide](https://docs.python.org/3/using/unix.html) | `python3 --version` |

On Windows, follow the official install manager/installer instructions. Enable
**Add Python to PATH** if offered. Reopen the terminal after installation. A `py`
launcher that cannot find a default Python still needs an installed/configured runtime.

## Run in five steps

1. Visit the [release page](https://github.com/GGadash/AirGradient-Test-API-App/releases/tag/v2.3.0-rc.2) and download **AirGradient-Test-API-App-v2.3.0-rc.2.zip** under **Assets**.
2. Extract the entire ZIP. Open a terminal in the folder containing `serve.py`.
3. Run **`py serve.py`** on Windows, or **`python3 serve.py`** on macOS/Linux.
4. Open the exact local URL printed in the terminal, usually `http://127.0.0.1:8765/`.
5. Leave the terminal open. Stop the app with **Ctrl+C** when finished.

Do not double-click the HTML or run it from inside the ZIP. If `py` is unavailable
but Python is installed, try `python serve.py`. If live data fails, check your
internet connection and the device's error message. Hourly history needs an
AirGradient API token authorized for those locations.

## License in plain language

**MIT No Attribution (MIT-0).** You may use, change, share, and sell the original
code and documentation. **Attribution is not required; optional credit to Akila DJ
is welcome.** You do not have to publish your changes or keep the same license.
Provided as is, without warranty. Third-party data, maps, and libraries retain
their own terms and any required credits.

[Full license](LICENSE) · [Official MIT-0 license](https://opensource.org/license/mit-0) ·
[Third-party notices](THIRD_PARTY_NOTICES.md) · [Full user guide](README.md) ·
[Source repository](https://github.com/GGadash/AirGradient-Test-API-App)

## Optional support

[Support the project on Ko-fi](https://ko-fi.com/s/3f1e7ff9a0) · [Gadash profile](https://ko-fi.com/gadash).
Support is appreciated but not required. [Details](SUPPORT.md).

## Five devices and gas readings

ESYair Pro (196780) is first, followed by Sir Apollo Kagwa Road (172350),
BANTHI, LAMPHUN (189546), Sri Jayawardenepura Kotte (189917), and
Siththimaavaa Hingun (76611). NO2 and O3 appear in **ppb** when supplied by the API.
Missing readings stay unavailable. Negative readings are preserved and flagged;
zero or positive numbers alone do not establish accuracy. NOx indices and raw
electrode signals are different parameters.

**Testing and demo only.** Software, labels, calculations and source readings may
contain mistakes. This independent project tests AirGradient API connections;
check original records before relying on results.

[Project wiki](https://github.com/GGadash/AirGradient-Test-API-App/wiki) explains
devices, parameters, credits, licensing and optional support. Its source pages
are also included in the release's `wiki/` folder.

Map popups and device cards list all returned measurements, alongside the main
PM2.5/AQI display. N/A means known unsupported; N/D means no reading in an expected
or returned field; — means not reported and support unknown. Each list explains
the notation. NO2/O3 use the same compact style as the other parameters.
