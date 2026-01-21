const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 80;

// MIME types corretos
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Remover query string
  let filePath = req.url.split('?')[0];
  
  // Servir index.html para rotas SPA
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Caminho completo do arquivo
  const fullPath = path.join(__dirname, 'dist', filePath);
  
  // Verificar se o arquivo existe
  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Se não for um arquivo, servir index.html (SPA routing)
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      });
      return;
    }
    
    // Determinar MIME type
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Ler e servir o arquivo
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
  console.log(`📂 Serving files from: ${path.join(__dirname, 'dist')}`);
});
