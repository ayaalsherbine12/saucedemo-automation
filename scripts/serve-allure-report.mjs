import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
};

const reportDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'allure-report');

if (!fs.existsSync(path.join(reportDir, 'index.html'))) {
  console.error('Missing allure-report/index.html. Run: npm run allure:generate');
  process.exit(1);
}

const host = process.env.ALLURE_SHARE_HOST ?? '0.0.0.0';
const port = Number(process.env.ALLURE_SHARE_PORT ?? 8080);

function resolveFile(urlPath) {
  const pathname = decodeURIComponent(urlPath).split('?')[0];
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  const file = path.resolve(reportDir, relative);
  if (!file.startsWith(reportDir)) {
    return null;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    return path.join(file, 'index.html');
  }
  return file;
}

function browseUrls() {
  const urls = [`http://127.0.0.1:${port}`];
  for (const interfaces of Object.values(os.networkInterfaces())) {
    if (!interfaces) continue;
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        urls.push(`http://${iface.address}:${port}`);
      }
    }
  }
  return urls;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(new URL(req.url ?? '/', 'http://localhost').pathname);
  if (!file) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`Serving static Allure report: ${reportDir}`);
  console.log('Share one of these URLs (same Wi‑Fi / LAN):');
  for (const url of browseUrls()) {
    console.log(`  ${url}`);
  }
  console.log('\nTo share offline, zip the allure-report folder and send the archive.');
  console.log('Press Ctrl+C to stop.');
});