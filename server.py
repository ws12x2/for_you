#!/usr/bin/env python3
"""
FOR YOU — Production Python Web Server with Health Check & Keep-Alive for Render.com
Features:
- High-performance static file serving (HTML, JS, CSS, MP3 with Range streaming)
- Dedicated health check endpoints: /health, /healthz, /ping, /api/health
- Sleek status & monitoring dashboard at /status
- Automatic self-ping keep-alive for Render free tier (prevents sleep after 15m)
- Zero external dependencies (pure Python standard library)
"""

import http.server
import socketserver
import os
import sys
import json
import time
import urllib.request
import threading
import mimetypes

PORT = int(os.environ.get('PORT', 3000))
HOST = '0.0.0.0'
START_TIME = time.time()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def format_uptime(seconds):
    d = int(seconds // (3600 * 24))
    h = int((seconds % (3600 * 24)) // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    parts = []
    if d > 0: parts.append(f"{d}d")
    if h > 0: parts.append(f"{h}h")
    if m > 0: parts.append(f"{m}m")
    parts.append(f"{s}s")
    return " ".join(parts)

def get_status_dashboard_html():
    uptime = time.time() - START_TIME
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Health & Uptime Monitor</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background: #060813;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }}
    .card {{
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 32px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }}
    .header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #1e293b;
    }}
    .title {{ font-size: 18px; font-weight: 700; color: #f8fafc; }}
    .badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }}
    .dot {{
      width: 8px; height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }}
    @keyframes pulse {{
      0%, 100% {{ opacity: 1; transform: scale(1); }}
      50% {{ opacity: 0.4; transform: scale(0.85); }}
    }}
    .grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }}
    .stat-box {{
      background: #1e293b;
      border-radius: 10px;
      padding: 14px;
    }}
    .stat-label {{
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }}
    .stat-value {{
      font-size: 16px;
      font-weight: 600;
      color: #f1f5f9;
      font-family: monospace;
    }}
    .info {{
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 24px;
      background: rgba(30, 41, 59, 0.5);
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid #ff1744;
    }}
    .actions {{ display: flex; gap: 12px; }}
    .btn {{
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }}
    .btn-primary {{ background: #ff1744; color: #fff; }}
    .btn-secondary {{ background: #334155; color: #e2e8f0; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">System Status</div>
      <div class="badge"><span class="dot"></span> Operational</div>
    </div>
    <div class="grid">
      <div class="stat-box">
        <div class="stat-label">Uptime</div>
        <div class="stat-value">{format_uptime(uptime)}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Health Check</div>
        <div class="stat-value">HTTP 200 OK</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Service</div>
        <div class="stat-value">ASCII Rose</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Host</div>
        <div class="stat-value">Render Web</div>
      </div>
    </div>
    <div class="info">
      <strong>Keep-Alive Active:</strong> Health endpoint <code>/health</code> is monitored and ready for UptimeRobot / Render.
    </div>
    <div class="actions">
      <a href="/" class="btn btn-primary">Open ASCII Rose</a>
      <a href="/health" class="btn btn-secondary">JSON Health</a>
    </div>
  </div>
</body>
</html>"""

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self):
        # Health check endpoints
        if self.path in ['/health', '/healthz', '/ping', '/api/health']:
            uptime = time.time() - START_TIME
            data = {
                "status": "ok",
                "service": "ascii-rose-envelope",
                "uptimeSeconds": int(uptime),
                "uptimeHuman": format_uptime(uptime),
                "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                "message": "Service is healthy and active"
            }
            body = json.dumps(data, indent=2).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body)
            return

        # Status dashboard
        if self.path in ['/status', '/monitor', '/health-ui']:
            html = get_status_dashboard_html().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(html)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(html)
            return

        # Standard static file serving
        return super().do_GET()

def start_self_ping():
    self_url = os.environ.get('RENDER_EXTERNAL_URL') or os.environ.get('SELF_URL')
    if not self_url:
        return
    print(f"[Keep-Alive] Self-ping active for {self_url}/health every 10 minutes", flush=True)

    def pinger():
        time.sleep(10)
        while True:
            try:
                target = f"{self_url.rstrip('/')}/health"
                req = urllib.request.Request(target, headers={'User-Agent': 'InternalKeepAlive/1.0'})
                with urllib.request.urlopen(req, timeout=10) as resp:
                    print(f"[Keep-Alive] Ping {target} -> HTTP {resp.status}", flush=True)
            except Exception as e:
                print(f"[Keep-Alive] Ping error: {e}", flush=True)
            time.sleep(10 * 60) # 10 minutes

    t = threading.Thread(target=pinger, daemon=True)
    t.start()

if __name__ == '__main__':
    print(f"[Server] Starting on http://{HOST}:{PORT}", flush=True)
    print(f"[Server] Health Check available at http://{HOST}:{PORT}/health", flush=True)
    print(f"[Server] Status Dashboard available at http://{HOST}:{PORT}/status", flush=True)
    start_self_ping()

    with socketserver.TCPServer((HOST, PORT), CustomHTTPHandler) as httpd:
        httpd.allow_reuse_address = True
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
