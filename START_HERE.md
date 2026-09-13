# Start here — AirGradient Test API App

**Version: v2.1.0-rc.1 (release candidate).** For testing and demonstration.

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

1. Visit the [release page](https://github.com/GGadash/AirGradient-Test-API-App/releases/tag/v2.1.0-rc.1) and download **AirGradient-Test-API-App-v2.1.0-rc.1.zip** under **Assets**.
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
