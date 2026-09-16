# Changelog

## v2.3.0-rc.1 — 17 September 2026

- Add ESYair Pro (196780) first; keep the existing four in slots 2–5 across both editions.
- Display NO2/O3 in ppb, raw electrode signals in mV when supplied, and preserve negative/zero/missing readings without fabricating data.
- Migrate saved devices and preferences; move the non-gas Max replacement control to slot 3.
- Update responsive layouts, parameter guides, demo disclaimers and licensing/credits.
- Publish the GitHub wiki and include its source pages in the repository and release ZIP.

## 2.2.0-rc.2 — 2026-09-13

- Placed the supplementary device map before the published readings and clarified section titles.
- Kept the top main-release button and added the full release URL as a wrapping text link at the very bottom.
- Added GDTT-style GitHub funding configuration: Ko-fi `gadash` and this project's dedicated support URL.
- Added optional support details to the website, guides, release notes, and portable package.


## 2.2.0-rc.1 — 2026-09-13

- Kept the Python + localhost app as the main product; corrected a leftover README.txt reference and added a link to the supplementary website.
- Added a separately maintained, clearly labelled GitHub Pages preview for the four default public devices, with raw PM2.5, returned fields, original records, and a world outline map.
- Added nominal 15-minute GitHub Actions collection with per-device original timestamps, unavailable/stale/error labels, and validated retention on collection failure. No private tokens or external hosting account required.
- Documented the supplementary page's limitations and recommended the main local app for fuller API testing and on-demand requests.
- Preserved AirGradient public-data attribution under CC BY-SA 4.0, separate from MIT-0 for original code/docs.
- Added regression checks and included all supplementary source in the release ZIP. Generated measurement snapshots remain outside Git source and the downloadable release.


## 2.1.0-rc.1 — 2026-09-13

- Prepared the first GitHub release as a release candidate.
- Added Python installation steps, official download links, and the internet requirement to the user guide and top-level `START_HERE.md`.
- Added MIT No Attribution (MIT-0), plain-language permission summaries, and third-party notices. Author credit is optional and welcome.
- Added setup/license information in the app and dedicated GitHub release notes.

### Changes prepared on 2026-09-12

- Renamed the supplied AirGradient Max Atlas v2.1 project to **AirGradient Test API App**.
- Renamed the HTML entry file and updated the page title, metadata, launcher, API client/server header, user agent, browser preference key, and browser tool name.
- Renamed the optional port setting to `AIRGRADIENT_TEST_API_PORT` (default: `8765`).
- Converted the original README to Markdown and added development and release instructions.
- Added Git exclusions, line-ending rules, automated checks, and a portable ZIP builder with SHA-256 checksums.
- Preserved the four default devices, API behavior, and original attribution.

Saved browser preferences under the former app name are not migrated. The original package's device-selection measurements are historical notes, not new measurements taken for this release.
