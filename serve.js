// Minimal static file server for local testing.
// Camera access (getUserMedia) requires http://localhost or https:// — it
// will NOT work if you just double-click index.html (file:// is blocked).
//
// Usage:  node serve.js [port]      (default port 8080)
// Then open http://localhost:8080 in a browser.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.argv[2] || 8080);

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.gif': 'image/gif'
};

http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);
  if (!filePath.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + reqPath); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log('Serving ' + root + ' at http://localhost:' + port));
