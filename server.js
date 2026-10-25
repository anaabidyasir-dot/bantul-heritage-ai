/**
 * server.js — Local development server untuk Bantul Heritage AI
 * Menjalankan static file server + proxy Gemini API (atasi CORS)
 *
 * Cara pakai:
 *   node server.js
 * Kemudian buka: http://localhost:5500
 */

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

const PORT = 5500;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname  = parsedUrl.pathname;

  // ---- CORS headers untuk semua response ----
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ---- PROXY: /api/gemini → Google Gemini API ----
  if (pathname.startsWith('/api/gemini')) {
    // Ambil API key dan model dari query string
    const apiKey = parsedUrl.query.key;
    const model  = parsedUrl.query.model || 'gemini-1.5-flash';

    if (!apiKey) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'API key tidak diberikan.' } }));
      return;
    }

    // Kumpulkan body request
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const geminiPath = `/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path:     geminiPath,
        method:   'POST',
        headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', chunk => data += chunk);
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(data);
        });
      });

      proxyReq.on('error', (e) => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'Proxy error: ' + e.message } }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  // ---- STATIC FILES ----
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, filePath);

  // Keamanan: pastikan path tidak keluar dari direktori proyek
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`File tidak ditemukan: ${pathname}`);
      return;
    }
    const ext      = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  🏛️  Bantul Heritage AI — Local Server');
  console.log('  ─────────────────────────────────────');
  console.log(`  Buka di browser: http://localhost:${PORT}`);
  console.log('');
  console.log('  Tekan Ctrl+C untuk menghentikan server.');
  console.log('');
});
