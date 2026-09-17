#!/usr/bin/env python3
# SPDX-License-Identifier: MIT-0
"""AirGradient Test API App. Python 3.9+, no packages required.
Run: python serve.py (or on Windows: py serve.py), then open the printed URL.
Only fixed AirGradient API routes are proxied. Binds to this computer only.
"""
import json
import os
import re
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE = 'https://api.airgradient.com/public/api/v1/'
PAGE = Path(__file__).with_name('AirGradient-Test-API-App.html')
STATE = {'token': '', 'cache': {}}
LOCK = threading.Lock()

def remote(path, authenticated=False, ttl=30):
    with LOCK:
        token = STATE['token'] if authenticated else ''
        key = (path, token)
        cached = STATE['cache'].get(key)
        if cached and time.time() - cached[0] < ttl:
            return cached[1]
    if authenticated and not token:
        raise ValueError('Hourly data needs an AirGradient token with access to this location. Add it in Settings.')
    url = BASE + path + ('?token=' + urllib.parse.quote(token, safe='') if token else '')
    req = urllib.request.Request(url, headers={'Accept': 'application/json', 'User-Agent': 'AirGradient-Test-API-App/2.3.0-rc.2'})
    with urllib.request.urlopen(req, timeout=25) as response:
        data = json.load(response)
    with LOCK:
        if (not authenticated) or STATE['token'] == token:
            STATE['cache'][key] = (time.time(), data)
        if len(STATE['cache']) > 300:
            STATE['cache'] = {key: (time.time(), data)}
    return data

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass  # Never log credentials or query strings.

    def send(self, status, data, content_type='application/json; charset=utf-8', upstream=None):
        body = data if isinstance(data, bytes) else json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        if upstream:
            self.send_header('X-AirGradient-Test-API-Upstream', upstream)
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        # OSM web tiles require a genuine browser referrer. Send only the origin.
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def valid_host(self):
        return self.headers.get('Host') in {f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}'}

    def do_GET(self):
        if not self.valid_host():
            return self.send(403, {'error': 'Local access only.'})
        u = urllib.parse.urlsplit(self.path)
        if u.path in ('/', '/AirGradient-Test-API-App.html'):
            return self.send(200, PAGE.read_bytes(), 'text/html; charset=utf-8')
        if u.path == '/api/status':
            with LOCK:
                enabled = bool(STATE['token'])
            return self.send(200, {'authenticated': enabled})
        try:
            if u.path == '/api/discover':
                upstream = 'world/locations/measures/current'
                rows = remote(upstream, ttl=180)
                data = [r for r in rows if r.get('model') in {'O-M-1PPSTON-CE', 'O-M-1PPST-CE', 'O-1PST', 'O-1PS'}]
            elif u.path in ('/api/current', '/api/hourly'):
                ident = urllib.parse.parse_qs(u.query).get('id', [''])[0]
                if not re.fullmatch(r'[1-9][0-9]{0,11}', ident):
                    return self.send(400, {'error': 'Enter a valid numeric Location ID.'})
                if u.path == '/api/hourly':
                    upstream = f'locations/{ident}/measures/buckets/60'
                    data = remote(upstream, True, 180)
                else:
                    try:
                        upstream = f'world/locations/{ident}/measures/current'
                        data = remote(upstream)
                    except urllib.error.HTTPError as e:
                        with LOCK:
                            has_token = bool(STATE['token'])
                        if e.code not in (401, 403, 404) or not has_token:
                            raise
                        upstream = f'locations/{ident}/measures/current'
                        data = remote(upstream, True)
            else:
                return self.send(404, {'error': 'Route not found.'})
            return self.send(200, data, upstream=upstream)
        except ValueError as e:
            return self.send(400, {'error': str(e) if 'Hourly data' in str(e) else 'Unexpected response from AirGradient.'})
        except urllib.error.HTTPError as e:
            message = {401: 'Token missing or invalid.', 403: 'This token cannot access the location.', 404: 'No data available, or location is not public/accessible.', 429: 'AirGradient rate limit reached. Wait before refreshing.'}.get(e.code, 'AirGradient API request failed.')
            return self.send(e.code if 400 <= e.code < 600 else 502, {'error': message})
        except Exception:
            return self.send(502, {'error': 'Could not reach AirGradient. Check your internet connection and try again.'})

    def do_POST(self):
        expected = {f'http://127.0.0.1:{self.server.server_port}', f'http://localhost:{self.server.server_port}'}
        if not self.valid_host() or self.headers.get('Origin') not in expected:
            return self.send(403, {'error': 'Open the page at the local address printed by the launcher.'})
        if self.path != '/api/token' or not self.headers.get('Content-Type', '').startswith('application/json'):
            return self.send(400, {'error': 'Invalid request.'})
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 8192:
                raise ValueError()
            token = json.loads(self.rfile.read(size)).get('token', '')
            if not isinstance(token, str) or len(token) > 4096:
                raise ValueError()
            with LOCK:
                STATE['token'] = token.strip()
                STATE['cache'].clear()
            self.send(200, {'authenticated': bool(token.strip())})
        except (ValueError, TypeError, AttributeError):
            self.send(400, {'error': 'Invalid token request.'})

if __name__ == '__main__':
    if not PAGE.is_file():
        raise SystemExit('Keep serve.py and AirGradient-Test-API-App.html in the same folder.')
    port = int(os.environ.get('AIRGRADIENT_TEST_API_PORT', '8765'))
    try:
        server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    except OSError:
        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    print(f'\nAirGradient Test API App v2.3.0-rc.2\nMade by Akila DJ using OpenAI — demonstrational purposes.\nLicense: MIT No Attribution (MIT-0). Credit optional; no warranty.\nInternet connection required to fetch data. Setup: README.md / START_HERE.md.\n\nOPEN THIS LINK IN YOUR BROWSER:\nhttp://127.0.0.1:{server.server_port}/\n\nThis is your localhost address. Do NOT open the HTML file directly.\nKeep this window open. Press Ctrl+C to stop.\n', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
