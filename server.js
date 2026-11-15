/**
 * FOR YOU — Production Web Server with Health Check & Keep-Alive for Render.com
 * Features:
 * - High-performance static file serving (HTML, JS, CSS, MP3 with Range streaming)
 * - Dedicated health check endpoints: /health, /healthz, /ping, /api/health
 * - Sleek status & monitoring dashboard at /status
 * - Automatic self-ping keep-alive for Render free tier (prevents sleep after 15m)
 * - Zero external dependencies (pure Node.js http/fs/path)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';
const startTime = Date.now();

// Static MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

// Formats uptime in human-readable format
function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

// Generate sleek status dashboard HTML
function getStatusDashboardHTML() {
  const uptimeSeconds = (Date.now() - startTime) / 1000;
  const mem = process.memoryUsage();
  const memMB = (mem.heapUsed / 1024 / 1024).toFixed(1);
  const nowISO = new Date().toISOString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Health & Uptime Monitor</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #060813;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 32px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #1e293b;
    }
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.3px;
    }
    .badge {
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
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-box {
      background: #1e293b;
      border-radius: 10px;
      padding: 14px;
    }
    .stat-label {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 16px;
      font-weight: 600;
      color: #f1f5f9;
      font-family: monospace;
    }
    .info {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 24px;
      background: rgba(30, 41, 59, 0.5);
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid #ff1744;
    }
    .actions {
      display: flex;
      gap: 12px;
    }
    .btn {
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
    }
    .btn-primary {
      background: #ff1744;
      color: #fff;
    }
    .btn-primary:hover {
      background: #d50000;
    }
    .btn-secondary {
      background: #334155;
      color: #e2e8f0;
    }
    .btn-secondary:hover {
      background: #475569;
    }
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
        <div class="stat-value">${formatUptime(uptimeSeconds)}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Memory</div>
        <div class="stat-value">${memMB} MB</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Health Check</div>
        <div class="stat-value">HTTP 200 OK</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Environment</div>
        <div class="stat-value">Render Web</div>
      </div>
    </div>
    <div class="info">
      <strong>Keep-Alive Active:</strong> Ping endpoint <code>/health</code> is ready for UptimeRobot, Cron-job.org, or Render internal monitoring.
    </div>
    <div class="actions">
      <a href="/" class="btn btn-primary">Open ASCII Rose</a>
      <a href="/health" class="btn btn-secondary">JSON Health</a>
    </div>
  </div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 1. Health check endpoints (Returns HTTP 200 JSON)
  if (['/health', '/healthz', '/ping', '/api/health'].includes(pathname)) {
    const uptimeSeconds = (Date.now() - startTime) / 1000;
    const mem = process.memoryUsage();
    const data = {
      status: 'ok',
      service: 'ascii-rose-envelope',
      uptimeSeconds: Math.floor(uptimeSeconds),
      uptimeHuman: formatUptime(uptimeSeconds),
      timestamp: new Date().toISOString(),
      memoryMB: +(mem.heapUsed / 1024 / 1024).toFixed(2),
      message: 'Service is healthy and active'
    };

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data, null, 2));
    return;
  }

  // 2. Status dashboard page (/status, /monitor)
  if (['/status', '/monitor', '/health-ui'].includes(pathname)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(getStatusDashboardHTML());
    return;
  }

  // 3. Static file handling
  let safePath = pathname === '/' ? '/index.html' : pathname;
  // Prevent directory traversal
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support HTTP Range requests (crucial for smooth audio streaming on iOS/Safari/Chrome)
    const range = req.headers.range;
    if (range && ext === '.mp3') {
      const total = stats.size;
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

      if (start >= total || end >= total || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${total}` });
        res.end();
        return;
      }

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': (end - start) + 1,
        'Content-Type': contentType
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
      return;
    }

    // Standard file delivery
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': ext === '.mp3' ? 'public, max-age=86400' : 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[Server] Running at http://${HOST}:${PORT}`);
  console.log(`[Server] Health Check available at http://${HOST}:${PORT}/health`);
  console.log(`[Server] Status Dashboard available at http://${HOST}:${PORT}/status`);

  // Automatic Self-Ping Keep-Alive for Render
  // Render provides RENDER_EXTERNAL_URL env var on web services
  const selfUrl = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;
  if (selfUrl) {
    console.log(`[Keep-Alive] Configured for ${selfUrl}/health`);
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes (Render sleeps at 15m)

    setInterval(() => {
      const target = `${selfUrl.replace(/\/$/, '')}/health`;
      const client = target.startsWith('https') ? require('https') : require('http');
      client.get(target, (res) => {
        console.log(`[Keep-Alive] Ping ${target} -> HTTP ${res.statusCode}`);
      }).on('error', (err) => {
        console.error(`[Keep-Alive] Ping failed: ${err.message}`);
      });
    }, PING_INTERVAL);
  }
});
