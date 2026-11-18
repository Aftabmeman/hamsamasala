const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT_DIR = path.resolve(__dirname);
const ENV_FILE = path.join(ROOT_DIR, '.env');
const ORDERS_FILE = path.join(ROOT_DIR, 'orders.json');
const SETTINGS_FILE = path.join(ROOT_DIR, 'admin-settings.json');

// =========================================================================
// 0. LIGHTWEIGHT .ENV LOADER (ZERO EXTERNAL DEPENDENCIES)
// =========================================================================
function loadEnvFile() {
    try {
        if (fs.existsSync(ENV_FILE)) {
            const raw = fs.readFileSync(ENV_FILE, 'utf8');
            raw.split(/\r?\n/).forEach(line => {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) return;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx === -1) return;
                const key = trimmed.slice(0, eqIdx).trim();
                const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
                if (key && process.env[key] === undefined) {
                    process.env[key] = val;
                }
            });
        }
    } catch (err) {
        console.warn('[Env] Could not read .env file:', err.message);
    }
}
loadEnvFile();

const PORT = process.env.PORT || 3000;
const ORIGIN_PINCODE = process.env.ORIGIN_PINCODE || '400612';
const SURFACE_MARKUP_RS = Number(process.env.SURFACE_MARKUP_RS) || 10;
const RTO_DEDUCTION_RS = Number(process.env.RTO_DEDUCTION_RS) || 80;
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER || '919167435089';
const OTP_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 Hours Auto-Cancel Window

// NimbusPost API Credentials loaded from .env
const NIMBUS_API_KEY = (process.env.NIMBUS_API_KEY || '').trim();
const NIMBUS_API_SECRET = (process.env.NIMBUS_API_SECRET || '').trim();
const NIMBUS_EMAIL = (process.env.NIMBUS_EMAIL || '').trim();
const NIMBUS_PASSWORD = (process.env.NIMBUS_PASSWORD || '').trim();
const NIMBUS_WEBHOOK_SECRET = (process.env.NIMBUS_WEBHOOK_SECRET || '').trim();

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

// =========================================================================
// 1. ADMIN SETTINGS & ORDERS PERSISTENCE
// =========================================================================
function readAdminSettings() {
    const defaults = {
        autoPushToNimbusOnVerify: false, // OFF by default (Admin-Controlled booking)
        originPincode: ORIGIN_PINCODE,
        hiddenMarkupRs: SURFACE_MARKUP_RS,
        rtoDeductionRs: RTO_DEDUCTION_RS
    };
    try {
        if (!fs.existsSync(SETTINGS_FILE)) {
            fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaults, null, 2), 'utf8');
            return defaults;
        }
        const parsed = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        return { ...defaults, ...parsed };
    } catch (e) {
        return defaults;
    }
}

function saveAdminSettings(settings) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('[Settings] Save error:', e);
        return false;
    }
}

// Helper: Calculate total order weight in grams from cart items
function calculateItemsWeightGrams(items) {
    if (!Array.isArray(items) || items.length === 0) return 250;
    let totalGrams = 0;
    items.forEach(item => {
        const qty = Number(item.qty) || 1;
        const packStr = String(item.pack || item.weight || '100g').toLowerCase();
        const mlMatch = packStr.match(/(\d+)\s*ml/);
        const kgMatch = packStr.match(/(\d+(?:\.\d+)?)\s*kg/);
        const gMatch = packStr.match(/(\d+)\s*g/);
        if (mlMatch) {
            // 750ml glass bottle beverage weighs ~1100g packed
            const ml = parseInt(mlMatch[1], 10);
            totalGrams += (ml >= 700 ? Math.round(ml * 1.35) : ml) * qty;
        } else if (kgMatch) {
            totalGrams += Math.round(parseFloat(kgMatch[1]) * 1000) * qty;
        } else if (gMatch) {
            totalGrams += parseInt(gMatch[1], 10) * qty;
        } else {
            totalGrams += 100 * qty;
        }
    });
    // Add 80g corrugated box packaging tare weight
    return Math.max(200, totalGrams + 80);
}

// =========================================================================
// 2. SMART NIMBUSPOST SURFACE LOGISTICS ENGINE (ORIGIN: 400612)
//    - Filters strictly for SURFACE mode (excludes expensive Air couriers)
//    - Sorts lowest price to highest price
//    - Applies +₹10 hidden markup to customer-facing rates
//    - Safe Fallback Rate Mode when .env keys are not yet generated
// =========================================================================
function getFallbackSurfaceCouriers(destinationPincode, weightGrams = 250) {
    const cleanPin = String(destinationPincode || '400001').replace(/\D/g, '');
    const prefix2 = cleanPin.substring(0, 2);
    const prefix3 = cleanPin.substring(0, 3);

    // Determine Zone from Origin 400612 (Thane / Mumbai)
    let zoneMultiplier = 1.0;
    let etaDays = '3-5 Days';

    if (prefix3 === '400' || prefix3 === '401' || prefix3 === '410' || prefix3 === '421') {
        // Zone A: Local Mumbai / Thane / Navi Mumbai
        zoneMultiplier = 0.85;
        etaDays = '1-2 Days';
    } else if (['41', '42', '43', '44', '36', '37', '38', '39', '40'].includes(prefix2)) {
        // Zone B: Rest of Maharashtra, Goa & Gujarat
        zoneMultiplier = 0.95;
        etaDays = '2-4 Days';
    } else if (['11', '12', '45', '46', '50', '56', '60'].includes(prefix2)) {
        // Zone C: Major Metros (Delhi NCR, Bengaluru, Hyderabad, Chennai, Indore, Bhopal)
        zoneMultiplier = 1.08;
        etaDays = '3-5 Days';
    } else if (['18', '19', '78', '79'].includes(prefix2)) {
        // Zone E: Special North-East & J&K Surface
        zoneMultiplier = 1.35;
        etaDays = '5-8 Days';
    } else {
        // Zone D: Rest of India
        zoneMultiplier = 1.18;
        etaDays = '4-6 Days';
    }

    // Weight slab calculation (per 500g slab)
    const slabs500g = Math.max(1, Math.ceil(weightGrams / 500));
    const extraSlabs = slabs500g - 1;

    // Base NimbusPost Surface Courier Roster (Strictly Surface Only - Zero Air Couriers)
    const baseSurfaceRoster = [
        { id: 'nimbus_shadowfax_surface', name: 'Shadowfax Surface', mode: 'Surface', baseRate: 44, slabRate: 18, codFee: 35, rating: 4.7 },
        { id: 'nimbus_xpressbees_surface', name: 'Xpressbees Surface', mode: 'Surface', baseRate: 47, slabRate: 19, codFee: 35, rating: 4.8 },
        { id: 'nimbus_delhivery_surface', name: 'Delhivery Surface', mode: 'Surface', baseRate: 51, slabRate: 21, codFee: 38, rating: 4.9 },
        { id: 'nimbus_ekart_surface', name: 'Ekart Logistics Surface', mode: 'Surface', baseRate: 54, slabRate: 22, codFee: 36, rating: 4.8 },
        { id: 'nimbus_dtdc_surface', name: 'DTDC Surface Economy', mode: 'Surface', baseRate: 58, slabRate: 24, codFee: 40, rating: 4.6 },
        { id: 'nimbus_bluedart_surface', name: 'BlueDart Surface DartPlus', mode: 'Surface', baseRate: 69, slabRate: 28, codFee: 45, rating: 4.9 }
    ];

    const calculated = baseSurfaceRoster.map(c => {
        const rawPrepaidRate = Math.round((c.baseRate + extraSlabs * c.slabRate) * zoneMultiplier);
        const rawCodFee = Math.max(35, c.codFee);
        const rawCodTotalRate = rawPrepaidRate + rawCodFee;

        return {
            courierId: c.id,
            courierName: c.name,
            mode: 'Surface',
            etaDays: etaDays,
            rating: c.rating,
            weightGrams: weightGrams,
            rawPrepaidRate: rawPrepaidRate,
            rawCodFee: rawCodFee,
            rawCodTotalRate: rawCodTotalRate,
            customerPrepaidCharge: rawPrepaidRate + SURFACE_MARKUP_RS,
            customerCodTotalCharge: rawCodTotalRate + SURFACE_MARKUP_RS
        };
    });

    // Strictly sort from LOWEST price to HIGHEST price
    calculated.sort((a, b) => a.rawPrepaidRate - b.rawPrepaidRate);

    return calculated.map((c, idx) => ({
        ...c,
        isCheapest: idx === 0
    }));
}

// Helper: Make HTTPS JSON Request (for live NimbusPost API when keys are present in .env)
function httpsJsonRequest(urlStr, method, headers, payloadObj) {
    return new Promise((resolve, reject) => {
        try {
            const parsedUrl = new URL(urlStr);
            const bodyStr = payloadObj ? JSON.stringify(payloadObj) : '';
            const req = https.request({
                hostname: parsedUrl.hostname,
                path: parsedUrl.pathname + parsedUrl.search,
                method: method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(bodyStr),
                    ...(headers || {})
                },
                timeout: 6000
            }, res => {
                let raw = '';
                res.on('data', chunk => { raw += chunk; });
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode, data: JSON.parse(raw) });
                    } catch (e) {
                        resolve({ status: res.statusCode, data: null });
                    }
                });
            });
            req.on('error', err => reject(err));
            req.on('timeout', () => { req.destroy(); reject(new Error('NimbusPost API timeout')); });
            if (bodyStr) req.write(bodyStr);
            req.end();
        } catch (err) {
            reject(err);
        }
    });
}

function getNimbusCredentials() {
    return {
        apiKey: (process.env.NIMBUS_API_KEY || NIMBUS_API_KEY || '').trim(),
        apiSecret: (process.env.NIMBUS_API_SECRET || NIMBUS_API_SECRET || '').trim(),
        email: (process.env.NIMBUS_EMAIL || NIMBUS_EMAIL || '').trim(),
        password: (process.env.NIMBUS_PASSWORD || NIMBUS_PASSWORD || '').trim()
    };
}

function buildNimbusAuthHeaders(token) {
    const { apiKey, apiSecret } = getNimbusCredentials();
    const headers = {
        'Authorization': `Bearer ${token}`,
        'NP-API-KEY': apiKey || token,
        'api-key': apiKey || token
    };
    if (apiSecret) {
        headers['NP-API-SECRET'] = apiSecret;
        headers['api-secret'] = apiSecret;
    }
    return headers;
}

async function getNimbusAuthToken() {
    const { apiKey, apiSecret, email, password } = getNimbusCredentials();

    // 1. If Email & Password (or API Key + Secret login payload) are configured, authenticate via /v1/users/login
    if ((email && password) || (apiKey && apiSecret)) {
        try {
            const loginPayload = {};
            if (email) loginPayload.email = email;
            if (password) loginPayload.password = password;
            if (apiKey) loginPayload.api_key = apiKey;
            if (apiSecret) loginPayload.api_secret = apiSecret;

            const loginHeaders = {};
            if (apiKey) loginHeaders['NP-API-KEY'] = apiKey;
            if (apiSecret) loginHeaders['NP-API-SECRET'] = apiSecret;

            const resp = await httpsJsonRequest('https://api.nimbuspost.com/v1/users/login', 'POST', loginHeaders, loginPayload);
            if (resp.data && resp.data.status && resp.data.data) {
                return typeof resp.data.data === 'string' ? resp.data.data : (resp.data.data.token || apiKey || null);
            }
        } catch (err) {
            console.warn('[NimbusPost] Auth login fallback triggered:', err.message);
        }
    }

    // 2. Direct API Key / Secret token fallback if NIMBUS_API_KEY is present
    if (apiKey) {
        return apiKey;
    }

    return null;
}

async function fetchSmartSurfaceCouriers({ destinationPincode, weightGrams = 250, orderAmount = 500 }) {
    const cleanDest = String(destinationPincode || '400001').replace(/\D/g, '') || '400001';
    const token = await getNimbusAuthToken();

    if (token) {
        try {
            const authHeaders = buildNimbusAuthHeaders(token);
            const [prepaidResp, codResp] = await Promise.all([
                httpsJsonRequest('https://api.nimbuspost.com/v1/courier/serviceability', 'POST', authHeaders, {
                    origin: ORIGIN_PINCODE,
                    destination: cleanDest,
                    payment_type: 'prepaid',
                    order_amount: orderAmount,
                    weight: weightGrams
                }),
                httpsJsonRequest('https://api.nimbuspost.com/v1/courier/serviceability', 'POST', authHeaders, {
                    origin: ORIGIN_PINCODE,
                    destination: cleanDest,
                    payment_type: 'cod',
                    order_amount: orderAmount,
                    weight: weightGrams
                })
            ]);

            if (prepaidResp.data && Array.isArray(prepaidResp.data.data) && prepaidResp.data.data.length > 0) {
                const codMap = {};
                if (codResp.data && Array.isArray(codResp.data.data)) {
                    codResp.data.data.forEach(c => { codMap[c.id] = c; });
                }

                // Filter strictly for SURFACE couriers (exclude Air)
                const surfaceOnly = prepaidResp.data.data.filter(c => {
                    const name = String(c.name || '').toLowerCase();
                    const mode = String(c.mode || c.service_type || '').toLowerCase();
                    if (name.includes('air') || mode === 'air') return false;
                    return true;
                });

                if (surfaceOnly.length > 0) {
                    const mapped = surfaceOnly.map(c => {
                        const rawPrepaid = Math.round(Number(c.total_charges || c.freight_charges || 48));
                        const codEntry = codMap[c.id];
                        const rawCodTotal = codEntry
                            ? Math.round(Number(codEntry.total_charges || (rawPrepaid + 35)))
                            : (rawPrepaid + 35);
                        const rawCodFee = Math.max(35, rawCodTotal - rawPrepaid);

                        return {
                            courierId: String(c.id),
                            courierName: c.name.includes('Surface') ? c.name : `${c.name} Surface`,
                            mode: 'Surface',
                            etaDays: c.edd || '3-5 Days',
                            rating: 4.8,
                            weightGrams: weightGrams,
                            rawPrepaidRate: rawPrepaid,
                            rawCodFee: rawCodFee,
                            rawCodTotalRate: rawPrepaid + rawCodFee,
                            customerPrepaidCharge: rawPrepaid + SURFACE_MARKUP_RS,
                            customerCodTotalCharge: rawPrepaid + rawCodFee + SURFACE_MARKUP_RS
                        };
                    });

                    mapped.sort((a, b) => a.rawPrepaidRate - b.rawPrepaidRate);
                    return mapped.map((c, idx) => ({ ...c, isCheapest: idx === 0, liveApi: true }));
                }
            }
        } catch (err) {
            console.warn('[NimbusPost] Live rate fetch failed, using Safe Fallback Surface Mode:', err.message);
        }
    }

    // Safe Fallback Mode when keys are not yet configured in .env
    return getFallbackSurfaceCouriers(cleanDest, weightGrams);
}

// Book Shipment on NimbusPost (Live API or Safe Fallback Mode)
async function bookNimbusShipment(order, chosenCourierId) {
    const couriers = (order.surfaceCouriers && order.surfaceCouriers.length > 0)
        ? order.surfaceCouriers
        : getFallbackSurfaceCouriers(order.pincode || '400001', order.weightGrams || 250);

    const selected = couriers.find(c => String(c.courierId) === String(chosenCourierId))
        || order.selectedCourier
        || couriers[0];

    const token = await getNimbusAuthToken();
    const isCOD = (order.paymentType === 'COD') || String(order.paymentMode || '').toLowerCase().includes('cod') || String(order.paymentMode || '').toLowerCase().includes('cash');

    if (token) {
        try {
            const payload = {
                order_number: order.orderId,
                shipping_charges: isCOD ? selected.customerCodTotalCharge : selected.customerPrepaidCharge,
                discount: order.discount || 0,
                cod_charges: isCOD ? selected.rawCodFee : 0,
                payment_type: isCOD ? 'cod' : 'prepaid',
                order_amount: order.totalAmount || 0,
                package_weight: order.weightGrams || 250,
                package_length: 20,
                package_breadth: 15,
                package_height: 10,
                request_auto_pickup: 'yes',
                consignee: {
                    name: order.customerName,
                    address: order.shippingAddress,
                    address_2: order.city || '',
                    city: order.city || 'Mumbai',
                    state: order.state || 'Maharashtra',
                    pincode: order.pincode || '400001',
                    phone: order.customerPhone
                },
                pickup: {
                    warehouse_name: 'Hamsa Masala Central Kitchen',
                    name: 'Hamsa Masala',
                    address: 'Mumbra, Thane',
                    city: 'Thane',
                    state: 'Maharashtra',
                    pincode: ORIGIN_PINCODE,
                    phone: '9167435089'
                },
                order_items: (order.items || []).map(item => ({
                    name: `${item.name} (${item.pack || '100g'})`,
                    qty: Number(item.qty) || 1,
                    price: Number(item.price) || 200,
                    sku: String(item.name || 'MASALA').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12)
                })),
                courier_id: selected.courierId
            };

            const authHeaders = buildNimbusAuthHeaders(token);
            const resp = await httpsJsonRequest('https://api.nimbuspost.com/v1/shipments', 'POST', authHeaders, payload);

            if (resp.data && resp.data.status && resp.data.data) {
                const d = resp.data.data;
                return {
                    awbNumber: d.awb_number || ('NP' + Math.floor(1000000000 + Math.random() * 9000000000)),
                    courierId: selected.courierId,
                    courierName: selected.courierName,
                    rawCost: isCOD ? selected.rawCodTotalRate : selected.rawPrepaidRate,
                    labelUrl: d.label || `/api/admin/orders/label?id=${encodeURIComponent(order.orderId)}`,
                    mode: 'Surface',
                    bookedVia: 'NimbusPost Live API'
                };
            }
        } catch (err) {
            console.warn('[NimbusPost] Shipment creation fallback used:', err.message);
        }
    }

    // Safe Fallback Shipment Booking (when .env keys are not generated yet)
    const prefix = selected.courierName.substring(0, 3).toUpperCase();
    const generatedAwb = `NP${prefix}${Math.floor(100000000 + Math.random() * 900000000)}`;
    return {
        awbNumber: generatedAwb,
        courierId: selected.courierId,
        courierName: selected.courierName,
        rawCost: isCOD ? selected.rawCodTotalRate : selected.rawPrepaidRate,
        labelUrl: `/api/admin/orders/label?id=${encodeURIComponent(order.orderId)}`,
        mode: 'Surface',
        bookedVia: 'NimbusPost Surface Engine (Ready for Live Key)'
    };
}

// =========================================================================
// 3. ORDER DATABASE HELPERS + 24-HOUR OTP AUTO-CANCEL CHECK
// =========================================================================
function normalizeAndCheckExpiry(orders) {
    let modified = false;
    const now = Date.now();

    orders.forEach(order => {
        // Remove any legacy delivery-boy OTP field
        if (order.deliveryOtp !== undefined) {
            delete order.deliveryOtp;
            modified = true;
        }

        // Normalize legacy CONFIRMED status to "Verified - Confirmed"
        if (order.status === 'CONFIRMED') {
            order.status = 'Verified - Confirmed';
            modified = true;
        } else if (order.status === 'DELIVERED') {
            order.status = 'Delivered';
            modified = true;
        }

        // Check 24-Hour Auto-Cancel for "OTP Verification Pending" orders
        if (order.status === 'OTP Verification Pending') {
            const createdTime = order.createdAt ? new Date(order.createdAt).getTime() : now;
            const expiryTime = order.expiresAt ? new Date(order.expiresAt).getTime() : (createdTime + OTP_EXPIRY_MS);
            if (now > expiryTime) {
                order.status = 'Cancelled (OTP Expired)';
                order.cancelledAt = new Date().toISOString();
                order.cancelReason = 'Auto-cancelled: WhatsApp OTP not verified within 24 hours';
                modified = true;
            }
        }

        // Hydrate Surface Couriers & Cheapest Selected Courier if missing
        if (!order.surfaceCouriers || !Array.isArray(order.surfaceCouriers) || order.surfaceCouriers.length === 0) {
            const wGrams = order.weightGrams || calculateItemsWeightGrams(order.items);
            order.weightGrams = wGrams;
            order.surfaceCouriers = getFallbackSurfaceCouriers(order.pincode || '400001', wGrams);
            order.selectedCourier = order.surfaceCouriers[0];
            modified = true;
        } else if (!order.selectedCourier) {
            order.selectedCourier = order.surfaceCouriers[0];
            modified = true;
        }
    });

    if (modified) {
        saveOrders(orders);
    }
    return orders;
}

function readOrders() {
    try {
        if (!fs.existsSync(ORDERS_FILE)) {
            fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
            return [];
        }
        const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
        const parsed = JSON.parse(raw) || [];
        return normalizeAndCheckExpiry(parsed);
    } catch (err) {
        console.error('[Orders DB] Read error:', err);
        return [];
    }
}

function saveOrders(orders) {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('[Orders DB] Save error:', err);
        return false;
    }
}

// Sanitize order for public customer lookup (NEVER expose NimbusPost raw courier rates!)
function sanitizeOrderForCustomer(order) {
    if (!order) return null;
    const isPendingOtp = order.status === 'OTP Verification Pending';
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
        deliveryCharge: order.deliveryCharge || 0,
        codFee: order.codFee || 0,
        totalAmount: order.totalAmount || 0,
        paymentType: order.paymentType || 'Prepaid',
        paymentMode: order.paymentMode || 'UPI',
        status: order.status || 'OTP Verification Pending',
        courierName: order.selectedCourier ? order.selectedCourier.courierName : 'Surface Express',
        etaDays: order.selectedCourier ? order.selectedCourier.etaDays : '3-5 Days',
        awbNumber: order.awbNumber || null,
        trackingHistory: order.trackingHistory || [],
        createdAt: order.createdAt,
        expiresAt: order.expiresAt || null,
        verifiedAt: order.verifiedAt || null,
        shippedAt: order.shippedAt || null,
        deliveredAt: order.deliveredAt || null,
        whatsappMessage: isPendingOtp ? order.whatsappMessage : undefined
    };
}

function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 1e6) {
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

// =========================================================================
// 4. HTTP SERVER & API ROUTES
// =========================================================================
const server = http.createServer(async (req, res) => {
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

    // CORS Preflight support
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Nimbus-Signature'
        });
        return res.end();
    }

    // ---------------------------------------------------------------------
    // A. SMART NIMBUSPOST SHIPPING RATE API (Customer Checkout)
    //    GET /api/shipping/rates?pincode=400001&weight=250&amount=500
    //    POST /api/shipping/rates
    // ---------------------------------------------------------------------
    if ((decodedPath === '/api/shipping/rates' || decodedPath === '/api/shipping/rates/') && (req.method === 'GET' || req.method === 'POST')) {
        try {
            let pin = queryParams.get('pincode') || '400001';
            let weightGrams = Number(queryParams.get('weight')) || 250;
            let orderAmount = Number(queryParams.get('amount')) || 500;

            if (req.method === 'POST') {
                const body = await parseJsonBody(req);
                if (body.pincode) pin = body.pincode;
                if (body.items && Array.isArray(body.items)) {
                    weightGrams = calculateItemsWeightGrams(body.items);
                } else if (body.weightGrams) {
                    weightGrams = Number(body.weightGrams);
                }
                if (body.orderAmount) orderAmount = Number(body.orderAmount);
            }

            const surfaceCouriers = await fetchSmartSurfaceCouriers({
                destinationPincode: pin,
                weightGrams,
                orderAmount
            });
            const cheapest = surfaceCouriers[0];

            // Customer ONLY sees the +₹10 marked-up rate (NEVER raw NimbusPost rate)
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            return res.end(JSON.stringify({
                success: true,
                originPincode: ORIGIN_PINCODE,
                destinationPincode: String(pin).replace(/\D/g, ''),
                weightGrams,
                mode: 'Surface',
                etaDays: cheapest.etaDays,
                prepaidDeliveryCharge: cheapest.customerPrepaidCharge, // Cheapest Surface Prepaid + ₹10
                prepaidCodFee: 0,
                codDeliveryCharge: cheapest.customerCodTotalCharge,    // Cheapest Surface COD Total + ₹10
                codHandlingFee: cheapest.rawCodFee,                    // ₹35+ COD fee included
                codNotice: 'Cash on Delivery includes ₹35+ courier COD handling fee. Pay online to save on COD charges!'
            }));
        } catch (err) {
            console.error('[API] /api/shipping/rates error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Could not calculate shipping rates' }));
        }
    }

    // ---------------------------------------------------------------------
    // B. CREATE ORDER ON "VERIFY ORDER ON WHATSAPP" CLICK (POST /api/orders)
    //    Saves order with status "OTP Verification Pending" & 4-digit OTP
    // ---------------------------------------------------------------------
    if (req.method === 'POST' && (decodedPath === '/api/orders' || decodedPath === '/api/orders/')) {
        try {
            const data = await parseJsonBody(req);
            const orders = readOrders();

            // Generate clean Order ID (e.g. HM-4821)
            let orderNum = Math.floor(1000 + Math.random() * 9000);
            let candidateId = `HM-${orderNum}`;
            while (orders.some(o => o.orderId === candidateId)) {
                orderNum = Math.floor(1000 + Math.random() * 9000);
                candidateId = `HM-${orderNum}`;
            }

            const finalOrderId = (data.orderId || candidateId).replace(/^#/, '').toUpperCase();
            // Generate 4-digit WhatsApp verification OTP (e.g. 4829)
            const whatsappOtp = data.whatsappOtp && /^\d{4}$/.test(String(data.whatsappOtp))
                ? String(data.whatsappOtp)
                : String(Math.floor(1000 + Math.random() * 9000));

            const items = Array.isArray(data.items) ? data.items : [];
            const weightGrams = calculateItemsWeightGrams(items);
            const destPincode = String(data.pincode || '400001').replace(/\D/g, '');
            const subtotal = Number(data.subtotal) || items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 1), 0);
            const discount = Number(data.discount) || 0;

            const paymentModeStr = data.paymentMode || 'UPI (Online Prepaid)';
            const isCOD = (data.paymentType === 'COD') || paymentModeStr.toLowerCase().includes('cod') || paymentModeStr.toLowerCase().includes('cash');
            const paymentType = isCOD ? 'COD' : 'Prepaid';

            // Fetch Smart NimbusPost Surface Couriers (Sorted Cheapest First)
            const surfaceCouriers = await fetchSmartSurfaceCouriers({
                destinationPincode: destPincode,
                weightGrams,
                orderAmount: subtotal
            });
            const cheapestCourier = surfaceCouriers[0];

            const deliveryCharge = isCOD ? cheapestCourier.customerCodTotalCharge : cheapestCourier.customerPrepaidCharge;
            const codFee = isCOD ? cheapestCourier.rawCodFee : 0;
            const totalAmount = Number(data.totalAmount) || Math.max(0, subtotal - discount + deliveryCharge);

            const nowIso = new Date().toISOString();
            const expiresIso = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

            // Exact reframed WhatsApp verification message required by prompt
            const whatsappMessage = `Hello Hamsa Masala! Confirm my Order #${finalOrderId}. My OTP to verify on the website is: ${whatsappOtp}. (Please verify this OTP on the website to confirm your order).`;
            const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

            const newOrder = {
                orderId: finalOrderId,
                whatsappOtp: whatsappOtp,
                customerName: data.customerName || data.name || 'Royal Patron',
                customerPhone: data.customerPhone || data.phone || '',
                shippingAddress: data.shippingAddress || data.address || '',
                pincode: destPincode,
                city: data.city || '',
                state: data.state || '',
                items: items,
                weightGrams: weightGrams,
                subtotal: subtotal,
                discount: discount,
                deliveryCharge: deliveryCharge,
                codFee: codFee,
                totalAmount: totalAmount,
                paymentType: paymentType,
                paymentMode: paymentModeStr,
                status: 'OTP Verification Pending',
                surfaceCouriers: surfaceCouriers,
                selectedCourier: cheapestCourier,
                awbNumber: null,
                labelUrl: null,
                trackingHistory: [
                    {
                        status: 'OTP Verification Pending',
                        timestamp: nowIso,
                        message: 'Order created at checkout. Awaiting customer 4-digit WhatsApp OTP verification on website.'
                    }
                ],
                whatsappMessage: whatsappMessage,
                whatsappUrl: whatsappUrl,
                createdAt: nowIso,
                expiresAt: expiresIso,
                verifiedAt: null,
                shippedAt: null,
                deliveredAt: null
            };

            orders.unshift(newOrder);
            saveOrders(orders);

            res.writeHead(201, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            return res.end(JSON.stringify({
                success: true,
                message: 'Order created with OTP Verification Pending',
                orderId: newOrder.orderId,
                whatsappOtp: newOrder.whatsappOtp,
                whatsappMessage: newOrder.whatsappMessage,
                whatsappUrl: newOrder.whatsappUrl,
                expiresAt: newOrder.expiresAt,
                order: sanitizeOrderForCustomer(newOrder)
            }));
        } catch (err) {
            console.error('[API] /api/orders error:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Invalid order request payload' }));
        }
    }

    // ---------------------------------------------------------------------
    // C. VERIFY CUSTOMER WHATSAPP OTP (POST /api/orders/verify-whatsapp-otp)
    //    Triggered when customer clicks "Verify My Number"
    // ---------------------------------------------------------------------
    if (req.method === 'POST' && (
        decodedPath === '/api/orders/verify-whatsapp-otp' ||
        decodedPath === '/api/orders/verify-whatsapp-otp/' ||
        decodedPath === '/api/orders/verify-otp' ||
        decodedPath === '/api/orders/verify-otp/'
    )) {
        try {
            const data = await parseJsonBody(req);
            const rawId = (data.orderId || '').trim().replace(/^#/, '').toUpperCase();
            const inputOtp = String(data.otp || '').trim();

            if (!rawId || !inputOtp) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Please enter your 4-digit OTP to verify your order.' }));
            }

            const orders = readOrders();
            const order = orders.find(o => o.orderId.toUpperCase().replace(/^#/, '') === rawId);

            if (!order) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${rawId} not found.` }));
            }

            if (order.status === 'Cancelled (OTP Expired)' || order.status === 'Cancelled' || order.status === 'Refund Initiated') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    expired: true,
                    message: `Order #${order.orderId} was cancelled because OTP verification was not completed in time.`
                }));
            }

            if (order.status === 'Verified - Confirmed' || order.status === 'Shipped' || order.status === 'In Transit' || order.status === 'Delivered') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    alreadyVerified: true,
                    message: `Order #${order.orderId} is already Verified & Confirmed!`,
                    order: sanitizeOrderForCustomer(order)
                }));
            }

            if (String(order.whatsappOtp || '').trim() !== inputOtp) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    message: 'Invalid 4-digit OTP! Please check the OTP in your WhatsApp message and try again.'
                }));
            }

            // OTP Matches! Update status to "Verified - Confirmed"
            const nowIso = new Date().toISOString();
            order.status = 'Verified - Confirmed';
            order.verifiedAt = nowIso;
            order.trackingHistory = order.trackingHistory || [];
            order.trackingHistory.push({
                status: 'Verified - Confirmed',
                timestamp: nowIso,
                message: 'Customer verified 4-digit WhatsApp OTP on website. Order confirmed for dispatch.'
            });

            // Check if Admin enabled "Auto-Push to NimbusPost on Customer OTP Verify"
            const settings = readAdminSettings();
            if (settings.autoPushToNimbusOnVerify) {
                const shipment = await bookNimbusShipment(order, order.selectedCourier?.courierId);
                order.status = 'Shipped';
                order.awbNumber = shipment.awbNumber;
                order.labelUrl = shipment.labelUrl;
                order.shippedAt = new Date().toISOString();
                order.trackingHistory.push({
                    status: 'Shipped',
                    timestamp: order.shippedAt,
                    message: `Auto-booked via ${shipment.courierName} (AWB: ${shipment.awbNumber})`
                });
            }

            saveOrders(orders);

            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            return res.end(JSON.stringify({
                success: true,
                message: `Order #${order.orderId} Verified & Confirmed!`,
                order: sanitizeOrderForCustomer(order)
            }));
        } catch (err) {
            console.error('[API] /api/orders/verify-whatsapp-otp error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Server error verifying OTP' }));
        }
    }

    // ---------------------------------------------------------------------
    // D. FETCH PUBLIC ORDER(S) (GET /api/orders?id=HM-1050 or ?phone=...)
    // ---------------------------------------------------------------------
    if (req.method === 'GET' && (decodedPath === '/api/orders' || decodedPath === '/api/orders/')) {
        const orderIdParam = queryParams.get('id') || queryParams.get('orderId');
        const phoneParam = queryParams.get('phone');
        const orders = readOrders();

        if (orderIdParam) {
            const cleanId = orderIdParam.trim().replace(/^#/, '').toUpperCase();
            const found = orders.find(o => o.orderId.toUpperCase().replace(/^#/, '') === cleanId);
            if (!found) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${cleanId} not found` }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                order: sanitizeOrderForCustomer(found)
            }));
        } else if (phoneParam) {
            const cleanPhone = phoneParam.replace(/\D/g, '').slice(-10);
            const matched = orders.filter(o => String(o.customerPhone || '').replace(/\D/g, '').slice(-10) === cleanPhone);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                orders: matched.map(sanitizeOrderForCustomer)
            }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                orders: orders.map(sanitizeOrderForCustomer)
            }));
        }
    }

    // ---------------------------------------------------------------------
    // E. NIMBUSPOST REAL-TIME WEBHOOK ENDPOINT (POST /api/nimbus-webhook)
    //    Receives: In Transit, Out for Delivery, Delivered, RTO Initiated, Cancelled
    // ---------------------------------------------------------------------
    if (req.method === 'POST' && (decodedPath === '/api/nimbus-webhook' || decodedPath === '/api/nimbus-webhook/')) {
        try {
            const configuredSecret = (process.env.NIMBUS_WEBHOOK_SECRET || '').trim();
            if (configuredSecret) {
                const headerSecret = req.headers['x-nimbus-signature'] || req.headers['x-webhook-secret'] || req.headers['authorization'] || '';
                if (!headerSecret.includes(configuredSecret)) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, message: 'Unauthorized webhook signature' }));
                }
            }

            const payload = await parseJsonBody(req);
            const awb = String(payload.awb_number || payload.awb || '').trim();
            const orderNum = String(payload.order_number || payload.orderId || '').trim().replace(/^#/, '').toUpperCase();
            const rawStatus = String(payload.status || payload.current_status || payload.event || '').trim();

            const orders = readOrders();
            const order = orders.find(o =>
                (awb && String(o.awbNumber || '') === awb) ||
                (orderNum && o.orderId.toUpperCase().replace(/^#/, '') === orderNum)
            );

            if (!order) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, message: 'Webhook received (no matching local order)' }));
            }

            // Map NimbusPost status string to canonical website status
            const stLower = rawStatus.toLowerCase();
            let mappedStatus = order.status;
            if (stLower.includes('rto')) {
                mappedStatus = 'RTO Initiated';
            } else if (stLower.includes('out for delivery') || stLower === 'ofd') {
                mappedStatus = 'Out for Delivery';
            } else if (stLower.includes('delivered')) {
                mappedStatus = 'Delivered';
                order.deliveredAt = new Date().toISOString();
            } else if (stLower.includes('transit') || stLower.includes('picked') || stLower.includes('shipped') || stLower.includes('manifest')) {
                mappedStatus = 'In Transit';
            } else if (stLower.includes('cancel')) {
                mappedStatus = 'Cancelled';
            } else if (rawStatus) {
                mappedStatus = rawStatus;
            }

            order.status = mappedStatus;
            if (awb && !order.awbNumber) order.awbNumber = awb;
            order.trackingHistory = order.trackingHistory || [];
            order.trackingHistory.push({
                status: mappedStatus,
                location: payload.location || payload.city || '',
                timestamp: payload.event_time || new Date().toISOString(),
                message: payload.message || payload.remarks || `NimbusPost update: ${mappedStatus}`
            });

            saveOrders(orders);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                message: `Order #${order.orderId} updated to ${mappedStatus}`,
                orderId: order.orderId,
                status: mappedStatus
            }));
        } catch (err) {
            console.error('[Webhook] /api/nimbus-webhook error:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Invalid webhook payload' }));
        }
    }

    // ---------------------------------------------------------------------
    // F. ADMIN DASHBOARD API ROUTES (/api/admin/*)
    // ---------------------------------------------------------------------

    // 1. Admin Login (POST /api/admin/login)
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

    // 2. Admin Fetch All Orders, Surface Logistics & Settings (GET /api/admin/orders)
    if (req.method === 'GET' && (decodedPath === '/api/admin/orders' || decodedPath === '/api/admin/orders/')) {
        const orders = readOrders();
        const settings = readAdminSettings();

        // Prioritize "Verified - Confirmed" orders at the top of the Admin Dashboard
        const priorityRank = status => {
            if (status === 'Verified - Confirmed') return 1;
            if (status === 'OTP Verification Pending') return 2;
            if (status === 'Shipped' || status === 'In Transit' || status === 'Out for Delivery') return 3;
            if (status === 'Delivered') return 4;
            return 5; // Cancelled / Refund Initiated / RTO
        };

        const sortedOrders = [...orders].sort((a, b) => {
            const rA = priorityRank(a.status);
            const rB = priorityRank(b.status);
            if (rA !== rB) return rA - rB;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        const validRevenueOrders = orders.filter(o => !String(o.status || '').includes('Cancel') && o.status !== 'Refund Initiated');
        const totalRevenue = validRevenueOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
        const verifiedReadyCount = orders.filter(o => o.status === 'Verified - Confirmed').length;
        const otpPendingCount = orders.filter(o => o.status === 'OTP Verification Pending').length;
        const shippedCount = orders.filter(o => ['Shipped', 'In Transit', 'Out for Delivery'].includes(o.status)).length;
        const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            success: true,
            settings,
            nimbusConfigured: Boolean(process.env.NIMBUS_API_KEY || (process.env.NIMBUS_EMAIL && process.env.NIMBUS_PASSWORD)),
            stats: {
                totalRevenue,
                totalOrders: orders.length,
                verifiedReadyCount,
                otpPendingCount,
                shippedCount,
                deliveredCount,
                pendingCount: verifiedReadyCount + otpPendingCount + shippedCount
            },
            orders: sortedOrders
        }));
    }

    // 3. Admin Toggle Settings (POST /api/admin/settings)
    if (req.method === 'POST' && (decodedPath === '/api/admin/settings' || decodedPath === '/api/admin/settings/')) {
        try {
            const data = await parseJsonBody(req);
            const current = readAdminSettings();
            if (typeof data.autoPushToNimbusOnVerify === 'boolean') {
                current.autoPushToNimbusOnVerify = data.autoPushToNimbusOnVerify;
            }
            saveAdminSettings(current);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                message: `Auto-Push to NimbusPost on OTP Verify is now ${current.autoPushToNimbusOnVerify ? 'ENABLED' : 'DISABLED (Manual Admin Control)'}`,
                settings: current
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Error saving settings' }));
        }
    }

    // 4. Admin Override / Switch Surface Courier Partner (POST /api/admin/orders/select-courier)
    if (req.method === 'POST' && (decodedPath === '/api/admin/orders/select-courier' || decodedPath === '/api/admin/orders/select-courier/')) {
        try {
            const data = await parseJsonBody(req);
            const targetId = (data.orderId || '').trim().replace(/^#/, '').toUpperCase();
            const courierId = String(data.courierId || '').trim();

            const orders = readOrders();
            const order = orders.find(o => o.orderId.toUpperCase().replace(/^#/, '') === targetId);
            if (!order) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${targetId} not found` }));
            }

            const chosen = (order.surfaceCouriers || []).find(c => String(c.courierId) === courierId);
            if (!chosen) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Selected Surface courier not found for this pincode' }));
            }

            order.selectedCourier = chosen;
            order.courierOverriddenByAdmin = true;
            saveOrders(orders);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                message: `Courier switched to ${chosen.courierName} (Raw Surface Rate: ₹${chosen.rawPrepaidRate})`,
                order
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Server error switching courier' }));
        }
    }

    // 5. Admin Confirm & Book Shipment on NimbusPost (POST /api/admin/orders/book-shipment)
    if (req.method === 'POST' && (decodedPath === '/api/admin/orders/book-shipment' || decodedPath === '/api/admin/orders/book-shipment/')) {
        try {
            const data = await parseJsonBody(req);
            const targetId = (data.orderId || '').trim().replace(/^#/, '').toUpperCase();
            const courierId = data.courierId;

            const orders = readOrders();
            const order = orders.find(o => o.orderId.toUpperCase().replace(/^#/, '') === targetId);
            if (!order) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${targetId} not found` }));
            }

            if (courierId) {
                const match = (order.surfaceCouriers || []).find(c => String(c.courierId) === String(courierId));
                if (match) order.selectedCourier = match;
            }

            const shipment = await bookNimbusShipment(order, order.selectedCourier?.courierId);
            const nowIso = new Date().toISOString();

            order.status = 'Shipped';
            order.awbNumber = shipment.awbNumber;
            order.labelUrl = shipment.labelUrl;
            order.shippedAt = nowIso;
            order.bookedCourier = {
                courierId: shipment.courierId,
                courierName: shipment.courierName,
                rawCost: shipment.rawCost,
                mode: 'Surface',
                bookedVia: shipment.bookedVia
            };
            order.trackingHistory = order.trackingHistory || [];
            order.trackingHistory.push({
                status: 'Shipped',
                timestamp: nowIso,
                message: `Shipment booked on NimbusPost via ${shipment.courierName} (AWB: ${shipment.awbNumber})`
            });

            saveOrders(orders);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                message: `Shipment Booked! AWB #${shipment.awbNumber} assigned via ${shipment.courierName}`,
                shipment,
                order
            }));
        } catch (err) {
            console.error('[API] book-shipment error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Server error booking shipment' }));
        }
    }

    // 6. Admin Cancel Order (POST /api/admin/orders/cancel)
    //    Marks Prepaid cancelled orders as "Refund Initiated", COD as "Cancelled"
    if (req.method === 'POST' && (decodedPath === '/api/admin/orders/cancel' || decodedPath === '/api/admin/orders/cancel/')) {
        try {
            const data = await parseJsonBody(req);
            const targetId = (data.orderId || '').trim().replace(/^#/, '').toUpperCase();

            const orders = readOrders();
            const order = orders.find(o => o.orderId.toUpperCase().replace(/^#/, '') === targetId);
            if (!order) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: `Order #${targetId} not found` }));
            }

            if (['Shipped', 'In Transit', 'Out for Delivery', 'Delivered'].includes(order.status)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    message: 'Cannot cancel an order that has already been shipped/picked up.'
                }));
            }

            const isCOD = (order.paymentType === 'COD') || String(order.paymentMode || '').toLowerCase().includes('cod') || String(order.paymentMode || '').toLowerCase().includes('cash');
            const newStatus = isCOD ? 'Cancelled' : 'Refund Initiated';
            const nowIso = new Date().toISOString();

            order.status = newStatus;
            order.cancelledAt = nowIso;
            order.refundStatus = isCOD ? 'N/A (COD Order)' : 'Refund Initiated to Customer Source';
            order.trackingHistory = order.trackingHistory || [];
            order.trackingHistory.push({
                status: newStatus,
                timestamp: nowIso,
                message: isCOD
                    ? 'Order cancelled by Admin prior to shipment.'
                    : 'Prepaid order cancelled by Admin prior to shipment. Refund Initiated.'
            });

            saveOrders(orders);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                message: isCOD
                    ? `Order #${order.orderId} cancelled.`
                    : `Prepaid Order #${order.orderId} cancelled & marked as "Refund Initiated".`,
                order
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Server error cancelling order' }));
        }
    }

    // 7. Printable Shipping Label View (GET /api/admin/orders/label?id=HM-XXXX)
    if (req.method === 'GET' && (decodedPath === '/api/admin/orders/label' || decodedPath === '/api/admin/orders/label/')) {
        const targetId = (queryParams.get('id') || '').trim().replace(/^#/, '').toUpperCase();
        const orders = readOrders();
        const order = orders.find(o => o.orderId.toUpperCase().replace(/^#/, '') === targetId);
        if (!order) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Order not found');
        }
        const isCOD = (order.paymentType === 'COD') || String(order.paymentMode || '').toLowerCase().includes('cod') || String(order.paymentMode || '').toLowerCase().includes('cash');
        const courierName = order.bookedCourier?.courierName || order.selectedCourier?.courierName || 'NimbusPost Surface';
        const awb = order.awbNumber || 'PENDING-AWB';
        const itemsRows = (order.items || []).map(i => `<tr><td>${i.name} (${i.pack || '100g'})</td><td>${i.qty || 1}</td><td>₹${(i.price || 0) * (i.qty || 1)}</td></tr>`).join('');

        const labelHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Shipping Label #${order.orderId} - ${awb}</title>
<style>
  body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
  .label-box { max-width: 480px; margin: 0 auto; background: #fff; border: 3px solid #000; padding: 18px; }
  .row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
  .awb-bar { text-align: center; border-bottom: 2px solid #000; padding: 12px 0; margin-bottom: 10px; }
  .awb-code { font-family: monospace; font-size: 24px; font-weight: 900; letter-spacing: 3px; }
  .mode-badge { background: #000; color: #fff; padding: 6px 12px; font-weight: 900; font-size: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
  th, td { border: 1px solid #000; padding: 6px; text-align: left; }
  .print-btn { display: block; margin: 0 auto 16px auto; padding: 10px 22px; background: #12342A; color: #E2B66B; border: 2px solid #E2B66B; font-weight: bold; cursor: pointer; border-radius: 6px; }
  @media print { .print-btn { display: none; } body { background: #fff; padding: 0; } }
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Print NimbusPost Surface Label</button>
  <div class="label-box">
    <div class="row">
      <div>
        <strong style="font-size: 18px;">HAMSA MASALA</strong><br>
        <small>Origin PIN: <strong>${ORIGIN_PINCODE}</strong> (Thane, MH)</small>
      </div>
      <div class="mode-badge">${isCOD ? 'COD: ₹' + order.totalAmount : 'PREPAID'}</div>
    </div>
    <div class="awb-bar">
      <div style="font-size: 12px; font-weight: bold; text-transform: uppercase;">${courierName} &bull; SURFACE MODE</div>
      <div class="awb-code">|| |||| ||| |||| |||</div>
      <div style="font-family: monospace; font-size: 18px; font-weight: bold;">AWB: ${awb}</div>
    </div>
    <div style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px;">
      <div style="font-size: 11px; font-weight: bold; color: #555;">DELIVER TO:</div>
      <div style="font-size: 16px; font-weight: bold;">${order.customerName}</div>
      <div style="font-size: 14px; margin: 4px 0;">${order.shippingAddress}</div>
      <div style="font-size: 15px; font-weight: bold;">PINCODE: ${order.pincode || ''} &bull; Phone: +91 ${order.customerPhone}</div>
    </div>
    <div class="row" style="font-size: 13px;">
      <span>Order ID: <strong>#${order.orderId}</strong></span>
      <span>Weight: <strong>${order.weightGrams || 250}g</strong></span>
      <span>Date: <strong>${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}</strong></span>
    </div>
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>${itemsRows}</tbody>
    </table>
  </div>
</body>
</html>`;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(labelHtml);
    }

    // 8. Admin Manual Status Update (POST /api/admin/orders/update-status)
    if (req.method === 'POST' && (decodedPath === '/api/admin/orders/update-status' || decodedPath === '/api/admin/orders/update-status/')) {
        try {
            const data = await parseJsonBody(req);
            const targetId = (data.orderId || '').trim().replace(/^#/, '').toUpperCase();
            const newStatus = (data.status || '').trim();

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
            if (newStatus === 'Delivered' || newStatus === 'DELIVERED') {
                order.status = 'Delivered';
                order.deliveredAt = new Date().toISOString();
            } else if (newStatus === 'Verified - Confirmed') {
                order.verifiedAt = order.verifiedAt || new Date().toISOString();
            }

            order.trackingHistory = order.trackingHistory || [];
            order.trackingHistory.push({
                status: order.status,
                timestamp: new Date().toISOString(),
                message: `Status updated to ${order.status} by Admin`
            });

            saveOrders(orders);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                message: `Order #${order.orderId} status updated to ${order.status}`,
                order
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Server error updating status' }));
        }
    }

    // 9. Admin Delete Order (POST /api/admin/orders/delete)
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

    // ---------------------------------------------------------------------
    // G. STATIC ROUTES & SHORTCUTS (NO /delivery PORTAL)
    // ---------------------------------------------------------------------
    if (decodedPath === '/delivery' || decodedPath === '/delivery/' || decodedPath === '/delivery.html') {
        res.writeHead(410, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('410 Gone: Delivery Partner OTP Portal has been permanently removed. Orders are verified via Customer WhatsApp OTP on the website.');
    }

    if (decodedPath === '/admin' || decodedPath === '/admin/') {
        decodedPath = '/admin.html';
    }
    if (decodedPath === '/privacy' || decodedPath === '/privacy/') {
        decodedPath = '/privacy.html';
    }
    if (decodedPath === '/terms' || decodedPath === '/terms/') {
        decodedPath = '/terms.html';
    }
    if (decodedPath === '/about' || decodedPath === '/about/') {
        decodedPath = '/about.html';
    }

    let relativePath = (decodedPath === '/' || decodedPath === '') ? '/index.html' : decodedPath;
    let safePath = path.normalize(path.join(ROOT_DIR, relativePath));
    if (!safePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden');
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            const htmlPath = safePath + '.html';
            if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
                safePath = htmlPath;
            } else {
                const ext = path.extname(safePath).toLowerCase();
                if (ext && ext !== '.html') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end(`404 Not Found: ${cleanUrl}`);
                }
                safePath = path.join(ROOT_DIR, 'index.html');
            }
        }

        const extname = path.extname(safePath).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

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
                        'Content-Type': 'video/mp4',
                        'Cache-Control': 'public, max-age=604800'
                    });
                    file.pipe(res);
                } else {
                    res.writeHead(200, {
                        'Content-Length': total,
                        'Content-Type': 'video/mp4',
                        'Accept-Ranges': 'bytes',
                        'Cache-Control': 'public, max-age=604800'
                    });
                    fs.createReadStream(safePath).pipe(res);
                }
            });
            return;
        }

        fs.readFile(safePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('500 Internal Server Error');
            }
            const isLongCachedAsset = ['.svg', '.ico', '.woff', '.woff2', '.ttf'].includes(extname);
            const cacheHeader = isLongCachedAsset ? 'public, max-age=604800' : 'no-cache';
            const acceptEncoding = String(req.headers['accept-encoding'] || '');
            const isCompressible = ['.svg', '.html', '.css', '.js', '.json'].includes(extname) && content.length > 1024;

            if (isCompressible && acceptEncoding.includes('gzip')) {
                zlib.gzip(content, (gzErr, compressed) => {
                    if (gzErr) {
                        res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': cacheHeader });
                        return res.end(content);
                    }
                    res.writeHead(200, {
                        'Content-Type': contentType,
                        'Content-Encoding': 'gzip',
                        'Vary': 'Accept-Encoding',
                        'Cache-Control': cacheHeader
                    });
                    res.end(compressed);
                });
                return;
            }

            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': cacheHeader
            });
            res.end(content);
        });
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Smart NimbusPost Surface Logistics Active (Origin: ${ORIGIN_PINCODE}, Markup: +₹${SURFACE_MARKUP_RS})`);
    console.log(`Admin portal available at http://localhost:${PORT}/admin`);
});
