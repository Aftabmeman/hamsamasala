const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);
const ORDERS_FILE = path.join(ROOT_DIR, 'orders.json');

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

// Helper: Read orders from JSON file
function readOrders() {
    try {
        if (!fs.existsSync(ORDERS_FILE)) {
            fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
            return [];
        }
        const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
        return JSON.parse(raw) || [];
    } catch (err) {
        console.error('[Orders DB] Read error:', err);
        return [];
    }
}

// Helper: Save orders to JSON file
function saveOrders(orders) {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('[Orders DB] Save error:', err);
        return false;
    }
}

// Helper: Sanitize order for delivery portal or public viewing (NEVER expose deliveryOtp)
function sanitizeOrder(order) {
    if (!order) return null;
    return {
        orderId: order.orderId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        pincode: order.pincode,
        city: order.city || '',
        state: order.state || '',
        items: order.items || [],
        subtotal: order.subtotal || 0,
        discount: order.discount || 0,
        totalAmount: order.totalAmount || 0,
        paymentMode: order.paymentMode || 'COD',
        status: order.status || 'CONFIRMED',
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt || null
    };
}

// Helper: Parse incoming JSON body
function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 1e6) { // Max 1MB
                req.connection.destroy();
                reject(new Error('Request payload too large'));
            }
        });
        req.on('end', () => {
            try {
                const parsed = body ? JSON.parse(body) : {};
                resolve(parsed);
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', err => reject(err));
    });
}

const server = http.createServer(async (req, res) => {
    // 1. Strip query string and hash
    const urlParts = req.url.split('?');
    const cleanUrl = urlParts[0].split('#')[0];
    const queryString = urlParts[1] || '';
    const queryParams = new URLSearchParams(queryString);

    let decodedPath = '';
    try {
        decodedPath = decodeURIComponent(cleanUrl);
    } catch (e) {
        decodedPath = cleanUrl;
    }

    // =========================================================================
    // API ROUTES FOR ORDERS & DELIVERY OTP VERIFICATION
    // =========================================================================

    // 1. Create Order (POST /api/orders)
    if (req.method === 'POST' && (decodedPath === '/api/orders' || decodedPath === '/api/orders/')) {
        try {
            const data = await parseJsonBody(req);
            const orders = readOrders();

            // Generate clean public orderId (e.g. HM-1050)
            let orderNum = Math.floor(1000 + Math.random() * 9000);
            let candidateId = `HM-${orderNum}`;
            while (orders.some(o => o.orderId === candidateId)) {
                orderNum = Math.floor(1000 + Math.random() * 9000);
                candidateId = `HM-${orderNum}`;
            }

            // Generate 4-digit secret delivery OTP (e.g. 5921)
            const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));

            const newOrder = {
                orderId: data.orderId || candidateId,
                deliveryOtp: deliveryOtp,
                customerName: data.customerName || data.name || 'Royal Patron',
                customerPhone: data.customerPhone || data.phone || '',
                shippingAddress: data.shippingAddress || data.address || '',
                pincode: data.pincode || '',
                city: data.city || '',
                state: data.state || '',
                items: Array.isArray(data.items) ? data.items : [],
                subtotal: Number(data.subtotal) || 0,
                discount: Number(data.discount) || 0,
                totalAmount: Number(data.totalAmount) || Number(data.total) || 0,
                paymentMode: data.paymentMode || 'Cash on Delivery (COD)',
                status: 'CONFIRMED',
                createdAt: new Date().toISOString(),
                deliveredAt: null
            };

            orders.unshift(newOrder);
            saveOrders(orders);

            // Return order info INCLUDING deliveryOtp to the ordering customer
            res.writeHead(201, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            return res.end(JSON.stringify({
                success: true,
                message: 'Order created successfully',
                orderId: newOrder.orderId,
                deliveryOtp: newOrder.deliveryOtp,
                order: newOrder
            }));
        } catch (err) {
            console.error('[API] /api/orders error:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Invalid order request payload' }));
        }
    }

    // 2. Fetch Order(s) (GET /api/orders?id=HM-1050 or GET /api/orders)
    if (req.method === 'GET' && (decodedPath === '/api/orders' || decodedPath === '/api/orders/')) {
        const orderIdParam = queryParams.get('id') || queryParams.get('orderId');
        const orders = readOrders();

        if (orderIdParam) {
            const cleanId = orderIdParam.trim().replace(/^#/, '').toUpperCase();
            const found = orders.find(o => o.orderId.toUpperCase().replace(/^#/, '') === cleanId);

            if (!found) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${cleanId} not found` }));
            }

            // CRITICAL: NEVER expose deliveryOtp to delivery agent lookup
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                order: sanitizeOrder(found)
            }));
        } else {
            // Return list of sanitized recent orders
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                orders: orders.map(sanitizeOrder)
            }));
        }
    }

    // 3. Verify Delivery OTP (POST /api/orders/verify-otp)
    if (req.method === 'POST' && (decodedPath === '/api/orders/verify-otp' || decodedPath === '/api/orders/verify-otp/')) {
        try {
            const data = await parseJsonBody(req);
            const rawId = (data.orderId || '').trim().replace(/^#/, '').toUpperCase();
            const inputOtp = String(data.otp || '').trim();

            if (!rawId || !inputOtp) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Order ID and 4-digit OTP are required.' }));
            }

            const orders = readOrders();
            const orderIndex = orders.findIndex(o => o.orderId.toUpperCase().replace(/^#/, '') === rawId);

            if (orderIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${rawId} not found in database.` }));
            }

            const order = orders[orderIndex];

            // If already delivered, inform agent gracefully
            if (order.status === 'DELIVERED') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    alreadyDelivered: true,
                    message: `Order #${order.orderId} was already marked as DELIVERED on ${new Date(order.deliveredAt).toLocaleString('en-IN')}`,
                    deliveredAt: order.deliveredAt,
                    order: sanitizeOrder(order)
                }));
            }

            // Validate secret OTP
            if (String(order.deliveryOtp).trim() === inputOtp) {
                order.status = 'DELIVERED';
                order.deliveredAt = new Date().toISOString();
                saveOrders(orders);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    message: `Delivery verified successfully! Order #${order.orderId} is marked as DELIVERED.`,
                    deliveredAt: order.deliveredAt,
                    order: sanitizeOrder(order)
                }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    message: 'Incorrect Delivery OTP! Please ask the customer to share the 4-digit PIN from their screen or My Orders.'
                }));
            }
        } catch (err) {
            console.error('[API] /api/orders/verify-otp error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Internal server error verifying OTP' }));
        }
    }

    // =========================================================================
    // ADMIN DASHBOARD API ROUTES
    // =========================================================================

    // Admin Login (POST /api/admin/login)
    if (req.method === 'POST' && (decodedPath === '/api/admin/login' || decodedPath === '/api/admin/login/')) {
        try {
            const data = await parseJsonBody(req);
            const pass = (data.password || '').trim();
            const validPasswords = ['hamsa@admin', 'admin123', 'hamsa123', process.env.ADMIN_PASSWORD].filter(Boolean);

            if (validPasswords.includes(pass)) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    token: 'hamsa_admin_authenticated_session_2026',
                    message: 'Admin authentication successful'
                }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Invalid Admin Password' }));
            }
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Server error during login' }));
        }
    }

    // Admin Fetch All Orders & Analytics (GET /api/admin/orders)
    if (req.method === 'GET' && (decodedPath === '/api/admin/orders' || decodedPath === '/api/admin/orders/')) {
        const orders = readOrders();
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
        const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
        const pendingOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            success: true,
            stats: {
                totalRevenue,
                totalOrders: orders.length,
                pendingCount: pendingOrders.length,
                deliveredCount: deliveredOrders.length
            },
            orders // Contains full details + deliveryOtp for store owner control
        }));
    }

    // Admin Update Status (POST /api/admin/orders/update-status)
    if (req.method === 'POST' && (decodedPath === '/api/admin/orders/update-status' || decodedPath === '/api/admin/orders/update-status/')) {
        try {
            const data = await parseJsonBody(req);
            const targetId = (data.orderId || '').trim().replace(/^#/, '').toUpperCase();
            const newStatus = (data.status || '').trim().toUpperCase();

            if (!targetId || !newStatus) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'orderId and status are required' }));
            }

            const orders = readOrders();
            const order = orders.find(o => o.orderId.toUpperCase().replace(/^#/, '') === targetId);

            if (!order) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${targetId} not found` }));
            }

            order.status = newStatus;
            if (newStatus === 'DELIVERED') {
                order.deliveredAt = new Date().toISOString();
            } else if (newStatus === 'CONFIRMED' || newStatus === 'PENDING_DELIVERY') {
                order.deliveredAt = null;
            }

            saveOrders(orders);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                message: `Order #${order.orderId} status updated to ${newStatus}`,
                order
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Server error updating status' }));
        }
    }

    // Admin Delete Order (POST /api/admin/orders/delete)
    if (req.method === 'POST' && (decodedPath === '/api/admin/orders/delete' || decodedPath === '/api/admin/orders/delete/')) {
        try {
            const data = await parseJsonBody(req);
            const targetId = (data.orderId || '').trim().replace(/^#/, '').toUpperCase();

            let orders = readOrders();
            const initialLength = orders.length;
            orders = orders.filter(o => o.orderId.toUpperCase().replace(/^#/, '') !== targetId);

            if (orders.length === initialLength) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${targetId} not found` }));
            }

            saveOrders(orders);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, message: `Order #${targetId} deleted successfully` }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Server error deleting order' }));
        }
    }

    // Direct shortcut routes for admin portal
    if (decodedPath === '/admin' || decodedPath === '/admin/') {
        decodedPath = '/admin.html';
    }

    // Direct shortcut routes for delivery portal
    if (decodedPath === '/delivery' || decodedPath === '/delivery/') {
        decodedPath = '/delivery.html';
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
                // If looking for a static asset with an extension, return 404
                const ext = path.extname(safePath).toLowerCase();
                if (ext && ext !== '.html') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end(`404 Not Found: ${cleanUrl}`);
                }
                // Otherwise fallback to index.html
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
    console.log(`Delivery portal available at http://localhost:${PORT}/delivery`);
});
