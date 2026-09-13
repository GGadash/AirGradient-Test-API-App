# Supplementary GitHub Pages edition

**The main product remains `serve.py` + `AirGradient-Test-API-App.html`.** This
website is a convenient, limited public preview and is not a replacement for it.

Visit [the supplementary page](https://ggadash.github.io/AirGradient-Test-API-App/).
For fuller API testing and on-demand requests, [get the main app](https://github.com/GGadash/AirGradient-Test-API-App/releases).
Visitors to the web preview need internet and a browser, but do not need Python.

The page shows **Device map** first, followed by **Latest published readings by
device**, then parameters and original records. The download button stays at the top; the
full main-release URL is also displayed as a text link at the very bottom.

## Data flow and limitations

GitHub Actions runs `scripts/build_pages.py`, fetches only the four public Location
IDs in `devices.json`, and publishes JSON and static assets to GitHub Pages.
Collection is scheduled every 15 minutes, off the top of the hour. GitHub may delay
or skip runs, and public-repository schedules can be disabled after 60 days without
repository activity. See [GitHub schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

The browser reloads the published JSON every five minutes and on the **Reload
published data** button. Neither action requests new readings from AirGradient.
The page displays measurement time, each record's successful collection time,
and the last attempted collection time in UTC. Readings older than 20 minutes and
collection gaps over 45 minutes are flagged. These are demonstration thresholds.
A failed request may retain an earlier validated record with its original times
and an explicit error. If there is no usable earlier record, it stays unavailable.

This edition has four fixed devices, raw PM2.5 and returned fields, a world outline,
and published JSON. It has no private token entry, authenticated hourly history,
custom device addition, corrected-PM selector, or AQI calculation. The main local
app provides fuller controls and reduces the extra publication delay; it does not
improve the underlying sensor accuracy. The page is not an official AirGradient app.

## Build and maintain

- `python scripts/build_pages.py`: collect public readings and build `dist/site/`.
- `python scripts/build_pages.py --offline`: build an unavailable-data page for offline CI; never deploy this mode.
- Preview the generated site with `python -m http.server 8780 --directory dist/site` and open `http://127.0.0.1:8780/`. This static preview command is only for the supplement; use `serve.py` for the main app.
- GitHub Pages publishing source is **GitHub Actions**. Run **Publish supplementary web preview** manually from the Actions tab if needed.
- Change `devices.json` only with verified public AirGradient locations/models; keep it aligned with the main app's four defaults.
- `dist/site/` and snapshots are generated artifacts, not committed source. The workflow publishes Pages artifacts without adding measurement commits to `main`.
- No Cloudflare account, extra hosting service, AirGradient secret, or public CORS proxy is used. GitHub Actions performs the upstream requests.

## Licensing

Original code/docs: **MIT No Attribution (MIT-0)**; reuse, changes, sharing, and sale
are allowed without required attribution. Optional author credit is welcome. No
share-alike obligation applies to original project code. No warranty.

Published AirGradient data: **CC BY-SA 4.0**, with source and contributor credit.
Records are grouped with status/collection metadata; measurements are not corrected
or resampled. This data license remains separate from MIT-0. See the
[provider's public-data notice](https://www.airgradient.com/documentation/kb/subprocessors),
[license terms](https://creativecommons.org/licenses/by-sa/4.0/),
[project license](../LICENSE), and [third-party notices](../THIRD_PARTY_NOTICES.md).

## Optional support

[Project Ko-fi link](https://ko-fi.com/s/3f1e7ff9a0) · [Gadash profile](https://ko-fi.com/gadash).
Support is voluntary. [Full support information](../SUPPORT.md).
