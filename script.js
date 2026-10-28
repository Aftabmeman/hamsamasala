/* ==========================================================================
   PERSIAN MASALA - CORE & E-COMMERCE LOGIC (script.js)
   ========================================================================== */

// --- Global Spices Catalog Data ---
const royalSpicesCatalog = [
    {
        id: 'lazeez-dum',
        name: 'Lazeez - Dum - Biryani',
        tagline: 'Royal Persian-Mughal Spice Blend For Majestic Dum Biryani',
        category: 'Royal Biryani Range',
        catKey: 'blended',
        price: 249,
        origPrice: 299,
        discount: '17% OFF',
        rating: 4.9,
        reviews: '1.8K',
        img: 'assets/lazeez-dum-biryani.png'
    },
    {
        id: 'classic-biryani',
        name: 'Original - Classic - Biryani',
        tagline: 'Authentic Behruz Persian Biryani masala crafted with pure saffron',
        category: 'Royal Biryani Range',
        catKey: 'blended',
        price: 249,
        origPrice: 299,
        discount: '17% OFF',
        rating: 4.8,
        reviews: '2.1K',
        img: 'assets/original-classic-biryani.png'
    },
    {
        id: 'raaz-e-kalimiri',
        name: 'Raaz-e-Kalimiri Biryani',
        tagline: 'Prized Tellicherry pepper & slow-roasted royal Persian spices',
        category: 'Royal Biryani Range',
        catKey: 'blended',
        price: 249,
        origPrice: 299,
        discount: '17% OFF',
        rating: 4.9,
        reviews: '1.5K',
        img: 'assets/raaz-e-kalimiri-biryani.png'
    },
    {
        id: 'turkish-lamb-shank',
        name: 'Turkish Lamb Shank Gravy',
        tagline: 'Royal Turkish-Mughal Spice Blend for Majestic Fall-off-Bone Gravy',
        category: 'Royal Gravy Range',
        catKey: 'blended',
        price: 299,
        origPrice: 349,
        discount: '14% OFF',
        rating: 4.9,
        reviews: '1.4K',
        img: 'assets/turkish-lamb-shank.png'
    },
    {
        id: 'boti-delight',
        name: 'Boti Delight - Behruz Gravy Instant Masala',
        tagline: 'Authentic Persian instant gravy blend for velvety caramelized boti',
        category: 'Royal Gravy Range',
        catKey: 'blended',
        price: 279,
        origPrice: 329,
        discount: '15% OFF',
        rating: 4.9,
        reviews: '1.9K',
        img: 'assets/boti-delight.png'
    },
    {
        id: 'murg-lababdar',
        name: 'Shabnami Murg Lababdar Gravy',
        tagline: 'Royal Persian-Mughal instant gravy blend for velvety tomato-cashew lababdar',
        category: 'Royal Gravy Range',
        catKey: 'blended',
        price: 289,
        origPrice: 339,
        discount: '15% OFF',
        rating: 4.9,
        reviews: '1.6K',
        img: 'assets/murg-lababdar.png'
    },
    {
        id: 'murg-kalimiri',
        name: 'Mukhmali Murg Kalimiri Gravy Masala',
        tagline: 'Royal Tellicherry black pepper gravy instant masala with rich almond cream',
        category: 'Royal Gravy Range',
        catKey: 'blended',
        price: 279,
        origPrice: 329,
        discount: '15% OFF',
        rating: 4.9,
        reviews: '1.3K',
        img: 'assets/murg-kalimiri.png'
    },
    {
        id: 'ruz-bi-haleebia',
        name: 'Ruz-Bi-Haleebia (Persian Sweet)',
        tagline: 'Creamy Saffron & Rosewater Traditional Recipe | Gourmet Selection',
        category: 'Gourmet Sweets',
        catKey: 'royal',
        price: 329,
        origPrice: 389,
        discount: '15% OFF',
        rating: 5.0,
        reviews: '2.4K',
        img: 'assets/ruz-bi-haleebia.png'
    }
];

// --- Helper: Fetch Product by URL ID ---
function getProductFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return null;
    return royalSpicesCatalog.find(p => p.id === id) || null;
}

// --- Global Cart State (with LocalStorage persistence) ---
let cart = JSON.parse(localStorage.getItem('persian_masala_cart') || '[]');

function saveCart() {
    localStorage.setItem('persian_masala_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    // Update header badges
    document.querySelectorAll('.cart-badge').forEach(b => {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    // Update bottom nav badge
    document.querySelectorAll('.bottom-nav .nav-badge').forEach(b => {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    // Update Cart Drawer Items & Header Counter
    const drawerContainer = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const drawerCountEl = document.getElementById('cart-drawer-count');
    const shippingProgressText = document.getElementById('shipping-progress-text');
    const shippingProgressFill = document.getElementById('shipping-progress-fill');

    if (drawerCountEl) {
        drawerCountEl.textContent = totalCount;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += (item.price || 0) * (item.qty || 1);
    });

    // Free Delivery Progress Bar (Threshold: ₹499)
    if (shippingProgressFill && shippingProgressText) {
        const threshold = 499;
        if (subtotal >= threshold) {
            shippingProgressFill.style.width = '100%';
            shippingProgressText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked <strong>Free Royal Delivery</strong>!`;
        } else {
            const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));
            const needed = threshold - subtotal;
            shippingProgressFill.style.width = `${percentage}%`;
            shippingProgressText.innerHTML = `<i class="fas fa-truck-fast"></i> Add <strong>₹${needed}</strong> more for <strong>Free Royal Delivery</strong>`;
        }
    }

    if (drawerContainer && subtotalEl) {
        if (cart.length === 0) {
            drawerContainer.innerHTML = `
                <div class="cart-empty-message">
                    <i class="fas fa-shopping-basket"></i>
                    <h3>Your Royal Cart is Empty</h3>
                    <p>Explore our handcrafted spices and add royal aromas to your feasts.</p>
                </div>
            `;
            subtotalEl.textContent = '₹0';
        } else {
            drawerContainer.innerHTML = cart.map((item, idx) => {
                const itemTotal = item.price * (item.qty || 1);
                const pack = item.pack || '100g';
                return `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <span class="cart-item-pack">${pack}</span>
                            <div class="cart-item-price-row">
                                <span class="cart-item-unit-price">₹${item.price}</span>
                                <div class="cart-qty-stepper">
                                    <button type="button" onclick="updateCartItemQty(${idx}, -1)" aria-label="Decrease">&minus;</button>
                                    <span>${item.qty || 1}</span>
                                    <button type="button" onclick="updateCartItemQty(${idx}, 1)" aria-label="Increase">&plus;</button>
                                </div>
                                <span class="cart-item-total-price">₹${itemTotal}</span>
                            </div>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart(${idx})" aria-label="Remove item">
                            <i class="fas fa-trash-can"></i>
                        </button>
                    </div>
                `;
            }).join('');
            subtotalEl.textContent = '₹' + subtotal;
        }
    }
}

// Add Item to Cart (with pack weight)
function addToCart(name, price, img, qty = 1, pack = '100g') {
    const existingIndex = cart.findIndex(i => i.name === name && (i.pack || '100g') === pack);
    if (existingIndex > -1) {
        cart[existingIndex].qty = (cart[existingIndex].qty || 1) + qty;
    } else {
        cart.push({ name, price, img, qty, pack });
    }
    saveCart();
    showToast(`${name} (${pack})`, price, img);
}

// Update Cart Item Quantity
function updateCartItemQty(index, change) {
    if (!cart[index]) return;
    const newQty = (cart[index].qty || 1) + change;
    if (newQty <= 0) {
        removeFromCart(index);
    } else {
        cart[index].qty = newQty;
        saveCart();
    }
}

// Remove Item from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

// Show Toast Notification
let toastTimer = null;
function showToast(name, price, img) {
    const toast = document.getElementById('cart-toast');
    const toastImg = document.getElementById('toast-img');
    const toastTitle = document.getElementById('toast-title');
    const toastSubtitle = document.getElementById('toast-subtitle');

    if (!toast) return;

    if (toastImg) toastImg.src = img || 'assets/hamsa-logo.svg';
    if (toastTitle) toastTitle.textContent = `${name}`;
    if (toastSubtitle) toastSubtitle.textContent = price ? `₹${price} • Added to Royal Cart` : 'Saved to Wishlist';

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// Cart Drawer Controls
function openCartDrawer() {
    closeMenuDrawer();
    closeSearchModal();
    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) overlay.classList.add('open');
    updateCartUI();
}

function closeCartDrawer(event) {
    if (event && event.target !== document.getElementById('cart-drawer-overlay') && !event.target.closest('.close-cart-btn')) {
        return;
    }
    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) overlay.classList.remove('open');
}
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;

// Wishlist Logic
let wishlist = JSON.parse(localStorage.getItem('persian_masala_wishlist') || '[]');

function saveWishlist() {
    localStorage.setItem('persian_masala_wishlist', JSON.stringify(wishlist));
    updateWishlistCountBadge();
}

function toggleWishlist(btn, id) {
    const index = wishlist.indexOf(id);
    const prod = royalSpicesCatalog.find(s => s.id === id) || royalSpicesCatalog[0];

    if (index > -1) {
        wishlist.splice(index, 1);
        if (btn) {
            btn.classList.remove('active');
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'far fa-heart';
        }
        showToast(`Removed ${prod.name} from Wishlist`, '', prod.img);
    } else {
        wishlist.push(id);
        if (btn) {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'fas fa-heart';
        }
        showToast(`Saved ${prod.name} to Wishlist!`, '', prod.img);
    }
    saveWishlist();
}

function updateWishlistCountBadge() {
    document.querySelectorAll('.menu-wishlist-count').forEach(badge => {
        badge.textContent = `${wishlist.length}`;
    });
}

// --- Pincode Availability Checker ---
function checkDeliveryPincode() {
    const input = document.getElementById('delivery-pincode-input');
    const statusBox = document.getElementById('pincode-status-box');
    if (!input || !statusBox) return;

    const val = input.value.trim();
    if (/^\d{6}$/.test(val)) {
        statusBox.className = 'pincode-status-box success';
        statusBox.innerHTML = '<i class="fas fa-circle-check"></i> <div>Estimated delivery in <strong>3-4 days</strong> via <strong>Delhivery</strong></div>';
        statusBox.style.display = 'flex';
    } else {
        statusBox.className = 'pincode-status-box error';
        statusBox.innerHTML = '<i class="fas fa-circle-exclamation"></i> <div>Please enter a valid <strong>6-digit Pincode</strong>.</div>';
        statusBox.style.display = 'flex';
    }
}

// --- Authentication (Login / Signup OTP Modal) ---
let authModalSource = 'checkout';
let enteredPhone = '';

function openAuthModal(source = 'checkout') {
    authModalSource = source;
    closeMenuDrawer();
    const modal = document.getElementById('auth-modal-overlay');
    if (!modal) return;

    const phoneStep = document.getElementById('auth-phone-step');
    const otpStep = document.getElementById('auth-otp-step');
    if (phoneStep) phoneStep.style.display = 'block';
    if (otpStep) otpStep.style.display = 'none';

    const errPhone = document.getElementById('auth-phone-error');
    if (errPhone) errPhone.style.display = 'none';
    const errOtp = document.getElementById('auth-otp-error');
    if (errOtp) errOtp.style.display = 'none';

    modal.classList.add('open');
    const phoneInput = document.getElementById('auth-mobile-input');
    if (phoneInput) setTimeout(() => phoneInput.focus(), 200);
}

function closeAuthModal(event) {
    if (event && event.target !== document.getElementById('auth-modal-overlay') && !event.target.closest('.auth-close-btn')) {
        return;
    }
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) modal.classList.remove('open');
}

function sendAuthOTP(channel = 'whatsapp') {
    const input = document.getElementById('auth-mobile-input');
    const errorEl = document.getElementById('auth-phone-error');
    if (!input) return;

    const raw = input.value.trim().replace(/\D/g, '');
    if (raw.length !== 10) {
        if (errorEl) {
            errorEl.textContent = 'Please enter a valid 10-digit mobile number.';
            errorEl.style.display = 'block';
        }
        return;
    }

    if (errorEl) errorEl.style.display = 'none';
    enteredPhone = raw;
    localStorage.setItem('persian_user_phone', raw);

    const displayPhoneEl = document.getElementById('auth-display-phone');
    if (displayPhoneEl) {
        displayPhoneEl.textContent = `+91 ${raw.slice(0, 5)} ${raw.slice(5)}`;
    }

    const phoneStep = document.getElementById('auth-phone-step');
    const otpStep = document.getElementById('auth-otp-step');
    if (phoneStep) phoneStep.style.display = 'none';
    if (otpStep) otpStep.style.display = 'block';

    ['otp-1', 'otp-2', 'otp-3', 'otp-4'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const otp1 = document.getElementById('otp-1');
    if (otp1) setTimeout(() => otp1.focus(), 200);
}

function backToPhoneStep() {
    const phoneStep = document.getElementById('auth-phone-step');
    const otpStep = document.getElementById('auth-otp-step');
    if (phoneStep) phoneStep.style.display = 'block';
    if (otpStep) otpStep.style.display = 'none';
}

function handleOtpInput(current, nextId, prevId) {
    if (current.value.length === 1) {
        if (nextId) {
            const nextEl = document.getElementById(nextId);
            if (nextEl) nextEl.focus();
        }
    } else if (current.value.length === 0 && window.event && window.event.key === 'Backspace') {
        if (prevId) {
            const prevEl = document.getElementById(prevId);
            if (prevEl) prevEl.focus();
        }
    }
}

function verifyOTP() {
    const d1 = document.getElementById('otp-1')?.value || '';
    const d2 = document.getElementById('otp-2')?.value || '';
    const d3 = document.getElementById('otp-3')?.value || '';
    const d4 = document.getElementById('otp-4')?.value || '';
    const code = `${d1}${d2}${d3}${d4}`;
    const errorEl = document.getElementById('auth-otp-error');

    if (code.length < 4) {
        if (errorEl) {
            errorEl.textContent = 'Please enter all 4 digits of the OTP.';
            errorEl.style.display = 'block';
        }
        return;
    }

    if (errorEl) errorEl.style.display = 'none';
    localStorage.setItem('persian_user_authenticated', 'true');
    closeAuthModal();
    updateMenuUserUI();

    if (authModalSource === 'menu') {
        showToast('Logged in successfully!', '', 'assets/hamsa-logo.svg');
        openMenuDrawer();
    } else {
        window.location.href = 'checkout.html';
    }
}

function loginWithGoogle() {
    localStorage.setItem('persian_user_authenticated', 'true');
    localStorage.setItem('persian_user_phone', '9876543210');
    localStorage.setItem('persian_user_name', 'Royal Patron');
    closeAuthModal();
    updateMenuUserUI();

    if (authModalSource === 'menu') {
        showToast('Logged in successfully', '', 'assets/hamsa-logo.svg');
        openMenuDrawer();
    } else {
        window.location.href = 'checkout.html';
    }
}

function resendOTP() {
    showToast('New OTP sent successfully!', '', 'assets/hamsa-logo.svg');
}

function handleProceedToCheckout() {
    if (cart.length === 0) {
        alert('Your Royal Cart is empty! Please add spices first.');
        return;
    }
    const isAuth = localStorage.getItem('persian_user_authenticated') === 'true';
    if (isAuth) {
        window.location.href = 'checkout.html';
    } else {
        openAuthModal('checkout');
    }
}

function logoutUser() {
    localStorage.removeItem('persian_user_authenticated');
    updateMenuUserUI();
    showToast('You have been logged out.', '', 'assets/hamsa-logo.svg');
}

// ==========================================================================
// ROYAL SLIDE-OUT MENU DRAWER LOGIC
// ==========================================================================
function openMenuDrawer() {
    closeCartDrawer();
    closeSearchModal();
    ensureModalsInDOM();
    updateMenuUserUI();
    updateWishlistCountBadge();
    const overlay = document.getElementById('menu-drawer-overlay');
    if (overlay) overlay.classList.add('open');
}

function closeMenuDrawer(event) {
    if (event && event.target !== document.getElementById('menu-drawer-overlay') && !event.target.closest('.close-menu-btn')) {
        return;
    }
    const overlay = document.getElementById('menu-drawer-overlay');
    if (overlay) overlay.classList.remove('open');
}
window.openMenuDrawer = openMenuDrawer;
window.closeMenuDrawer = closeMenuDrawer;

function updateMenuUserUI() {
    const isAuth = localStorage.getItem('persian_user_authenticated') === 'true';
    const userName = localStorage.getItem('persian_user_name') || 'Royal Patron';
    const rawPhone = localStorage.getItem('persian_user_phone') || '9876543210';
    const formattedPhone = `+91 ${rawPhone.slice(0, 5)} ${rawPhone.slice(5)}`;

    const loggedInView = document.getElementById('menu-user-loggedin');
    const loggedOutView = document.getElementById('menu-user-loggedout');
    const nameEl = document.getElementById('menu-display-name');
    const phoneEl = document.getElementById('menu-display-phone');
    const avatarEl = document.getElementById('menu-user-avatar');

    if (loggedInView && loggedOutView) {
        if (isAuth) {
            loggedInView.style.display = 'block';
            loggedOutView.style.display = 'none';
            if (nameEl) nameEl.textContent = userName;
            if (phoneEl) phoneEl.textContent = formattedPhone;
            if (avatarEl) avatarEl.textContent = userName.charAt(0).toUpperCase();
        } else {
            loggedInView.style.display = 'none';
            loggedOutView.style.display = 'block';
        }
    }

    // Update order count badge in menu
    const orders = JSON.parse(localStorage.getItem('persian_masala_orders') || '[]');
    const orderCountBadge = document.getElementById('menu-orders-badge');
    if (orderCountBadge) {
        const count = orders.length > 0 ? orders.length : 1; // 1 seeded order
        orderCountBadge.textContent = `${count} Order${count > 1 ? 's' : ''}`;
    }
}

// ==========================================================================
// INSTANT SEARCH MODAL LOGIC
// ==========================================================================
function openSearchModal() {
    closeMenuDrawer();
    closeCartDrawer();
    ensureModalsInDOM();
    const overlay = document.getElementById('search-modal-overlay');
    if (overlay) overlay.classList.add('open');
    const input = document.getElementById('global-search-input');
    if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 150);
    }
    renderLiveSearchResults('');
}

function closeSearchModal(event) {
    if (event && event.target !== document.getElementById('search-modal-overlay') && !event.target.closest('.close-search-btn')) {
        return;
    }
    const overlay = document.getElementById('search-modal-overlay');
    if (overlay) overlay.classList.remove('open');
}
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;

// Standalone global filterCatalogCategory for immediate availability
function filterCatalogCategory(cat, el) {
    const catStr = cat || 'all';
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(p => {
        if (p === el || p.getAttribute('data-category') === catStr) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
    const cards = document.querySelectorAll('.product-card');
    let count = 0;
    cards.forEach(card => {
        const cCat = card.getAttribute('data-category') || '';
        if (catStr === 'all' || cCat === catStr) {
            card.style.display = 'flex';
            count++;
        } else {
            card.style.display = 'none';
        }
    });
    const resultsCountEl = document.getElementById('results-count');
    if (resultsCountEl) resultsCountEl.textContent = count;
}
window.filterCatalogCategory = filterCatalogCategory;

function handleGlobalSearchInput(val) {
    const clearBtn = document.getElementById('global-search-clear');
    if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
    renderLiveSearchResults(val.trim().toLowerCase());
}

function clearGlobalSearch() {
    const input = document.getElementById('global-search-input');
    const clearBtn = document.getElementById('global-search-clear');
    if (input) {
        input.value = '';
        input.focus();
    }
    if (clearBtn) clearBtn.style.display = 'none';
    renderLiveSearchResults('');
}

function setQuickSearchKeyword(kw) {
    const input = document.getElementById('global-search-input');
    if (input) {
        input.value = kw;
        handleGlobalSearchInput(kw);
    }
}

function renderLiveSearchResults(q) {
    const resultsContainer = document.getElementById('search-live-results');
    if (!resultsContainer) return;

    let matched = royalSpicesCatalog;
    if (q) {
        matched = royalSpicesCatalog.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.tagline.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        );
    }

    if (matched.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 28px 16px; color: rgba(244,240,230,0.7);">
                <i class="fas fa-mortar-pestle" style="font-size: 2rem; color: #E2B66B; margin-bottom: 10px; display: block;"></i>
                <h4 style="color: #FAF7F0; margin-bottom: 4px;">No Royal Spices Found for "${q}"</h4>
                <p style="font-size: 0.85rem; margin: 0;">Try searching for <strong>Biryani</strong>, <strong>Kabab</strong>, <strong>Curry</strong>, or <strong>Zafrani</strong>.</p>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = matched.map(s => `
            <a href="product.html?id=${s.id}" class="search-result-card">
                <img src="${s.img}" alt="${s.name}" class="search-result-thumb">
                <div class="search-result-details">
                    <h4 class="search-result-name">${s.name}</h4>
                    <div class="search-result-sub">
                        <span>₹${s.price}</span> &bull; 
                        <span><i class="fas fa-star" style="color: #FFC107;"></i> ${s.rating}</span> &bull; 
                        <span style="opacity: 0.8;">${s.category}</span>
                    </div>
                </div>
                <span class="search-result-action">View <i class="fas fa-arrow-right"></i></span>
            </a>
        `).join('');
    }
}

// ==========================================================================
// ACCOUNT SUB-MODALS (My Orders, Track Order, Wishlist, Addresses, Support)
// ==========================================================================

// 1. My Orders Modal
function openOrdersModal() {
    closeMenuDrawer();
    ensureModalsInDOM();
    const overlay = document.getElementById('orders-modal-overlay');
    if (!overlay) return;

    let orders = JSON.parse(localStorage.getItem('persian_masala_orders') || '[]');
    // Seed default sample order if none exists
    if (orders.length === 0) {
        orders = [{
            id: '#PM-84920',
            date: 'Today',
            items: [{ name: 'Original - Classic - Biryani', pack: '100g', price: 249, qty: 2, img: 'assets/original-classic-biryani.png' }],
            total: '₹498',
            status: 'In Transit',
            trackingNumber: 'DLV492817402',
            deliveryEta: '3-4 Days via Delhivery Express',
            address: 'Silk Route Residency, New Delhi - 110001 (Home)'
        }];
        localStorage.setItem('persian_masala_orders', JSON.stringify(orders));
    }

    const container = document.getElementById('orders-modal-list');
    if (container) {
        container.innerHTML = orders.map(ord => `
            <div class="my-order-card">
                <div class="my-order-top-row">
                    <div>
                        <strong style="color: var(--color-dark-green); font-size: 0.95rem;">${ord.id}</strong>
                        <span style="color: #777; margin-left: 8px;">&bull; ${ord.date}</span>
                    </div>
                    <span class="order-badge-status transit">
                        <i class="fas fa-truck-fast"></i> ${ord.status}
                    </span>
                </div>
                <div style="display: flex; gap: 10px; align-items: center; border-top: 1px dashed rgba(15,44,36,0.1); border-bottom: 1px dashed rgba(15,44,36,0.1); padding: 8px 0;">
                    ${ord.items && ord.items.length > 0 ? `
                        <img src="${ord.items[0].img}" alt="" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
                        <div style="flex: 1;">
                            <h5 style="margin: 0; font-size: 0.88rem; color: #222;">${ord.items[0].name}</h5>
                            <span style="font-size: 0.75rem; color: #666;">${ord.items[0].pack || '100g'} &bull; Qty: ${ord.items[0].qty || 1}</span>
                        </div>
        ` : '<span style="color:#555;">Royal Masala Pack</span>'}
                    <strong style="color: var(--color-dark-green);">${ord.total}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.78rem; color: #666;"><i class="fas fa-location-dot"></i> Delhivery Express</span>
                    <button type="button" onclick="openTrackOrderModal('${ord.id}')" style="background: var(--color-dark-green); color: var(--color-gold); border: 1px solid var(--color-gold); border-radius: 8px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                        TRACK DELIVERY &rarr;
                    </button>
                </div>
            </div>
        `).join('');
}

overlay.classList.add('open');
}

function closeOrdersModal() {
    const overlay = document.getElementById('orders-modal-overlay');
    if (overlay) overlay.classList.remove('open');
}

// 2. Track Order Modal with Live Delhivery Timeline
function openTrackOrderModal(prefilledId = '') {
    closeMenuDrawer();
    closeOrdersModal();
    ensureModalsInDOM();
    const overlay = document.getElementById('track-order-modal-overlay');
    if (!overlay) return;

    const input = document.getElementById('track-order-id-input');
    if (input) {
        if (prefilledId) {
            input.value = prefilledId;
            trackDeliveryById(prefilledId);
        } else {
            const orders = JSON.parse(localStorage.getItem('persian_masala_orders') || '[]');
            const activeId = orders.length > 0 ? orders[0].id : '#PM-84920';
            input.value = activeId;
            trackDeliveryById(activeId);
        }
    }

    overlay.classList.add('open');
}

function closeTrackOrderModal() {
    const overlay = document.getElementById('track-order-modal-overlay');
    if (overlay) overlay.classList.remove('open');
}

function trackDeliveryById(id) {
    const cleanId = (id || document.getElementById('track-order-id-input')?.value || '#PM-84920').trim();
    const timelineEl = document.getElementById('delhivery-timeline-container');
    const waybillEl = document.getElementById('delhivery-waybill-no');

    if (waybillEl) {
        waybillEl.textContent = 'DLV' + (Math.abs(cleanId.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)) % 900000000 + 100000000);
    }

    if (timelineEl) {
        timelineEl.innerHTML = `
            <div class="timeline-step done">
                <span class="timeline-step-title">Order Confirmed &amp; Placed</span>
                <span class="timeline-step-time">Verified via Royal Kitchens &bull; Instant OTP</span>
            </div>
            <div class="timeline-step done">
                <span class="timeline-step-title">Artisanal Fresh Packing Completed</span>
                <span class="timeline-step-time">Handmade roasted spices hermetically sealed</span>
            </div>
            <div class="timeline-step active">
                <span class="timeline-step-title">Shipped via Delhivery Express Hub</span>
                <span class="timeline-step-time">In Transit &bull; Dispatched from Delhi Sort Center</span>
            </div>
            <div class="timeline-step">
                <span class="timeline-step-title">Out for Delivery</span>
                <span class="timeline-step-time">Expected in 2-3 business days</span>
            </div>
            <div class="timeline-step">
                <span class="timeline-step-title">Delivery Complete</span>
                <span class="timeline-step-time">Delivered to your doorstep</span>
            </div>
        `;
    }
}

// 3. Wishlist Modal
function openWishlistModal() {
    closeMenuDrawer();
    ensureModalsInDOM();
    const overlay = document.getElementById('wishlist-modal-overlay');
    if (!overlay) return;

    const listEl = document.getElementById('wishlist-modal-list');
    if (listEl) {
        if (wishlist.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; padding: 30px 10px; color: #666;">
                    <i class="far fa-heart" style="font-size: 2.5rem; color: #E2B66B; margin-bottom: 12px; display: block;"></i>
                    <h4 style="color: var(--color-text-dark); margin-bottom: 6px;">Your Wishlist is Empty</h4>
                    <p style="font-size: 0.85rem; margin: 0 0 16px 0;">Tap the heart icon on any spice to save it for your next royal feast.</p>
                    <a href="spices.html" class="order-continue-btn" style="display: inline-block; padding: 10px 20px;">Explore Spices</a>
                </div>
            `;
        } else {
            listEl.innerHTML = wishlist.map(id => {
                const s = royalSpicesCatalog.find(item => item.id === id) || royalSpicesCatalog[0];
                return `
                    <div class="my-order-card" style="flex-direction: row; align-items: center; gap: 12px;">
                        <img src="${s.img}" alt="${s.name}" style="width: 56px; height: 56px; border-radius: 10px; object-fit: cover; border: 1px solid #E2B66B;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 2px 0; font-size: 0.95rem; color: var(--color-text-dark);">${s.name}</h4>
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-dark-green);">₹${s.price}</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button type="button" onclick="addToCart('${s.name}', ${s.price}, '${s.img}', 1, '100g'); closeWishlistModal(); openCartDrawer();" style="background: var(--color-dark-green); color: var(--color-gold); border: 1px solid var(--color-gold); border-radius: 8px; padding: 8px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                                ADD TO BAG
                            </button>
                            <button type="button" onclick="toggleWishlist(null, '${s.id}'); openWishlistModal();" style="background: none; border: 1px solid #CCC; border-radius: 8px; padding: 8px 10px; color: #888; cursor: pointer;">
                                <i class="fas fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    overlay.classList.add('open');
}

function closeWishlistModal() {
    const overlay = document.getElementById('wishlist-modal-overlay');
    if (overlay) overlay.classList.remove('open');
}

// 4. Saved Addresses Modal
function openAddressesModal() {
    closeMenuDrawer();
    ensureModalsInDOM();
    const overlay = document.getElementById('addresses-modal-overlay');
    if (!overlay) return;

    const listEl = document.getElementById('addresses-modal-list');
    const userPhone = localStorage.getItem('persian_user_phone') || '9876543210';
    const userName = localStorage.getItem('persian_user_name') || 'Rahul Sharma';

    if (listEl) {
        listEl.innerHTML = `
            <div class="my-order-card" style="border: 2px solid var(--color-gold);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="color: var(--color-dark-green); font-size: 0.95rem;">
                        <i class="fas fa-house" style="color: #E2B66B;"></i> Home (Default)
                    </strong>
                    <span style="font-size: 0.72rem; background: #E8F5E9; color: #2E7D32; padding: 2px 8px; border-radius: 10px; font-weight: 700;">Active</span>
                </div>
                <p style="margin: 0; font-size: 0.88rem; color: #333; line-height: 1.5;">
                    <strong>${userName}</strong> &bull; +91 ${userPhone}<br>
                    Flat 402, Royal Palms Apartments, Near Silk Route Market, Connaught Place, New Delhi - 110001
                </p>
                <div style="margin-top: 8px; font-size: 0.78rem; color: #2E7D32;">
                    <i class="fas fa-circle-check"></i> Verified for Delhivery 3-4 Days Express Delivery
                </div>
            </div>

            <div class="my-order-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="color: var(--color-dark-green); font-size: 0.95rem;">
                        <i class="fas fa-briefcase" style="color: #E2B66B;"></i> Office / Work
                    </strong>
                </div>
                <p style="margin: 0; font-size: 0.88rem; color: #333; line-height: 1.5;">
                    <strong>${userName}</strong> &bull; +91 ${userPhone}<br>
                    Tech Park Tower B, 5th Floor, Cyber City, Gurugram, Haryana - 122002
                </p>
            </div>
        `;
    }

    overlay.classList.add('open');
}

function closeAddressesModal() {
    const overlay = document.getElementById('addresses-modal-overlay');
    if (overlay) overlay.classList.remove('open');
}

// 5. Support & Shipping Info Modal
function openSupportModal(section = 'support') {
    closeMenuDrawer();
    ensureModalsInDOM();
    const overlay = document.getElementById('support-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
}

function closeSupportModal() {
    const overlay = document.getElementById('support-modal-overlay');
    if (overlay) overlay.classList.remove('open');
}

// ==========================================================================
// DYNAMIC MODAL INJECTION (Ensures Menu & Search exist on every page)
// ==========================================================================
function ensureModalsInDOM() {
    // 1. Menu Drawer
    if (!document.getElementById('menu-drawer-overlay')) {
        const menuDrawerHTML = `
            <div id="menu-drawer-overlay" class="menu-drawer-overlay" onclick="closeMenuDrawer(event)">
                <div class="menu-drawer" onclick="event.stopPropagation()">
                    
                    <div class="menu-drawer-header">
                        <div class="menu-brand-tag">
                            <img src="assets/hamsa-logo.svg" alt="Hamsa Masala" class="menu-brand-logo-img">
                            <span class="menu-brand-text">HAMSA MASALA</span>
                        </div>
                        <button class="close-menu-btn" onclick="closeMenuDrawer()" aria-label="Close Menu">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- User Header Profile Card -->
                    <div class="menu-user-card">
                        <!-- Logged Out State -->
                        <div id="menu-user-loggedout">
                            <div class="menu-user-row" style="margin-bottom: 12px;">
                                <div class="menu-user-avatar"><i class="fas fa-user"></i></div>
                                <div class="menu-user-info">
                                    <h4 class="menu-user-title">Welcome to Hamsa Masala</h4>
                                    <p class="menu-user-subtitle">Handcrafted Silk Route Spices</p>
                                </div>
                            </div>
                            <button type="button" class="menu-auth-btn" onclick="openAuthModal('menu')">
                                <i class="fas fa-key"></i> LOGIN / SIGN UP
                            </button>
                        </div>

                        <!-- Logged In State -->
                        <div id="menu-user-loggedin" style="display: none;">
                            <div class="menu-user-row">
                                <div class="menu-user-avatar" id="menu-user-avatar">R</div>
                                <div class="menu-user-info">
                                    <h4 class="menu-user-title" id="menu-display-name">Rahul Sharma</h4>
                                    <p class="menu-user-subtitle" id="menu-display-phone">+91 98765 43210</p>
                                </div>
                                <span class="menu-nav-badge" style="background: rgba(46,125,50,0.2); color: #81C784; border-color: #81C784;">Royal Patron</span>
                            </div>
                            <div class="menu-logout-row">
                                <span style="font-size: 0.75rem; color: rgba(244,240,230,0.6);">Account Status: Active</span>
                                <button type="button" class="menu-logout-btn" onclick="logoutUser()">
                                    <i class="fas fa-arrow-right-from-bracket"></i> Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Section: My Account & Orders -->
                    <div class="menu-nav-section">
                        <div class="menu-section-kicker">My Account &amp; Orders</div>
                        <div class="menu-nav-list">
                            <button type="button" class="menu-nav-item" onclick="openOrdersModal()">
                                <i class="fas fa-box-archive"></i>
                                <span class="menu-nav-title">My Orders</span>
                                <span class="menu-nav-badge" id="menu-orders-badge">1 Order</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </button>
                            <button type="button" class="menu-nav-item" onclick="openTrackOrderModal()">
                                <i class="fas fa-truck-fast"></i>
                                <span class="menu-nav-title">Track Order (Delhivery)</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </button>
                            <button type="button" class="menu-nav-item" onclick="openWishlistModal()">
                                <i class="fas fa-heart"></i>
                                <span class="menu-nav-title">My Wishlist</span>
                                <span class="menu-nav-badge menu-wishlist-count">1</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </button>
                            <button type="button" class="menu-nav-item" onclick="openAddressesModal()">
                                <i class="fas fa-location-dot"></i>
                                <span class="menu-nav-title">Saved Addresses</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Section: Shop by Categories -->
                    <div class="menu-nav-section">
                        <div class="menu-section-kicker">Navigation &amp; Collections</div>
                        <div class="menu-nav-list">
                            <a href="index.html" class="menu-nav-item">
                                <i class="fas fa-house"></i>
                                <span class="menu-nav-title">Home</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </a>
                            <a href="spices.html" class="menu-nav-item">
                                <i class="fas fa-mortar-pestle"></i>
                                <span class="menu-nav-title">All Royal Spices (Catalog)</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </a>
                            <a href="spices.html?cat=blended" class="menu-nav-item">
                                <i class="fas fa-bowl-rice"></i>
                                <span class="menu-nav-title">Royal Biryani &amp; Gravy Range</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </a>
                            <a href="spices.html?cat=royal" class="menu-nav-item">
                                <i class="fas fa-gem"></i>
                                <span class="menu-nav-title">Gourmet Sweets &amp; Saffron</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </a>
                        </div>
                    </div>

                    <!-- Section: Quick Links & Support -->
                    <div class="menu-nav-section">
                        <div class="menu-section-kicker">Heritage &amp; Support</div>
                        <div class="menu-nav-list">
                            <a href="heritage.html" class="menu-nav-item">
                                <i class="fas fa-landmark"></i>
                                <span class="menu-nav-title">Our Persian Heritage</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </a>
                            <button type="button" class="menu-nav-item" onclick="openSupportModal('shipping')">
                                <i class="fas fa-rotate-left"></i>
                                <span class="menu-nav-title">Shipping &amp; Easy Returns</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </button>
                            <button type="button" class="menu-nav-item" onclick="openSupportModal('support')">
                                <i class="fas fa-headset"></i>
                                <span class="menu-nav-title">24/7 Customer Support</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="menu-drawer-footer">
                        <div class="menu-footer-motif">&#9670; ✦ &#9670;</div>
                        <div class="menu-footer-text">&copy; 2026 Hamsa Masala. Handcrafted in Royal Traditions.</div>
                        <div class="menu-social-links">
                            <a href="https://wa.me/919876543210" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                            <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>

                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuDrawerHTML);
    }

    // 2. Instant Search Modal
    if (!document.getElementById('search-modal-overlay')) {
        const searchModalHTML = `
            <div id="search-modal-overlay" class="search-modal-overlay" onclick="closeSearchModal(event)">
                <div class="search-modal-card" onclick="event.stopPropagation()">
                    
                    <div class="search-modal-header">
                        <h3 class="search-modal-title"><i class="fas fa-crown"></i> Search Royal Spices</h3>
                        <button class="close-search-btn" onclick="closeSearchModal()" aria-label="Close Search">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="search-input-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="global-search-input" placeholder="Search Biryani, Boti Delight, Turkish Shank, Sweet..." autocomplete="off" oninput="handleGlobalSearchInput(this.value)">
                        <button type="button" id="global-search-clear" class="search-clear-btn" onclick="clearGlobalSearch()">&times;</button>
                    </div>

                    <!-- Trending Quick Keyword Pills -->
                    <div class="search-keywords-row">
                        <span style="font-size: 0.75rem; color: #E2B66B; font-weight: 700; margin-right: 4px;">TRENDING:</span>
                        <button type="button" class="search-keyword-tag" onclick="setQuickSearchKeyword('Biryani')">Biryani Masala</button>
                        <button type="button" class="search-keyword-tag" onclick="setQuickSearchKeyword('Boti')">Boti Delight</button>
                        <button type="button" class="search-keyword-tag" onclick="setQuickSearchKeyword('Turkish')">Turkish Gravy</button>
                        <button type="button" class="search-keyword-tag" onclick="setQuickSearchKeyword('Sweet')">Persian Sweet</button>
                        <button type="button" class="search-keyword-tag" onclick="setQuickSearchKeyword('Kalimiri')">Kalimiri</button>
                        <button type="button" class="search-keyword-tag" onclick="setQuickSearchKeyword('Lazeez')">Lazeez Dum</button>
                    </div>

                    <!-- Live Results Scroll List -->
                    <div class="search-results-list" id="search-live-results">
                        <!-- Populated dynamically -->
                    </div>

                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', searchModalHTML);
    }

    // 3. My Orders Modal
    if (!document.getElementById('orders-modal-overlay')) {
        const ordersModalHTML = `
            <div id="orders-modal-overlay" class="royal-modal-overlay" onclick="closeOrdersModal()">
                <div class="royal-modal-card" onclick="event.stopPropagation()">
                    <div class="royal-modal-header">
                        <h3 class="royal-modal-title"><i class="fas fa-box-archive"></i> My Royal Orders</h3>
                        <button class="royal-modal-close" onclick="closeOrdersModal()">&times;</button>
                    </div>
                    <div class="royal-modal-body" id="orders-modal-list">
                        <!-- Populated dynamically -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', ordersModalHTML);
    }

    // 4. Track Order Modal
    if (!document.getElementById('track-order-modal-overlay')) {
        const trackModalHTML = `
            <div id="track-order-modal-overlay" class="royal-modal-overlay" onclick="closeTrackOrderModal()">
                <div class="royal-modal-card" onclick="event.stopPropagation()">
                    <div class="royal-modal-header">
                        <h3 class="royal-modal-title"><i class="fas fa-truck-fast"></i> Live Delhivery Tracking</h3>
                        <button class="royal-modal-close" onclick="closeTrackOrderModal()">&times;</button>
                    </div>
                    <div class="royal-modal-body">
                        
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="track-order-id-input" placeholder="Enter Order ID (e.g. #PM-84920)" style="flex: 1; padding: 10px 14px; border: 1.5px solid rgba(15,44,36,0.2); border-radius: 8px; font-weight: 600; outline: none; background: #FFFFFF;">
                            <button type="button" onclick="trackDeliveryById()" style="background: var(--color-dark-green); color: var(--color-gold); border: 1px solid var(--color-gold); border-radius: 8px; padding: 10px 18px; font-weight: 700; cursor: pointer;">
                                TRACK
                            </button>
                        </div>

                        <div style="background: #FFFFFF; border: 1px solid rgba(15,44,36,0.12); border-radius: 12px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-size: 0.75rem; color: #777;">Delhivery Waybill / AWB:</span>
                                <div id="delhivery-waybill-no" style="font-family: monospace; font-size: 0.95rem; font-weight: 700; color: var(--color-dark-green);">DLV928471029</div>
                            </div>
                            <span class="order-badge-status transit"><i class="fas fa-clock"></i> In Transit</span>
                        </div>

                        <div class="delhivery-timeline" id="delhivery-timeline-container">
                            <!-- Populated dynamically -->
                        </div>

                        <div style="background: #E8F5E9; border: 1px solid #A5D6A7; border-radius: 10px; padding: 12px; font-size: 0.82rem; color: #2E7D32; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-shield-halved" style="font-size: 1.1rem;"></i>
                            <span>Protected by Delhivery Secure Transport &amp; Persian Freshness Seal</span>
                        </div>

                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', trackModalHTML);
    }

    // 5. Wishlist Modal
    if (!document.getElementById('wishlist-modal-overlay')) {
        const wishlistModalHTML = `
            <div id="wishlist-modal-overlay" class="royal-modal-overlay" onclick="closeWishlistModal()">
                <div class="royal-modal-card" onclick="event.stopPropagation()">
                    <div class="royal-modal-header">
                        <h3 class="royal-modal-title"><i class="fas fa-heart"></i> My Wishlist</h3>
                        <button class="royal-modal-close" onclick="closeWishlistModal()">&times;</button>
                    </div>
                    <div class="royal-modal-body" id="wishlist-modal-list">
                        <!-- Populated dynamically -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', wishlistModalHTML);
    }

    // 6. Saved Addresses Modal
    if (!document.getElementById('addresses-modal-overlay')) {
        const addrModalHTML = `
            <div id="addresses-modal-overlay" class="royal-modal-overlay" onclick="closeAddressesModal()">
                <div class="royal-modal-card" onclick="event.stopPropagation()">
                    <div class="royal-modal-header">
                        <h3 class="royal-modal-title"><i class="fas fa-location-dot"></i> Saved Addresses</h3>
                        <button class="royal-modal-close" onclick="closeAddressesModal()">&times;</button>
                    </div>
                    <div class="royal-modal-body" id="addresses-modal-list">
                        <!-- Populated dynamically -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', addrModalHTML);
    }

    // 7. Support & Shipping Modal
    if (!document.getElementById('support-modal-overlay')) {
        const supportModalHTML = `
            <div id="support-modal-overlay" class="royal-modal-overlay" onclick="closeSupportModal()">
                <div class="royal-modal-card" onclick="event.stopPropagation()">
                    <div class="royal-modal-header">
                        <h3 class="royal-modal-title"><i class="fas fa-headset"></i> Support &amp; Policies</h3>
                        <button class="royal-modal-close" onclick="closeSupportModal()">&times;</button>
                    </div>
                    <div class="royal-modal-body">
                        <div class="my-order-card">
                            <h4 style="margin: 0 0 6px 0; color: var(--color-dark-green);"><i class="fab fa-whatsapp" style="color: #25D366;"></i> WhatsApp Royal Assistance</h4>
                            <p style="margin: 0 0 10px 0; font-size: 0.85rem; color: #555;">Instant spice recommendations, recipe advice, and order assistance directly on WhatsApp.</p>
                            <a href="https://wa.me/919876543210" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #FFFFFF; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; text-decoration: none;">
                                <i class="fab fa-whatsapp"></i> Chat on WhatsApp (+91 98765 43210)
                            </a>
                        </div>
                        <div class="my-order-card">
                            <h4 style="margin: 0 0 6px 0; color: var(--color-dark-green);"><i class="fas fa-truck-fast" style="color: #E2B66B;"></i> Shipping &amp; Free Delivery</h4>
                            <p style="margin: 0; font-size: 0.85rem; color: #555; line-height: 1.5;">
                                &bull; <strong>Free Delivery:</strong> On all orders above ₹499 across all Indian pin-codes.<br>
                                &bull; <strong>Express Logistics:</strong> Dispatched via <strong>Delhivery Express</strong> within 24 hours of roasting.<br>
                                &bull; <strong>Delivery Timeline:</strong> Estimated 3-4 days to your doorstep.
                            </p>
                        </div>
                        <div class="my-order-card">
                            <h4 style="margin: 0 0 6px 0; color: var(--color-dark-green);"><i class="fas fa-shield-halved" style="color: #E2B66B;"></i> 7-Day Freshness &amp; Easy Returns</h4>
                            <p style="margin: 0; font-size: 0.85rem; color: #555; line-height: 1.5;">
                                If you are not completely enchanted by the aroma and flavor of our Persian spices, enjoy a 100% no-questions-asked refund or replacement within 7 days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', supportModalHTML);
    }
}

// ==========================================================================
// CINEMATIC INTRO ANIMATION CONTROLS (Zero Flash, Solid Black Theater Mode)
// ==========================================================================
function closeIntro() {
    const introOverlay = document.getElementById('intro-overlay');
    const introVideo = document.getElementById('intro-video');
    if (!introOverlay || introOverlay.classList.contains('fade-out')) return;

    introOverlay.classList.add('fade-out');
    document.body.style.overflow = ''; // Restore full website scrolling
    setTimeout(() => {
        introOverlay.style.display = 'none';
        if (introVideo && typeof introVideo.pause === 'function') {
            introVideo.pause();
        }
    }, 700);
}

function initIntroAnimation() {
    const introVideo = document.getElementById('intro-video');
    const introOverlay = document.getElementById('intro-overlay');
    if (!introVideo || !introOverlay) return;

    // Lock body scrolling while intro video plays so website sits still behind
    document.body.style.overflow = 'hidden';

    // Zero-flash onEnded handler: immediately reveals website
    introVideo.onended = () => {
        closeIntro();
    };

    introVideo.onerror = () => {
        closeIntro();
    };

    // Safety timeout in case video stalls or finishes unexpectedly
    setTimeout(() => {
        if (introOverlay && !introOverlay.classList.contains('fade-out')) {
            closeIntro();
        }
    }, 9000);

    // Trigger video playback immediately
    try {
        const playPromise = introVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // If autoplay is blocked by strict browser policy, close cleanly without flash
                closeIntro();
            });
        }
    } catch (e) {
        closeIntro();
    }
}

// ==========================================================================
// DOM INITIALIZATIONS & BINDINGS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Intro Animation
    initIntroAnimation();

    // 1. Ensure modal and drawer elements exist
    ensureModalsInDOM();

    // 2. Initialize Cart UI and badges
    updateCartUI();
    updateWishlistCountBadge();
    updateMenuUserUI();

    // 3. Header scroll background effect
    const header = document.querySelector('.top-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 4. Connect Top Header Buttons
    // Cart button
    document.querySelectorAll('.cart-btn, #open-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    });

    // Menu Hamburger button
    document.querySelectorAll('.menu-btn, #open-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openMenuDrawer();
        });
    });

    // Search button
    document.querySelectorAll('.search-btn, .search-toggle-btn, .icon-btn[aria-label="Search"], .icon-btn[aria-label="Search Spices"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openSearchModal();
        });
    });

    // Escape key listener to close modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenuDrawer();
            closeSearchModal();
            closeCartDrawer();
            closeAuthModal();
            closeOrdersModal();
            closeTrackOrderModal();
            closeWishlistModal();
            closeAddressesModal();
            closeSupportModal();
        }
    });

    // 5. Product Catalog Filter & Search (spices.html)
    const searchInput = document.getElementById('spice-search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const categoryPills = document.querySelectorAll('.filter-pill');
    const sortSelect = document.getElementById('sort-select');
    const productGrid = document.getElementById('product-grid');
    const resultsCountEl = document.getElementById('results-count');

    if (productGrid && categoryPills.length > 0) {
        let activeCategory = 'all';
        let searchQuery = '';

        // Check category parameter in URL: ?cat=blended or ?category=whole
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('cat') || urlParams.get('category');
        if (catParam) {
            activeCategory = catParam;
            categoryPills.forEach(p => {
                if (p.getAttribute('data-category') === catParam) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
        }

        function filterProducts() {
            const cards = Array.from(productGrid.querySelectorAll('.product-card'));
            let visibleCount = 0;

            cards.forEach(card => {
                const cardName = (card.getAttribute('data-name') || '').toLowerCase();
                const cardCategory = card.getAttribute('data-category') || '';

                const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
                const matchesSearch = (!searchQuery || cardName.includes(searchQuery));

                if (matchesCategory && matchesSearch) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (resultsCountEl) resultsCountEl.textContent = visibleCount;

            let noResultsEl = document.getElementById('no-results-box');
            if (visibleCount === 0) {
                if (!noResultsEl) {
                    noResultsEl = document.createElement('div');
                    noResultsEl.id = 'no-results-box';
                    noResultsEl.className = 'no-results';
                    productGrid.appendChild(noResultsEl);
                }
                noResultsEl.innerHTML = `
                    <i class="fas fa-mortar-pestle"></i>
                    <h3>No Royal Spices Found</h3>
                    <p>We couldn't find any spices matching "${searchQuery}". Try searching for <strong>Biryani</strong>, <strong>Kabab</strong>, <strong>Curry</strong>, or <strong>Zafrani</strong>.</p>
                `;
                noResultsEl.style.display = 'block';
            } else if (noResultsEl) {
                noResultsEl.style.display = 'none';
            }
        }

        // Apply initial filter
        filterProducts();

        // Expose global category filter handler
        window.filterCatalogCategory = function(cat, el) {
            activeCategory = cat || 'all';
            const pills = document.querySelectorAll('.filter-pill');
            pills.forEach(p => {
                if (p === el || p.getAttribute('data-category') === cat) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
            filterProducts();
        };

        // Category Pills Click event listeners
        categoryPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                const cat = pill.getAttribute('data-category') || 'all';
                window.filterCatalogCategory(cat, pill);
            });
        });

        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.trim().toLowerCase();
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
                }
                filterProducts();
            });

            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    searchQuery = '';
                    clearSearchBtn.style.display = 'none';
                    searchInput.focus();
                    filterProducts();
                });
            }
        }

        // Sort Select
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortType = e.target.value;
                const cards = Array.from(productGrid.querySelectorAll('.product-card'));

                cards.sort((a, b) => {
                    const priceA = parseFloat(a.getAttribute('data-price') || '0');
                    const priceB = parseFloat(b.getAttribute('data-price') || '0');
                    const ratingA = parseFloat(a.getAttribute('data-rating') || '0');
                    const ratingB = parseFloat(b.getAttribute('data-rating') || '0');

                    if (sortType === 'price-low') return priceA - priceB;
                    if (sortType === 'price-high') return priceB - priceA;
                    if (sortType === 'rating') return ratingB - ratingA;
                    return 0;
                });

                cards.forEach(card => productGrid.appendChild(card));
            });
        }
    }
});
// ==========================================================================
// GLOBAL PRODUCT CLICK INTERCEPTOR (Fixes npx serve stripping ?id= query)
// ==========================================================================
window.addEventListener('click', (e) => {
    // Ignore cart or wishlist button clicks inside cards
    if (e.target.closest('.add-cart-btn, .wishlist-btn, .detail-wishlist-btn')) return;

    let detectedId = '';

    // 1. Check if clicked element or parent has href or onclick pointing to product.html
    const linkEl = e.target.closest('a[href*="product"], [onclick*="product"]');
    if (linkEl) {
        const hrefAttr = linkEl.getAttribute('href') || '';
        const onclickAttr = linkEl.getAttribute('onclick') || '';
        const combined = hrefAttr + ' ' + onclickAttr;
        const match = combined.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            detectedId = match[1];
        }
    }

    // 2. Also check if clicked inside any .product-card
    const cardEl = e.target.closest('.product-card');
    if (!detectedId && cardEl) {
        detectedId = cardEl.getAttribute('data-id') || '';
        if (!detectedId) {
            const titleText = (cardEl.getAttribute('data-name') || cardEl.querySelector('.card-title')?.textContent || '').toLowerCase();
            if (titleText.includes('lazeez')) detectedId = 'lazeez-dum';
            else if (titleText.includes('lababdar')) detectedId = 'murg-lababdar';
            else if (titleText.includes('murg') && titleText.includes('kalimiri')) detectedId = 'murg-kalimiri';
            else if (titleText.includes('mukhmali')) detectedId = 'murg-kalimiri';
            else if (titleText.includes('raaz') || titleText.includes('kalimiri')) detectedId = 'raaz-e-kalimiri';
            else if (titleText.includes('turkish') || titleText.includes('shank')) detectedId = 'turkish-lamb-shank';
            else if (titleText.includes('boti')) detectedId = 'boti-delight';
            else if (titleText.includes('ruz') || titleText.includes('sweet') || titleText.includes('haleebia')) detectedId = 'ruz-bi-haleebia';
            else if (titleText.includes('classic') || titleText.includes('biryani')) detectedId = 'classic-biryani';
        }
    }

    if (detectedId) {
        localStorage.setItem('hamsa_selected_product_id', detectedId);
        if (linkEl) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `product.html?id=${detectedId}#${detectedId}`;
        }
    }
}, true);
