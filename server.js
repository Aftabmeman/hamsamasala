const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // 1. Strip query string and hash
    const cleanUrl = req.url.split('?')[0].split('#')[0];
    let decodedPath = '';
    try {
        decodedPath = decodeURIComponent(cleanUrl);
    } catch (e) {
        decodedPath = cleanUrl;
    }

    // Default root to index.html
    let relativePath = (decodedPath === '/' || decodedPath === '') ? '/index.html' : decodedPath;

    // Prevent directory traversal
    let safePath = path.normalize(path.join(ROOT_DIR, relativePath));
    if (!safePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden');
    }

    // Check if path exists
    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Check if adding .html helps (e.g. /spices -> /spices.html)
            const htmlPath = safePath + '.html';
            if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
                safePath = htmlPath;
            } else {
                // If it was looking for a static asset with an extension, return 404 (NEVER return HTML for CSS/JS/images)
                const ext = path.extname(safePath).toLowerCase();
                if (ext && ext !== '.html') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end(`404 Not Found: ${cleanUrl}`);
                }
                // Otherwise SPA fallback to index.html
                safePath = path.join(ROOT_DIR, 'index.html');
            }
        }

        const extname = path.extname(safePath).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        // Support video range requests for smooth .mp4 streaming
        if (extname === '.mp4') {
            fs.stat(safePath, (statErr, videoStats) => {
                if (statErr) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end('Video not found');
                }
                const range = req.headers.range;
                const total = videoStats.size;

                if (range) {
                    const parts = range.replace(/bytes=/, '').split('-');
                    const start = parseInt(parts[0], 10);
                    const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
                    const chunksize = (end - start) + 1;
                    const file = fs.createReadStream(safePath, { start, end });

                    res.writeHead(206, {
                        'Content-Range': `bytes ${start}-${end}/${total}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/mp4'
                    });
                    file.pipe(res);
                } else {
                    res.writeHead(200, {
                        'Content-Length': total,
                        'Content-Type': 'video/mp4',
                        'Accept-Ranges': 'bytes'
                    });
                    fs.createReadStream(safePath).pipe(res);
                }
            });
            return;
        }

        // Standard static file serving
        fs.readFile(safePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('500 Internal Server Error');
            }
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        });
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
