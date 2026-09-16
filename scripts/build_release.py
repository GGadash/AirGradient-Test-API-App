#!/usr/bin/env python3
# SPDX-License-Identifier: MIT-0
"""Build and verify an allowlisted, portable source release using stdlib only."""
import hashlib
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

VERSION = '2.3.0-rc.1'
ROOT = Path(__file__).resolve().parent.parent
PACKAGE = f'AirGradient-Test-API-App-v{VERSION}'
FILES = (
    'AirGradient-Test-API-App.html',
    'serve.py',
    'README.md',
    'START_HERE.md',
    'SUPPORT.md',
    '.github/FUNDING.yml',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
    'RELEASE_NOTES.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    '.gitignore',
    '.gitattributes',
    '.github/workflows/check.yml',
    'scripts/build_release.py',
    'scripts/build_pages.py',
    '.github/workflows/pages.yml',
    'web/index.html',
    'web/style.css',
    'web/app.mjs',
    'web/devices.json',
    'web/README.md',
    'tests/test_pages.py',
    'tests/web.test.mjs',
    'tests/main.test.mjs',
    'wiki/_Footer.md',
    'wiki/_Sidebar.md',
    'wiki/Credits-and-Licensing.md',
    'wiki/Devices-and-Parameters.md',
    'wiki/Home.md',

)


def build():
    payloads = {name: (ROOT / name).read_bytes() for name in FILES}
    manifest = ''.join(
        f'{hashlib.sha256(data).hexdigest()}  {name}\n'
        for name, data in sorted(payloads.items())
    ).encode('utf-8')
    payloads['SHA256SUMS.txt'] = manifest
    output = ROOT / 'dist'
    output.mkdir(exist_ok=True)
    archive = output / f'{PACKAGE}.zip'
    # Fixed metadata and ordering keep archives reproducible for the same source.
    with ZipFile(archive, 'w', compression=ZIP_DEFLATED) as zipped:
        for name, data in sorted(payloads.items()):
            entry = ZipInfo(f'{PACKAGE}/{name}', date_time=(2026, 9, 13, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            entry.compress_type = ZIP_DEFLATED
            zipped.writestr(entry, data)
    with ZipFile(archive) as zipped:
        expected = {f'{PACKAGE}/{name}' for name in payloads}
        if set(zipped.namelist()) != expected or zipped.testzip() is not None:
            raise RuntimeError('Release ZIP integrity check failed.')
        for name, data in payloads.items():
            if zipped.read(f'{PACKAGE}/{name}') != data:
                raise RuntimeError(f'Release ZIP content mismatch: {name}')
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    checksum = archive.with_suffix('.zip.sha256')
    with checksum.open('w', encoding='utf-8', newline='\n') as output_file:
        output_file.write(f'{digest}  {archive.name}\n')
    print(f'Verified {len(payloads)} files: {archive}')
    print(f'SHA-256: {digest}')
    print(f'Checksum: {checksum}')


if __name__ == '__main__':
    build()
