# AirGradient Test API App v2.1.0-rc.1

**Release candidate — for testing and demonstration.** This is the first GitHub
release of the renamed application, based on the supplied AirGradient Max Atlas v2.1.

## Install and run

1. **Install Python** from [python.org](https://www.python.org/downloads/). Python 3.9+ is the compatibility minimum; use a currently supported stable version for a new setup. [Windows setup](https://docs.python.org/3/using/windows.html) · [macOS downloads](https://www.python.org/downloads/macos/) · [Linux guidance](https://docs.python.org/3/using/unix.html).
2. **Connect to the internet** to fetch live API readings and load online map/library resources.
3. Download **AirGradient-Test-API-App-v2.1.0-rc.1.zip** from this release's **Assets** and extract it.
4. Open a terminal in the extracted folder. Run `py serve.py` on Windows or `python3 serve.py` on macOS/Linux.
5. Open the exact local URL printed by Python. Leave the terminal open; stop it with Ctrl+C.

No extra Python packages are needed. Do not open the HTML directly.
[Short setup guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.1.0-rc.1/START_HERE.md) ·
[Full user guide](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.1.0-rc.1/README.md)

## Included changes

- Project, HTML filename, app title, launcher, and internal app identifiers renamed to **AirGradient Test API App**.
- Markdown user guide, top-level quick guide, official Python installation links, and explicit internet requirements.
- Setup and license information visible near the top of the app.
- Git exclusions, consistent line endings, automated checks, and a portable source ZIP builder.
- A checksum sidecar for the ZIP and `SHA256SUMS.txt` inside it for individual files.

## License

**MIT No Attribution (MIT-0).** Freely use, change, share, and sell the original
code and documentation. Attribution is not required; optional credit to Akila DJ
is welcome. No requirement to publish changes or use the same license. Provided
as is, without warranty. Third-party data, libraries, and maps keep their own terms.

[Full project license](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.1.0-rc.1/LICENSE) ·
[Official MIT-0 license](https://opensource.org/license/mit-0) ·
[Third-party notices](https://github.com/GGadash/AirGradient-Test-API-App/blob/v2.1.0-rc.1/THIRD_PARTY_NOTICES.md)

## Testing scope and limitations

The release checks cover Python and inline JavaScript syntax and ZIP integrity.
Local smoke checks cover the served page, API status/error routes, and the renamed
client/server response header. Authenticated hourly history needs a suitable user
token and has not been live-tested. Original device-selection readings are
historical notes, not a guarantee that devices are currently online. AQI values
are illustrative; this is not a production server or an official AirGradient app.

This release distributes a local application, not a hosted website. GitHub's
automatic source ZIP/tar downloads are also supported; the named app ZIP includes
an additional per-file checksum manifest.
