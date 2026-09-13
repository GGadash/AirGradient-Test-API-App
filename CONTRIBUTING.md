# Development and release steps

## Get the source

```sh
git clone https://github.com/GGadash/AirGradient-Test-API-App.git
cd AirGradient-Test-API-App
```

The runtime requires Python 3.9+ and internet access. No pip or npm packages are needed to run the app. Node.js is used only for a JavaScript syntax check during development and CI.

## Run and check a change

1. Create a branch with `git switch -c your-change-name`.
2. Edit `AirGradient-Test-API-App.html` for the UI or `serve.py` for the local launcher/API proxy.
3. Run `py serve.py` on Windows or `python3 serve.py` on macOS/Linux. Open the printed local URL.
4. Check the page title, four device cards, refresh, settings, map, and error messages. Authenticated hourly data requires your own authorized token.
5. Run `py -m py_compile serve.py scripts/build_release.py` (use `python3` instead of `py` on macOS/Linux).
6. Run `py scripts/build_release.py` to build and verify the portable ZIP.
7. Inspect `git diff --check` and `git diff` before committing. Never put API tokens in source files, screenshots, logs, or Git commits.
8. Commit and push your branch, then open a pull request. GitHub Actions checks Python syntax, inline JavaScript syntax, and release packaging.

## Publish a release

These steps are for maintainers with repository write access and the GitHub CLI installed and signed in.

1. Update the version in the HTML metadata, Python launcher banner/user agent, `README.md`, and `scripts/build_release.py`. Update `CHANGELOG.md`, `START_HERE.md`, and `RELEASE_NOTES.md`. Change the browser preference key only when a preference reset is intended.
2. Complete the checks above and commit the final source to `main`.
3. Run `py scripts/build_release.py` to create `dist/AirGradient-Test-API-App-v2.2.0-rc.1.zip` and its `.sha256` file. Future versions use their updated version in these filenames.
4. Push the source with `git push origin main` and wait for the Checks workflow to pass.
5. For this version, create and push the tag:

   ```sh
   git tag -a v2.2.0-rc.1 -m "AirGradient Test API App v2.2.0-rc.1"
   git push origin v2.2.0-rc.1
   ```

6. Publish the download using a single command (replace version strings for future releases):

   ```sh
   gh release create v2.2.0-rc.1 dist/AirGradient-Test-API-App-v2.2.0-rc.1.zip dist/AirGradient-Test-API-App-v2.2.0-rc.1.zip.sha256 --repo GGadash/AirGradient-Test-API-App --verify-tag --title "AirGradient Test API App v2.2.0-rc.1" --prerelease --notes-file RELEASE_NOTES.md
   ```

7. Open the GitHub release and verify its version, source commit, and both uploaded assets. Users should download the named app ZIP, extract it, and run `serve.py`.

Generated archives stay in ignored `dist/`; publish them as release assets. GitHub also provides automatic source ZIP/tar downloads for the tag. Releases distribute the app; they do not host the Python backend. GitHub Pages cannot run this local server.

## Supplementary website

The main local app stays at the repository root. Web-only source lives in `web/`;
see [its guide](web/README.md). Run the following checks before publishing:

```sh
python -m unittest discover -s tests -p 'test_*.py'
node --test tests/web.test.mjs
python scripts/build_pages.py --offline
```

Use `py` on Windows when appropriate. For an actual public-data build, omit
`--offline`. The Pages workflow runs the collector every 15 minutes and on pushes
to `main` or manual runs. The generated site lives in ignored `dist/site/`; only
its static files and public-data JSON are uploaded to Pages. No snapshot commits
are added to source history. Never add a token to this public workflow.

To publish a new version, also update the web-facing release notes/links and test
the deployed Pages site. The HTML template gets its version from the release
builder. Leave earlier GitHub release tags unchanged.

## License for contributions

Original code and documentation use **MIT No Attribution (MIT-0)**. Reuse and
modification are permitted without required attribution; optional credit is welcome.
There is no share-alike requirement. See [LICENSE](LICENSE) and
[third-party notices](THIRD_PARTY_NOTICES.md). Contributions intended for inclusion
should be submitted under the same MIT-0 terms.
