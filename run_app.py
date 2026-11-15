#!/usr/bin/env python3
"""
FOR YOU — High-Density 3D ASCII Rose Envelope Service
Architecture:
  - Backend: server.py (Standard Library HTTP + SQLite, Range streaming, /health, /status)
  - Frontend: index.html (OLED Dark UI, 3D ASCII bloom morphing, canvas, interactive sound)
  - Database: data.db (SQLite storing song binary BLOB & application metrics)
"""

import os
import sys
import time
import json
import sqlite3
import threading
import urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get("PORT", 3000))
HOST = "0.0.0.0"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data.db")
HTML_PATH = os.path.join(BASE_DIR, "index.html")

START_TIME = time.time()
REQUEST_COUNT = 0
request_lock = threading.Lock()

def get_audio_from_db():
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT mime, data FROM media WHERE id = 'song'")
        row = cur.fetchone()
        conn.close()
        if row:
            return row[0], row[1]
    except Exception as e:
        print(f"[DB Error] {e}")
    return "audio/mpeg", b""

# Cache audio bytes in memory for ultra-fast, zero-latency streaming
AUDIO_MIME, AUDIO_BYTES = get_audio_from_db()
AUDIO_LEN = len(AUDIO_BYTES)
print(f"[Database] Loaded '{AUDIO_MIME}' ({AUDIO_LEN} bytes) from data.db")

def format_uptime(seconds):
    d = int(seconds // 86400)
    h = int((seconds % 86400) // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    parts = []
    if d > 0: parts.append(f"{d}d")
    if h > 0: parts.append(f"{h}h")
    if m > 0: parts.append(f"{m}m")
    parts.append(f"{s}s")
    return " ".join(parts)

def get_status_html():
    uptime_sec = time.time() - START_TIME
    uptime_str = format_uptime(uptime_sec)
    return f"""<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Status — ASCII Rose</title>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background: #06070a;
      color: #e2e8f0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }}
    .card {{
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 42, 109, 0.25);
      border-radius: 20px;
      padding: 36px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 42, 109, 0.1);
      backdrop-filter: blur(16px);
    }}
    .header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }}
    .title {{ font-size: 1.25rem; font-weight: 700; color: #fff; }}
    .badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
    }}
    .badge-dot {{ width: 7px; height: 7px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }}
    .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }}
    .box {{
      background: rgba(30, 41, 59, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 14px 16px;
      border-radius: 12px;
    }}
    .label {{ font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }}
    .value {{ font-family: 'Fira Code', monospace; font-size: 1rem; color: #f8fafc; font-weight: 600; }}
    .actions {{ display: flex; gap: 10px; }}
    .btn {{
      flex: 1;
      text-align: center;
      padding: 10px 16px;
      border-radius: 10px;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }}
    .btn-primary {{ background: #ff2a6d; color: #fff; box-shadow: 0 4px 16px rgba(255, 42, 109, 0.3); }}
    .btn-secondary {{ background: rgba(255, 255, 255, 0.08); color: #cbd5e1; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">🌹 ASCII Rose Service</div>
      <div class="badge"><div class="badge-dot"></div> Operational</div>
    </div>
    <div class="grid">
      <div class="box"><div class="label">Uptime</div><div class="value">{uptime_str}</div></div>
      <div class="box"><div class="label">Total Requests</div><div class="value">{REQUEST_COUNT}</div></div>
      <div class="box"><div class="label">Architecture</div><div class="value">3 Files (py, html, db)</div></div>
      <div class="box"><div class="label">Database BLOB</div><div class="value">{AUDIO_LEN // 1024} KB</div></div>
    </div>
    <div class="actions">
      <a href="/" class="btn btn-primary">Open 3D Rose Experience</a>
      <a href="/health" class="btn btn-secondary">JSON Health Check</a>
    </div>
  </div>
</body>
</html>"""

class RoseHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep Render logs clean
        pass

    def send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors()
        self.end_headers()

    def do_HEAD(self):
        self.handle_get(head_only=True)

    def do_GET(self):
        self.handle_get(head_only=False)

    def handle_get(self, head_only=False):
        global REQUEST_COUNT
        with request_lock:
            REQUEST_COUNT += 1

        path = self.path.split("?")[0].rstrip("/")
        if path == "":
            path = "/"

        # 1. Health Check Endpoint (/health, /healthz, /ping)
        if path in ("/health", "/healthz", "/ping", "/api/health"):
            uptime_sec = round(time.time() - START_TIME, 2)
            payload = json.dumps({
                "status": "ok",
                "service": "ascii-rose-envelope",
                "architecture": "3-files-pure",
                "uptimeSeconds": uptime_sec,
                "uptimeHuman": format_uptime(uptime_sec),
                "requests": REQUEST_COUNT,
                "database": "data.db",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "message": "Service is healthy and active"
            }).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_cors()
            self.end_headers()
            if not head_only:
                self.wfile.write(payload)
            return

        # 2. Status Dashboard Endpoint (/status, /monitor)
        if path in ("/status", "/monitor"):
            content = get_status_html().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-cache")
            self.send_cors()
            self.end_headers()
            if not head_only:
                self.wfile.write(content)
            return

        # 3. Audio Streaming from data.db (/song.mp3, /audio)
        if path in ("/song.mp3", "/audio", "/song"):
            range_header = self.headers.get("Range")
            total = AUDIO_LEN

            if range_header and range_header.startswith("bytes="):
                # HTTP 206 Partial Content for smooth audio seeking & iOS support
                try:
                    parts = range_header.replace("bytes=", "").split("-")
                    start = int(parts[0]) if parts[0] else 0
                    end = int(parts[1]) if parts[1] else total - 1
                    if start >= total or end >= total or start > end:
                        self.send_response(416)
                        self.send_header("Content-Range", f"bytes */{total}")
                        self.end_headers()
                        return

                    chunk = AUDIO_BYTES[start:end + 1]
                    self.send_response(206)
                    self.send_header("Content-Type", AUDIO_MIME)
                    self.send_header("Content-Range", f"bytes {start}-{end}/{total}")
                    self.send_header("Accept-Ranges", "bytes")
                    self.send_header("Content-Length", str(len(chunk)))
                    self.send_header("Cache-Control", "public, max-age=86400")
                    self.send_cors()
                    self.end_headers()
                    if not head_only:
                        self.wfile.write(chunk)
                    return
                except Exception as e:
                    print(f"[Range Error] {e}")

            # Standard 200 delivery of full audio
            self.send_response(200)
            self.send_header("Content-Type", AUDIO_MIME)
            self.send_header("Content-Length", str(total))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Cache-Control", "public, max-age=86400")
            self.send_cors()
            self.end_headers()
            if not head_only:
                self.wfile.write(AUDIO_BYTES)
            return

        # 4. Frontend Experience (index.html)
        if path in ("/", "/index.html"):
            if os.path.exists(HTML_PATH):
                with open(HTML_PATH, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Cache-Control", "no-cache")
                self.send_cors()
                self.end_headers()
                if not head_only:
                    self.wfile.write(content)
                return

        # 404 Fallback: redirect to root
        self.send_response(302)
        self.send_header("Location", "/")
        self.end_headers()

def start_self_ping():
    self_url = os.environ.get("RENDER_EXTERNAL_URL") or os.environ.get("SELF_URL")
    if self_url:
        target = f"{self_url.rstrip('/')}/health"
        print(f"[Keep-Alive] Configured for {target}")
        def ping_loop():
            while True:
                time.sleep(600) # Every 10 minutes (Render sleeps at 15m)
                try:
                    req = urllib.request.Request(target, headers={"User-Agent": "Render-KeepAlive/1.0"})
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        print(f"[Keep-Alive] Ping {target} -> HTTP {resp.status}")
                except Exception as e:
                    print(f"[Keep-Alive] Ping failed: {e}")
        t = threading.Thread(target=ping_loop, daemon=True)
        t.start()

if __name__ == "__main__":
    print("=" * 60)
    print(f"[Server] Starting 3-File ASCII Rose Service on http://{HOST}:{PORT}")
    print(f"[Server] Frontend:  http://{HOST}:{PORT}/")
    print(f"[Server] Health:    http://{HOST}:{PORT}/health")
    print(f"[Server] Status:    http://{HOST}:{PORT}/status")
    print("=" * 60)
    start_self_ping()
    server = HTTPServer((HOST, PORT), RoseHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server] Shutting down cleanly.")
        server.server_close()
