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

1. Update the version in the HTML metadata, Python launcher banner/user agent, `README.md`, and `scripts/build_release.py`. Update `CHANGELOG.md`. Change the browser preference key only when a preference reset is intended.
2. Complete the checks above and commit the final source to `main`.
3. Run `py scripts/build_release.py` to create `dist/AirGradient-Test-API-App-v2.1.0.zip` and its `.sha256` file. Future versions use their updated version in these filenames.
4. Push the source with `git push origin main` and wait for the Checks workflow to pass.
5. For this version, create and push the tag:

   ```sh
   git tag -a v2.1.0 -m "AirGradient Test API App v2.1.0"
   git push origin v2.1.0
   ```

6. Publish the download using a single command (replace version strings for future releases):

   ```sh
   gh release create v2.1.0 dist/AirGradient-Test-API-App-v2.1.0.zip dist/AirGradient-Test-API-App-v2.1.0.zip.sha256 --repo GGadash/AirGradient-Test-API-App --verify-tag --title "AirGradient Test API App v2.1.0" --notes-file CHANGELOG.md
   ```

7. Open the GitHub release and verify its version, source commit, and both uploaded assets. Users should download the named app ZIP, extract it, and run `serve.py`.

Generated archives stay in ignored `dist/`; publish them as release assets. GitHub also provides automatic source ZIP/tar downloads for the tag. Releases distribute the app; they do not host the Python backend. GitHub Pages cannot run this local server.
