#!/usr/bin/env python3
# SPDX-License-Identifier: MIT-0
"""Collect only public readings and build the supplementary GitHub Pages site."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import time
import urllib.error
import urllib.request

from build_release import VERSION

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'web'
SITE_URL = 'https://ggadash.github.io/AirGradient-Test-API-App/'
API = 'https://api.airgradient.com/public/api/v1/world/locations/'
MAX_BYTES = 2_000_000


def read_json(url):
    request = urllib.request.Request(url, headers={
        'Accept': 'application/json', 'User-Agent': 'AirGradient-Test-API-App-Pages/' + VERSION,
    })
    with urllib.request.urlopen(request, timeout=25) as response:
        body = response.read(MAX_BYTES + 1)
    if len(body) > MAX_BYTES:
        raise ValueError('Response is too large')
    return json.loads(body)


def validate_record(record, device):
    if not isinstance(record, dict):
        raise ValueError('Unexpected response format')
    if record.get('locationId') != device['id'] or record.get('model') != device['model']:
        raise ValueError('Location or model no longer matches the configured device')
    return record


def fetch_record(device):
    # No tokens, authenticated routes, or arbitrary destination URLs are accepted.
    for attempt in range(2):
        try:
            return validate_record(read_json(API + str(device['id']) + '/measures/current'), device)
        except urllib.error.HTTPError as error:
            if error.code < 500 or attempt:
                raise
        except (OSError, ValueError):
            if attempt:
                raise
        time.sleep(2)


def collect_snapshot(devices, previous=None, fetcher=fetch_record, now=None):
    now = now or datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    previous = previous if isinstance(previous, dict) else {}
    old_rows = previous.get('devices', []) if previous.get('schemaVersion') == 1 else []
    old = {r.get('id'): r for r in old_rows if isinstance(r, dict)} if isinstance(old_rows, list) else {}

    def collect(device):
        row = dict(device, record=None, fetchedAt=None, retained=False, error=None)
        try:
            row['record'] = validate_record(fetcher(device), device)
            row['fetchedAt'] = now
        except Exception as error:
            row['error'] = ('AirGradient HTTP ' + str(error.code) if isinstance(error, urllib.error.HTTPError)
                            else 'Collection failed or response did not match the expected device.')
            prior = old.get(device['id'], {})
            try:
                row['record'] = validate_record(prior.get('record'), device)
                fetched = prior.get('fetchedAt')
                parsed = datetime.fromisoformat(fetched.replace('Z', '+00:00'))
                if parsed.tzinfo is None or parsed > datetime.fromisoformat(now.replace('Z', '+00:00')):
                    raise ValueError('Invalid prior collection time')
                row['fetchedAt'] = fetched
                row['retained'] = True
            except (ValueError, TypeError, AttributeError):
                row['record'] = None
        return row

    with ThreadPoolExecutor(max_workers=4) as pool:
        rows = list(pool.map(collect, devices))
    return {
        'schemaVersion': 1, 'appVersion': VERSION, 'generatedAt': now,
        'nominalCollectionMinutes': 15, 'devices': rows,
        'source': 'AirGradient public API; contributor names are preserved in each record',
        'dataLicense': 'CC-BY-SA-4.0',
        'dataLicenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'changes': 'Public API records grouped with collection times and status; measurements not corrected or resampled.',
    }


def build(offline=False):
    devices = json.loads((SOURCE / 'devices.json').read_text(encoding='utf-8'))
    previous = None
    if not offline:
        try:
            previous = read_json(SITE_URL + 'data/latest.json')
        except (OSError, ValueError):
            pass  # First deployment or the previous publication is unavailable.
    def unavailable(_):
        raise OSError('Offline validation; no readings collected')
    snapshot = collect_snapshot(devices, previous, unavailable if offline else fetch_record)
    output = ROOT / 'dist' / 'site'
    (output / 'data').mkdir(parents=True, exist_ok=True)
    for name in ('index.html', 'style.css', 'app.mjs'):
        content = (SOURCE / name).read_text(encoding='utf-8').replace('__VERSION__', VERSION)
        (output / name).write_bytes(content.encode('utf-8'))
    # Reuse the original project's public-domain world outline, without duplicating it in source.
    html = (ROOT / 'AirGradient-Test-API-App.html').read_text(encoding='utf-8')
    match = re.search(r'^const WORLD_LAND=(.*);$', html, re.MULTILINE)
    if not match:
        raise ValueError('Embedded world outline not found')
    land = json.loads(match.group(1))
    (output / 'data/world.json').write_text(json.dumps(land, separators=(',', ':')), encoding='utf-8')
    (output / 'data/latest.json').write_text(json.dumps(snapshot, ensure_ascii=True, allow_nan=False, indent=2), encoding='utf-8')
    (output / '.nojekyll').write_text('', encoding='utf-8')
    successful = sum(not row['error'] for row in snapshot['devices'])
    print(f'Built {output}: {successful}/{len(devices)} successful public requests.')
    if successful < len(devices):
        print('::warning::Some readings could not be collected. The site displays errors and any retained readings with original timestamps.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--offline', action='store_true', help='Build with unavailable readings for CI; never deploy this mode.')
    build(parser.parse_args().offline)
