/* ==========================================================================
   PERSIAN MASALA - CORE & E-COMMERCE LOGIC (script.js)
   ========================================================================== */

// --- Global Spices Catalog Data ---
const royalSpicesCatalog = [
    {
        id: 'lazeez-dum',
        name: 'Hamsa Lazeez Dum Biryani Masala',
        tagline: 'Secrets 40 spices • Authentic royal blend for creamy texture & deep aroma',
        description: 'Bring home the authentic taste of royal kitchens with Hamsa Lazeez Dum Biryani Masala. Crafted carefully by Team Hamsa Centre, this rich blend is designed for a creamy, velvety texture and deep aroma. Infused with traditional Persian spices, it pairs wonderfully with mawa and pure desi ghee to give a melt-in-the-mouth experience. Perfect for chicken, mutton, or rich vegetable preparations, this cold stone-ground blend guarantees an unforgettable feast. 100% natural and pure authentic flavor.',
        ingredients: 'Royal Green Cardamom, Star Anise, Ceylon Cinnamon, Cloves, Black Peppercorns, Bay Leaf, Kashmiri Red Chilies, Mace, Dried Rose Petals, Saffron.',
        category: 'Royal Biryani Range',
        catKey: 'blended',
        price: 232,
        origPrice: 282,
        discount: '18% OFF',
        weight: '60g',
        rating: 4.9,
        reviews: '1.8K',
        img: 'assets/lazeez-dum-biryani.png?v=35'
    },
    {
        id: 'classic-biryani',
        name: 'Hamsa Original Classic Biryani Masala',
        tagline: 'Secret 36 spices • The Persian Biryani Tradition',
        description: 'Bring home the authentic aroma of slow-cooked royal feasts with Hamsa Original Classic Biryani Masala. Crafted carefully by Team Hamsa Centre, this signature blend combines hand-picked spices, lightly roasted to seal in their natural fragrant oils. Designed for chicken, mutton, or vegetable biryani, it delivers a deeply flavorful, aromatic dum experience with every grain of rice. 100% natural, cold stone-ground, and packed with authentic spices.',
        ingredients: 'Persian Saffron, Green Cardamom, Star Anise, Ceylon Cinnamon, Cloves, Bay Leaves, Nutmeg, Mace, Black Cumin (Shahi Jeera).',
        category: 'Royal Biryani Range',
        catKey: 'blended',
        price: 232,
        origPrice: 282,
        discount: '18% OFF',
        weight: '60g',
        rating: 4.8,
        reviews: '2.1K',
        img: 'assets/original-classic-biryani.png?v=35'
    },
    {
        id: 'raaz-e-kalimiri',
        name: 'Raaz-e-Kalimiri Biryani',
        tagline: 'Secret 36 spices • Creamy & rich Malabar black pepper blend for royal chicken & biryani',
        category: 'Royal Biryani Range',
        catKey: 'blended',
        price: 232,
        origPrice: 282,
        discount: '18% OFF',
        weight: '60g',
        rating: 4.9,
        reviews: '1.5K',
        img: 'assets/raaz-e-kalimiri-biryani.png?v=35'
    },
    {
        id: 'turkish-lamb-shank',
        name: 'Turkish Lamb Shank Gravy',
        tagline: 'Secret 46 spices • Royal Turkish-Mughal blend for majestic fall-off-bone gravy',
        category: 'Royal Gravy Range',
        catKey: 'blended',
        price: 304,
        origPrice: 354,
        discount: '14% OFF',
        weight: '100g',
        rating: 4.9,
        reviews: '1.4K',
        img: 'assets/turkish-lamb-shank.png?v=35'
    },
    {
        id: 'boti-delight',
        name: 'Boti Delight - Behruz Gravy Instant Masala',
        tagline: 'Secret 38 spices • Authentic Persian instant gravy blend for velvety caramelized boti',
        category: 'Royal Gravy Range',
        catKey: 'blended',
        price: 180,
        origPrice: 230,
        discount: '22% OFF',
        weight: '80g',
        rating: 4.9,
        reviews: '1.9K',
        img: 'assets/boti-delight.png?v=35'
    },
    {
        id: 'murg-lababdar',
        name: 'Hamsa Shabnami Murg Lababdar Instant Gravy Masala',
        tagline: 'Secrets 58 spices • The Shahi Lababdar Tradition',
        description: 'Bring home the authentic rich taste of royal feasts with Hamsa Shabnami Murg Lababdar Instant Gravy Masala. Specially blended by Team Hamsa Centre, this gravy base combines slow-roasted cashews, melon seeds, and fragrant whole spices to save hours of prep time. Simply simmer with butter or ghee and fresh cream for a velvety, aromatic gravy with chicken, paneer, eggs, or vegetables. 100% natural, cold stone-ground, with no artificial colors or synthetic fragrances.',
        ingredients: 'Toasted Cashew Flour, Melon Seed Powder (Magaz), Kashmiri Red Chili, Roasted Garlic, Dried Kasuri Methi, Green Cardamom, Mace, Ceylon Cinnamon, Cloves, Turmeric, Sea Salt.',
        category: 'Royal Gravy Range',
        catKey: 'blended',
        price: 268,
        origPrice: 318,
        discount: '16% OFF',
        weight: '100g',
        rating: 4.9,
        reviews: '1.6K',
        img: 'assets/murg-lababdar.png?v=35'
    },
    {
        id: 'murg-kalimiri',
        name: 'Mukhmali Murg Kalimiri Gravy Masala',
        tagline: 'Secrets 58 spices • Royal Tellicherry black pepper gravy instant masala with rich almond cream',
        category: 'Royal Gravy Range',
        catKey: 'blended',
        price: 268,
        origPrice: 318,
        discount: '16% OFF',
        weight: '100g',
        rating: 4.9,
        reviews: '1.3K',
        img: 'assets/murg-kalimiri.png?v=35'
    },
    {
        id: 'ruz-bi-haleebia',
        name: 'Ruz-Bi-Haleebia (Persian Sweet)',
        tagline: 'Creamy Saffron & Rosewater Traditional Recipe | Gourmet Royal Sweet Selection',
        category: 'Gourmet Sweets',
        catKey: 'royal',
        price: 205,
        origPrice: 255,
        discount: '20% OFF',
        weight: '100g',
        rating: 5.0,
        reviews: '2.4K',
        img: 'assets/ruz-bi-haleebia.png?v=35'
    },
    {
        id: 'destiny-queen-mojito',
        name: 'Destiny Queen Mulberry Mojito',
        tagline: 'Non-Alcoholic Champagne • Premium Sparkling Drink (750 ml)',
        description: 'A royal sparkling mulberry beverage crafted with real mulberries, fresh garden mint, and zesty lemon. Refreshing, healthy, and cured by Hamsa.',
        ingredients: 'Real Black Mulberry Extract, Fresh Garden Mint Leaves, Zesty Persian Lime/Lemon, Sparkling Spring Water, Natural Fruit Sugar, Mild Botanicals.',
        category: 'Royal Beverages',
        catKey: 'royal',
        price: 750,
        origPrice: 899,
        discount: '17% OFF',
        weight: '750 ml',
        rating: 5.0,
        reviews: '850',
        img: 'assets/Destiny%20Queen%20Mulberry%20Mojito.png?v=35'
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

    // Hide shipping progress bar per brand guidelines
    const shippingBar = document.getElementById('cart-shipping-bar');
    if (shippingBar) {
        shippingBar.style.display = 'none';
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
    if (overlay) {
        overlay.style.display = 'block';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        overlay.classList.add('open');
    }
    updateCartUI();
}

function closeCartDrawer(event) {
    if (event && event.target !== document.getElementById('cart-drawer-overlay') && !event.target.closest('.close-cart-btn')) {
        return;
    }
    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (!overlay.classList.contains('open')) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }, 300);
    }
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

// --- Legacy Authentication Disabled: Replaced by Amazon-Style Delivery OTP ---
let authModalSource = 'checkout';
let enteredPhone = '';

function openAuthModal(source = 'checkout') {
    closeMenuDrawer();
    closeCartDrawer();
    if (source === 'checkout' || source === 'buynow') {
        window.location.href = 'checkout.html';
        return;
    }
    openOrdersModal();
}

function closeAuthModal(event) {
    if (event && event.target !== document.getElementById('auth-modal-overlay') && !event.target.closest('.auth-close-btn')) {
        return;
    }
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => {
            if (!modal.classList.contains('open')) {
                modal.style.display = 'none';
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
            }
        }, 300);
    }
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
        showToast('Logged in successfully!', '', 'assets/hamsa-logo.svg');
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
    window.location.href = 'checkout.html';
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
    if (overlay) {
        overlay.style.display = 'block';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        overlay.classList.add('open');
    }
}

function closeMenuDrawer(event) {
    if (event && event.target !== document.getElementById('menu-drawer-overlay') && !event.target.closest('.close-menu-btn')) {
        return;
    }
    const overlay = document.getElementById('menu-drawer-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (!overlay.classList.contains('open')) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }, 300);
    }
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
    const orders = typeof checkAndExpirePendingOtpOrders === 'function'
        ? checkAndExpirePendingOtpOrders()
        : JSON.parse(localStorage.getItem('persian_masala_orders') || '[]');
    const orderCountBadge = document.getElementById('menu-orders-badge');
    if (orderCountBadge) {
        const count = orders.length;
        orderCountBadge.textContent = `${count} Order${count === 1 ? '' : 's'}`;
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
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        overlay.classList.add('open');
    }

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
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (!overlay.classList.contains('open')) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }, 300);
    }
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

let searchDebounceTimer = null;
function handleGlobalSearchInput(val) {
    const clearBtn = document.getElementById('global-search-clear');
    if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
    const resultsContainer = document.getElementById('search-live-results');

    if (resultsContainer && val.trim().length > 0) {
        // Show royal dark skeleton shimmer placeholders while user types
        resultsContainer.innerHTML = `
            <div class="skeleton-search-item">
                <div class="skeleton-search-thumb skeleton-shimmer-dark"></div>
                <div class="skeleton-search-info">
                    <div class="skeleton-line skeleton-search-title skeleton-shimmer-dark"></div>
                    <div class="skeleton-line skeleton-search-desc skeleton-shimmer-dark"></div>
                </div>
            </div>
            <div class="skeleton-search-item">
                <div class="skeleton-search-thumb skeleton-shimmer-dark"></div>
                <div class="skeleton-search-info">
                    <div class="skeleton-line skeleton-search-title skeleton-shimmer-dark"></div>
                    <div class="skeleton-line skeleton-search-desc skeleton-shimmer-dark"></div>
                </div>
            </div>
            <div class="skeleton-search-item">
                <div class="skeleton-search-thumb skeleton-shimmer-dark"></div>
                <div class="skeleton-search-info">
                    <div class="skeleton-line skeleton-search-title skeleton-shimmer-dark"></div>
                    <div class="skeleton-line skeleton-search-desc skeleton-shimmer-dark"></div>
                </div>
            </div>
        `;
    }

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        renderLiveSearchResults(val.trim().toLowerCase());
    }, 180);
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
            s.category.toLowerCase().includes(q) ||
            (s.description && s.description.toLowerCase().includes(q)) ||
            (s.id === 'destiny-queen-mojito' && q.includes('juice'))
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

// 1. My Orders Modal + 3-Layer WhatsApp OTP Recovery & 24-Hour Auto-Cancel
const OTP_EXPIRY_HOURS_MS = 24 * 60 * 60 * 1000;

function checkAndExpirePendingOtpOrders() {
    // One-time cleanup of all previous test/fake orders in browser localStorage
    try {
        if (!localStorage.getItem('hamsa_orders_clean_reset_v1')) {
            localStorage.removeItem('persian_masala_orders');
            localStorage.removeItem('hamsa_pending_otp_order');
            localStorage.setItem('hamsa_orders_clean_reset_v1', 'true');
        }
    } catch (e) {}

    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('persian_masala_orders') || '[]');
    } catch (e) { orders = []; }

    const now = Date.now();
    let changed = false;

    // Strip any legacy seeded/fake order IDs if present
    const fakeIds = new Set(['HM-8492', 'PM-84920', 'HM-9942', 'HM-3352']);
    const filteredOrders = orders.filter(ord => {
        const cid = String(ord.orderId || ord.id || '').replace(/^#/, '').toUpperCase();
        if (fakeIds.has(cid)) {
            changed = true;
            return false;
        }
        return true;
    });

    orders = filteredOrders.map(ord => {
        if (ord.status === 'OTP Verification Pending') {
            const createdMs = ord.createdAt ? new Date(ord.createdAt).getTime() : now;
            const expiresMs = ord.expiresAt ? new Date(ord.expiresAt).getTime() : (createdMs + OTP_EXPIRY_HOURS_MS);
            if (now >= expiresMs) {
                ord.status = 'Cancelled (OTP Expired)';
                ord.cancelReason = 'Auto-cancelled after 24 hours of unverified WhatsApp OTP';
                changed = true;
            }
        }
        return ord;
    });

    if (changed) {
        localStorage.setItem('persian_masala_orders', JSON.stringify(orders));
    }

    // Also check active pending pointer
    try {
        const pendingRaw = localStorage.getItem('hamsa_pending_otp_order');
        if (pendingRaw) {
            const pendingObj = JSON.parse(pendingRaw);
            const createdMs = pendingObj.createdAt ? new Date(pendingObj.createdAt).getTime() : now;
            const expiresMs = pendingObj.expiresAt ? new Date(pendingObj.expiresAt).getTime() : (createdMs + OTP_EXPIRY_HOURS_MS);
            if (now >= expiresMs || pendingObj.status !== 'OTP Verification Pending') {
                localStorage.removeItem('hamsa_pending_otp_order');
            }
        }
    } catch (e) {}

    return orders;
}

function getActivePendingOtpOrder() {
    const orders = checkAndExpirePendingOtpOrders();
    const pendingInList = orders.find(o => o.status === 'OTP Verification Pending');
    if (pendingInList) return pendingInList;
    try {
        const raw = localStorage.getItem('hamsa_pending_otp_order');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.status === 'OTP Verification Pending') return parsed;
        }
    } catch (e) {}
    return null;
}

function refreshPendingOtpRecoveryBanner() {
    const pendingOrd = getActivePendingOtpOrder();
    let banner = document.getElementById('hamsa-sticky-otp-banner');

    if (!pendingOrd) {
        if (banner) banner.style.display = 'none';
        document.body.classList.remove('has-pending-otp-banner');
        return;
    }

    const cleanId = String(pendingOrd.orderId || pendingOrd.id || '').replace(/^#/, '');

    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'hamsa-sticky-otp-banner';
        banner.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; width: 100%; background: linear-gradient(90deg, #1E1306 0%, #2D1B06 50%, #1E1306 100%); border-bottom: 2px solid #F59E0B; color: #FAF7F0; z-index: 1000001; padding: 10px 18px; display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; box-shadow: 0 6px 24px rgba(0,0,0,0.65); font-family: "Plus Jakarta Sans", sans-serif; box-sizing: border-box;';
        document.body.prepend(banner);
    }

    banner.style.display = 'flex';
    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; line-height: 1.4; text-align: left;">
            <span style="font-size: 1.1rem;">⚠️</span>
            <div>
                <strong style="color: #FBBF24; font-size: 0.9rem;">⚠️ Your OTP verification is pending! (Order #${cleanId})</strong>
                <span style="display: block; color: #E5E7EB; font-size: 0.78rem;">OTP verification is pending. Please verify your OTP soon, otherwise your order will be automatically cancelled.</span>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" onclick="openGlobalOtpVerificationModal('${cleanId}')" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: #071813; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 800; font-size: 0.82rem; cursor: pointer; box-shadow: 0 2px 10px rgba(245, 158, 11, 0.4); white-space: nowrap;">
                Verify Now &rarr;
            </button>
        </div>
    `;
}

window.refreshPendingOtpRecoveryBanner = refreshPendingOtpRecoveryBanner;

function openGlobalOtpVerificationModal(orderIdParam = '') {
    ensureModalsInDOM();
    closeOrdersModal();
    closeMenuDrawer();

    // If we are on checkout.html and #order-success-modal is available & matches, we can use the global modal or checkout modal seamlessly
    const orders = checkAndExpirePendingOtpOrders();
    const cleanTarget = String(orderIdParam || '').replace(/^#/, '');
    let targetOrder = orders.find(o => String(o.orderId || o.id || '').replace(/^#/, '') === cleanTarget);
    if (!targetOrder) {
        targetOrder = getActivePendingOtpOrder();
    }
    if (!targetOrder) return;

    const cleanId = String(targetOrder.orderId || targetOrder.id || 'HM-1050').replace(/^#/, '');
    const otpCode = String(targetOrder.whatsappOtp || '4829');
    const waText = `Hello Hamsa Masala! Confirm my Order #${cleanId}. My OTP to verify on the website is: ${otpCode}. (Please verify this OTP on the website to confirm your order).`;
    const waUrl = `https://wa.me/919167435089?text=${encodeURIComponent(waText)}`;

    let modalOverlay = document.getElementById('global-otp-verify-modal-overlay');
    if (!modalOverlay) {
        const html = `
            <div id="global-otp-verify-modal-overlay" class="royal-modal-overlay" style="display: none; visibility: hidden; opacity: 0; position: fixed; inset: 0; z-index: 1000005; background: rgba(4, 14, 11, 0.92); backdrop-filter: blur(12px); align-items: center; justify-content: center; padding: 18px;" onclick="closeGlobalOtpVerificationModal(event)">
                <div class="royal-modal-card" style="max-width: 480px; width: 100%; background: #0E2820; border: 2px solid #E2B66B; border-radius: 22px; color: #FAF7F0; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.85);" onclick="event.stopPropagation()">
                    <div style="background: linear-gradient(135deg, #092019, #12362B); padding: 22px 20px; text-align: center; border-bottom: 1.5px solid rgba(226,182,107,0.3); position: relative;">
                        <button type="button" onclick="closeGlobalOtpVerificationModal()" style="position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 50%; background: rgba(226,182,107,0.15); border: 1px solid rgba(226,182,107,0.35); color: #E2B66B; cursor: pointer; font-size: 1rem;">&times;</button>
                        <div id="global-otp-modal-icon" style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #E2B66B, #C79056); color: #071813; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 10px auto;">
                            <i class="fab fa-whatsapp"></i>
                        </div>
                        <h3 id="global-otp-modal-title" style="font-family: 'Cinzel', serif; font-size: 1.35rem; color: #E2B66B; margin: 0 0 4px 0;">Complete OTP Verification</h3>
                        <p id="global-otp-modal-sub" style="font-size: 0.84rem; color: #A6B5AF; margin: 0;">Order <strong id="global-otp-order-id" style="color: #FAF7F0;">#${cleanId}</strong></p>
                    </div>
                    <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
                        <div id="global-otp-warning-box" style="background: rgba(245, 158, 11, 0.14); border: 1.5px solid rgba(245, 158, 11, 0.45); border-radius: 12px; padding: 11px 14px; color: #FBBF24; font-size: 0.82rem; line-height: 1.45;">
                            <i class="fas fa-triangle-exclamation"></i> OTP verification is pending. Please verify your OTP soon, otherwise your order will be automatically cancelled.
                        </div>
                        <div id="global-otp-form-area" style="display: flex; flex-direction: column; gap: 12px;">
                            <div style="font-size: 0.83rem; color: #FAF7F0; line-height: 1.45;">
                                1. Send your WhatsApp confirmation message containing your 4-digit OTP (<strong id="global-otp-code-hint" style="color: #E2B66B; font-family: monospace;">${otpCode}</strong>):
                            </div>
                            <a id="global-otp-wa-link" href="${waUrl}" target="_blank" rel="noopener noreferrer" style="background: #25D366; color: #FFFFFF; text-decoration: none; padding: 12px 16px; border-radius: 12px; font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <i class="fab fa-whatsapp" style="font-size: 1.15rem;"></i> Open WhatsApp Message
                            </a>
                            <div>
                                <label for="global-otp-digit-input" style="display: block; font-size: 0.78rem; font-weight: 800; color: #E2B66B; text-transform: uppercase; margin-bottom: 6px;">2. Enter 4-Digit WhatsApp OTP:</label>
                                <input type="text" id="global-otp-digit-input" maxlength="4" inputmode="numeric" placeholder="Enter 4-digit OTP" style="width: 100%; padding: 13px; background: #071510; border: 2px solid #E2B66B; border-radius: 10px; color: #FFFFFF; font-family: monospace; font-size: 1.3rem; font-weight: 800; letter-spacing: 6px; text-align: center; outline: none; box-sizing: border-box;">
                                <div id="global-otp-error-text" style="display: none; color: #F87171; font-size: 0.8rem; font-weight: 600; margin-top: 6px; text-align: center;"></div>
                            </div>
                            <button type="button" id="global-otp-submit-btn" onclick="submitGlobalOtpVerification()" style="width: 100%; background: linear-gradient(135deg, #E2B66B, #C79056); color: #071813; border: none; border-radius: 12px; padding: 14px; font-family: 'Cinzel', serif; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <i class="fas fa-user-check"></i> Verify My Number
                            </button>
                        </div>
                        <div id="global-otp-confirmed-area" style="display: none; background: rgba(74, 222, 128, 0.14); border: 2px solid #4ADE80; border-radius: 14px; padding: 18px; text-align: center;">
                            <div style="font-size: 2.2rem; margin-bottom: 6px;">🎉</div>
                            <h4 style="font-family: 'Cinzel', serif; color: #E2B66B; font-size: 1.2rem; margin: 0 0 6px 0;">Order Confirmed!</h4>
                            <p style="font-size: 0.85rem; color: #FAF7F0; margin: 0;">Shukriya! Your WhatsApp OTP is verified and your order status is now <strong>Verified - Confirmed</strong>.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        modalOverlay = document.getElementById('global-otp-verify-modal-overlay');
    }

    modalOverlay.setAttribute('data-order-id', cleanId);
    modalOverlay.setAttribute('data-otp', otpCode);

    document.getElementById('global-otp-order-id').textContent = `#${cleanId}`;
    document.getElementById('global-otp-code-hint').textContent = otpCode;
    document.getElementById('global-otp-wa-link').href = waUrl;
    document.getElementById('global-otp-modal-title').textContent = 'Complete OTP Verification';
    document.getElementById('global-otp-warning-box').style.display = 'block';
    document.getElementById('global-otp-form-area').style.display = 'flex';
    document.getElementById('global-otp-confirmed-area').style.display = 'none';
    document.getElementById('global-otp-digit-input').value = '';
    document.getElementById('global-otp-error-text').style.display = 'none';

    modalOverlay.style.display = 'flex';
    modalOverlay.style.visibility = 'visible';
    modalOverlay.style.opacity = '1';
    modalOverlay.style.pointerEvents = 'auto';
}

function closeGlobalOtpVerificationModal() {
    const modalOverlay = document.getElementById('global-otp-verify-modal-overlay');
    if (modalOverlay) {
        modalOverlay.style.display = 'none';
        modalOverlay.style.visibility = 'hidden';
        modalOverlay.style.opacity = '0';
        modalOverlay.style.pointerEvents = 'none';
    }
}

async function submitGlobalOtpVerification() {
    const modalOverlay = document.getElementById('global-otp-verify-modal-overlay');
    if (!modalOverlay) return;

    const cleanId = modalOverlay.getAttribute('data-order-id') || '';
    const expectedOtp = modalOverlay.getAttribute('data-otp') || '';
    const inputEl = document.getElementById('global-otp-digit-input');
    const errEl = document.getElementById('global-otp-error-text');
    const btnEl = document.getElementById('global-otp-submit-btn');

    const entered = (inputEl?.value || '').trim();
    if (!/^\d{4}$/.test(entered)) {
        if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = 'Please enter your 4-digit WhatsApp OTP.';
        }
        return;
    }

    if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    }

    let verifiedOk = false;
    let errMsg = '';
    try {
        const res = await fetch('/api/orders/verify-whatsapp-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: cleanId, otp: entered })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            verifiedOk = true;
        } else {
            errMsg = data.message || '';
        }
    } catch (e) {}

    if (!verifiedOk && expectedOtp && entered === String(expectedOtp).trim()) {
        verifiedOk = true;
    }

    if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<i class="fas fa-user-check"></i> Verify My Number';
    }

    if (!verifiedOk) {
        if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = errMsg || 'Incorrect OTP. Please check your WhatsApp message and try again.';
        }
        return;
    }

    // Update localStorage order status to "Verified - Confirmed"
    try {
        let orders = JSON.parse(localStorage.getItem('persian_masala_orders') || '[]');
        orders = orders.map(o => {
            if (String(o.orderId || o.id || '').replace(/^#/, '') === cleanId) {
                return { ...o, status: 'Verified - Confirmed', otpVerified: true, verifiedAt: new Date().toISOString() };
            }
            return o;
        });
        localStorage.setItem('persian_masala_orders', JSON.stringify(orders));
        localStorage.removeItem('hamsa_pending_otp_order');
    } catch (e) {}

    refreshPendingOtpRecoveryBanner();

    document.getElementById('global-otp-modal-title').textContent = 'Order Confirmed!';
    document.getElementById('global-otp-warning-box').style.display = 'none';
    document.getElementById('global-otp-form-area').style.display = 'none';
    document.getElementById('global-otp-confirmed-area').style.display = 'block';
}

window.openGlobalOtpVerificationModal = openGlobalOtpVerificationModal;
window.closeGlobalOtpVerificationModal = closeGlobalOtpVerificationModal;
window.submitGlobalOtpVerification = submitGlobalOtpVerification;

function openOrdersModal() {
    closeMenuDrawer();
    ensureModalsInDOM();
    const overlay = document.getElementById('orders-modal-overlay');
    if (!overlay) return;

    const orders = checkAndExpirePendingOtpOrders();

    const container = document.getElementById('orders-modal-list');
    if (container) {
        if (orders.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 32px 14px; color: #666;">
                    <i class="fas fa-box-open" style="font-size: 2.5rem; color: #E2B66B; margin-bottom: 12px; display: block;"></i>
                    <h4 style="color: var(--color-text-dark); margin-bottom: 6px;">No Orders Yet</h4>
                    <p style="font-size: 0.85rem; margin: 0 0 16px 0;">You haven't placed any orders yet. Explore our royal handcrafted blends to place your first order.</p>
                    <a href="spices.html" class="order-continue-btn" style="display: inline-block; padding: 10px 20px;">Explore Royal Spices</a>
                </div>
            `;
        } else {
            container.innerHTML = orders.map(ord => {
                const cleanId = String(ord.orderId || ord.id || '').replace(/^#/, '');
                const isPendingOtp = ord.status === 'OTP Verification Pending';
                const isCancelled = (ord.status || '').toLowerCase().includes('cancel') || (ord.status || '').toLowerCase().includes('refund');
                const badgeStyle = isPendingOtp
                    ? 'background: #FFF3E0; color: #E65100; border: 1px solid #FFB74D;'
                    : isCancelled
                        ? 'background: #FFEBEE; color: #C62828; border: 1px solid #EF9A9A;'
                        : 'background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7;';

                return `
                <div class="my-order-card" style="${isPendingOtp ? 'border: 2px solid #F59E0B;' : ''}">
                    <div class="my-order-top-row">
                        <div>
                            <strong style="color: var(--color-dark-green); font-size: 0.95rem;">#${cleanId}</strong>
                            <span style="color: #777; margin-left: 8px;">&bull; ${ord.date || 'Today'}</span>
                        </div>
                        <span class="order-badge-status" style="padding: 4px 10px; border-radius: 12px; font-size: 0.74rem; font-weight: 800; ${badgeStyle}">
                            <i class="fas ${isPendingOtp ? 'fa-triangle-exclamation' : isCancelled ? 'fa-ban' : 'fa-circle-check'}"></i> ${ord.status}
                        </span>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center; border-top: 1px dashed rgba(18, 52, 42,0.1); border-bottom: 1px dashed rgba(18, 52, 42,0.1); padding: 8px 0;">
                        ${ord.items && ord.items.length > 0 ? `
                            <img src="${ord.items[0].img}" alt="" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
                            <div style="flex: 1;">
                                <h5 style="margin: 0; font-size: 0.88rem; color: #222;">${ord.items[0].name}</h5>
                                <span style="font-size: 0.75rem; color: #666;">${ord.items[0].pack || '100g'} &bull; Qty: ${ord.items[0].qty || 1}</span>
                            </div>
                        ` : '<span style="color:#555;">Royal Masala Pack</span>'}
                        <strong style="color: var(--color-dark-green);">${ord.total || ('₹' + (ord.totalAmount || 0))}</strong>
                    </div>
                    ${isPendingOtp ? `
                        <div style="background: #FFF8E1; border: 1px dashed #F59E0B; border-radius: 8px; padding: 8px 12px; margin-top: 8px;">
                            <div style="font-size: 0.76rem; color: #B45309; font-weight: 600; margin-bottom: 8px; line-height: 1.4;">
                                <i class="fas fa-clock"></i> OTP verification is pending. Please verify your OTP soon, otherwise your order will be automatically cancelled.
                            </div>
                            <button type="button" onclick="openGlobalOtpVerificationModal('${cleanId}')" style="width: 100%; background: linear-gradient(135deg, #F59E0B, #D97706); color: #071813; border: none; border-radius: 8px; padding: 9px 14px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                <i class="fab fa-whatsapp"></i> Complete OTP Verification
                            </button>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                        <span style="font-size: 0.78rem; color: #666;"><i class="fas fa-truck-fast"></i> ${ord.courierName || 'Smart Surface Logistics'}</span>
                        <button type="button" onclick="openTrackOrderModal('#${cleanId}')" style="background: var(--color-dark-green); color: var(--color-gold); border: 1px solid var(--color-gold); border-radius: 8px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                            TRACK ORDER &rarr;
                        </button>
                    </div>
                </div>
            `}).join('');
        }
    }

    overlay.style.display = 'flex';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    overlay.classList.add('open');
}

function closeOrdersModal() {
    const overlay = document.getElementById('orders-modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (!overlay.classList.contains('open')) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }, 300);
    }
}

// 2. Track Order Modal with Live NimbusPost Surface Timeline
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
            const orders = checkAndExpirePendingOtpOrders();
            const activeId = orders.length > 0 ? (orders[0].id || `#${orders[0].orderId}`) : '';
            input.value = activeId;
            trackDeliveryById(activeId);
        }
    }

    overlay.style.display = 'flex';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    overlay.classList.add('open');
}

function closeTrackOrderModal() {
    const overlay = document.getElementById('track-order-modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (!overlay.classList.contains('open')) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }, 300);
    }
}

async function trackDeliveryById(id) {
    const rawId = (id !== undefined ? id : (document.getElementById('track-order-id-input')?.value || '')).trim();
    const cleanId = rawId.replace(/^#/, '');
    const timelineEl = document.getElementById('delhivery-timeline-container');
    const waybillEl = document.getElementById('delhivery-waybill-no');

    if (!cleanId) {
        if (waybillEl) waybillEl.textContent = '—';
        if (timelineEl) {
            timelineEl.innerHTML = `
                <div style="text-align: center; padding: 24px 12px; color: #666;">
                    <i class="fas fa-truck-fast" style="font-size: 2rem; color: #E2B66B; margin-bottom: 10px; display: block;"></i>
                    <strong style="color: var(--color-dark-green); display: block; margin-bottom: 4px;">No Active Order Selected</strong>
                    <p style="font-size: 0.82rem; margin: 0;">Place an order first or enter your Order ID above to view live Surface courier tracking.</p>
                </div>
            `;
        }
        return;
    }

    let orderData = null;
    try {
        const res = await fetch(`/api/orders/track?id=${encodeURIComponent(cleanId)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.success && data.order) orderData = data.order;
        }
    } catch (e) {}

    if (!orderData) {
        const localOrders = checkAndExpirePendingOtpOrders();
        orderData = localOrders.find(o => String(o.orderId || o.id || '').replace(/^#/, '').toUpperCase() === cleanId.toUpperCase());
    }

    if (!orderData) {
        if (waybillEl) waybillEl.textContent = 'Not Found';
        if (timelineEl) {
            timelineEl.innerHTML = `
                <div style="text-align: center; padding: 24px 12px; color: #C62828;">
                    <i class="fas fa-circle-exclamation" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
                    <strong style="display: block; margin-bottom: 4px;">Order #${cleanId} Not Found</strong>
                    <p style="font-size: 0.82rem; color: #666; margin: 0;">Please check your Order ID and try again.</p>
                </div>
            `;
        }
        return;
    }

    const status = orderData.status || 'Verified - Confirmed';
    const awb = orderData.awbNumber || 'Awaiting Courier Assignment';

    if (waybillEl) {
        waybillEl.textContent = status === 'OTP Verification Pending' ? 'Pending OTP Verification' : awb;
    }

    if (timelineEl) {
        if (status === 'OTP Verification Pending') {
            timelineEl.innerHTML = `
                <div style="background: #FFF8E1; border: 1.5px solid #F59E0B; border-radius: 12px; padding: 14px; margin-bottom: 10px;">
                    <strong style="color: #B45309; display: block; margin-bottom: 4px;"><i class="fas fa-triangle-exclamation"></i> OTP Verification Pending</strong>
                    <p style="font-size: 0.8rem; color: #92400E; margin: 0 0 10px 0;">OTP verification is pending. Please verify your OTP soon, otherwise your order will be automatically cancelled.</p>
                    <button type="button" onclick="closeTrackOrderModal(); openGlobalOtpVerificationModal('${cleanId}');" style="background: #F59E0B; color: #071813; border: none; border-radius: 8px; padding: 8px 14px; font-weight: 800; font-size: 0.8rem; cursor: pointer;">
                        Complete OTP Verification &rarr;
                    </button>
                </div>
            `;
            return;
        }

        const isShipped = ['Shipped', 'In Transit', 'Out for Delivery', 'Delivered'].includes(status);
        const isOut = ['Out for Delivery', 'Delivered'].includes(status);
        const isDelivered = status === 'Delivered';

        timelineEl.innerHTML = `
            <div class="timeline-step done">
                <span class="timeline-step-title">WhatsApp OTP Verified &amp; Order Confirmed</span>
                <span class="timeline-step-time">Status: ${status}</span>
            </div>
            <div class="timeline-step ${isShipped ? 'done' : 'active'}">
                <span class="timeline-step-title">Fresh Packing &amp; Surface Courier Assignment</span>
                <span class="timeline-step-time">Origin Hub: 400612 &bull; ${orderData?.courierName || 'Smart Surface Partner'}</span>
            </div>
            <div class="timeline-step ${isOut ? 'done' : (isShipped ? 'active' : '')}">
                <span class="timeline-step-title">Shipped &amp; In Transit (AWB: ${awb})</span>
                <span class="timeline-step-time">Dispatched via Surface Logistics</span>
            </div>
            <div class="timeline-step ${isDelivered ? 'done' : (status === 'Out for Delivery' ? 'active' : '')}">
                <span class="timeline-step-title">Out for Delivery</span>
                <span class="timeline-step-time">Courier partner en route to your address</span>
            </div>
            <div class="timeline-step ${isDelivered ? 'done' : ''}">
                <span class="timeline-step-title">Delivered</span>
                <span class="timeline-step-time">Handed over at your doorstep</span>
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
                            <button type="button" onclick="addToCart('${s.name}', ${s.price}, '${s.img}', 1, '${s.weight || '100g'}'); closeWishlistModal(); openCartDrawer();" style="background: var(--color-dark-green); color: var(--color-gold); border: 1px solid var(--color-gold); border-radius: 8px; padding: 8px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
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

    overlay.style.display = 'flex';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    overlay.classList.add('open');
}

function closeWishlistModal() {
    const overlay = document.getElementById('wishlist-modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (!overlay.classList.contains('open')) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }, 300);
    }
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

    overlay.style.display = 'flex';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    overlay.classList.add('open');
}

function closeAddressesModal() {
    const overlay = document.getElementById('addresses-modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (!overlay.classList.contains('open')) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }, 300);
    }
}

// 5. Support & Shipping Info Modal
function openSupportModal(section = 'support') {
    closeMenuDrawer();
    ensureModalsInDOM();
    const overlay = document.getElementById('support-modal-overlay');
    if (!overlay) return;

    overlay.style.display = 'flex';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    overlay.classList.add('open');
}

function closeSupportModal() {
    const overlay = document.getElementById('support-modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => {
            if (!overlay.classList.contains('open')) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }, 300);
    }
}

// ==========================================================================
// DYNAMIC MODAL INJECTION (Ensures Menu & Search exist on every page)
// ==========================================================================
function ensureModalsInDOM() {
    // Helper string for hidden state
    const hiddenStyle = 'style="display: none; visibility: hidden; opacity: 0; position: fixed; pointer-events: none; z-index: -9999; top: 0; left: 0; width: 100vw; height: 100vh;"';

    // 1. Menu Drawer
    if (!document.getElementById('menu-drawer-overlay')) {
        const menuDrawerHTML = `
            <div id="menu-drawer-overlay" class="menu-drawer-overlay" ${hiddenStyle} onclick="closeMenuDrawer(event)">
                <div class="menu-drawer" onclick="event.stopPropagation()">
                    
                    <div class="menu-drawer-header">
                        <div class="menu-brand-tag" style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
                            <img src="assets/hamsa-logo.svg" alt="Hamsa Masala" class="menu-brand-logo-img" style="height: 42px; width: auto; max-width: 44px; object-fit: contain; flex-shrink: 0; display: block;">
                            <span class="menu-brand-text" style="font-family: 'Cinzel', serif; font-size: 1.15rem; font-weight: 700; color: #E2B66B; letter-spacing: 1.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1;">HAMSA MASALA</span>
                        </div>
                        <button class="close-menu-btn" onclick="closeMenuDrawer()" aria-label="Close Menu" style="flex-shrink: 0; margin-left: auto;">
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
                            <button type="button" class="menu-auth-btn" onclick="openOrdersModal()">
                                <i class="fas fa-box-archive"></i> VIEW MY ORDERS &amp; OTP
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
                                <button type="button" class="menu-logout-btn" onclick="openOrdersModal()">
                                    <i class="fas fa-box-archive"></i> My Orders
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
                                <span class="menu-nav-title">My Orders &amp; WhatsApp OTP</span>
                                <span class="menu-nav-badge" id="menu-orders-badge">0 Orders</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </button>
                            <button type="button" class="menu-nav-item" onclick="openTrackOrderModal()">
                                <i class="fas fa-truck-fast"></i>
                                <span class="menu-nav-title">Track Order (Surface Logistics)</span>
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
                                <span class="menu-nav-title">Gourmet Sweets &amp; Beverages</span>
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
                            <a href="about.html" class="menu-nav-item">
                                <i class="fas fa-crown"></i>
                                <span class="menu-nav-title">About Hamsa Masala</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </a>
                            <a href="privacy.html" class="menu-nav-item">
                                <i class="fas fa-shield-halved"></i>
                                <span class="menu-nav-title">Privacy Policy</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </a>
                            <a href="terms.html" class="menu-nav-item">
                                <i class="fas fa-scale-balanced"></i>
                                <span class="menu-nav-title">Terms &amp; Conditions</span>
                                <i class="fas fa-chevron-right menu-nav-chevron"></i>
                            </a>
                            <button type="button" class="menu-nav-item" onclick="openSupportModal('shipping')">
                                <i class="fas fa-truck-fast"></i>
                                <span class="menu-nav-title">Express Shipping &amp; Logistics</span>
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
                            <a href="https://wa.me/919167435089" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
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
            <div id="search-modal-overlay" class="search-modal-overlay" ${hiddenStyle} onclick="closeSearchModal(event)">
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
            <div id="orders-modal-overlay" class="royal-modal-overlay" ${hiddenStyle} onclick="closeOrdersModal()">
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
            <div id="track-order-modal-overlay" class="royal-modal-overlay" ${hiddenStyle} onclick="closeTrackOrderModal()">
                <div class="royal-modal-card" onclick="event.stopPropagation()">
                    <div class="royal-modal-header">
                        <h3 class="royal-modal-title"><i class="fas fa-truck-fast"></i> Live Surface Order Tracking</h3>
                        <button class="royal-modal-close" onclick="closeTrackOrderModal()">&times;</button>
                    </div>
                    <div class="royal-modal-body">
                        
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="track-order-id-input" placeholder="Enter your Order ID (e.g. #HM-1234)" style="flex: 1; padding: 10px 14px; border: 1.5px solid rgba(18, 52, 42,0.2); border-radius: 8px; font-weight: 600; outline: none; background: #FFFFFF;">
                            <button type="button" onclick="trackDeliveryById()" style="background: var(--color-dark-green); color: var(--color-gold); border: 1px solid var(--color-gold); border-radius: 8px; padding: 10px 18px; font-weight: 700; cursor: pointer;">
                                TRACK
                            </button>
                        </div>
                        <div style="background: #FFFFFF; border: 1px solid rgba(18, 52, 42,0.12); border-radius: 12px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-size: 0.75rem; color: #777;">Courier Waybill / AWB:</span>
                                <div id="delhivery-waybill-no" style="font-family: monospace; font-size: 0.95rem; font-weight: 700; color: var(--color-dark-green);">—</div>
                            </div>
                            <span class="order-badge-status transit"><i class="fas fa-truck-fast"></i> Surface Logistics</span>
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
            <div id="wishlist-modal-overlay" class="royal-modal-overlay" ${hiddenStyle} onclick="closeWishlistModal()">
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
            <div id="addresses-modal-overlay" class="royal-modal-overlay" ${hiddenStyle} onclick="closeAddressesModal()">
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
            <div id="support-modal-overlay" class="royal-modal-overlay" ${hiddenStyle} onclick="closeSupportModal()">
                <div class="royal-modal-card" onclick="event.stopPropagation()">
                    <div class="royal-modal-header">
                        <h3 class="royal-modal-title"><i class="fas fa-headset"></i> Support &amp; Policies</h3>
                        <button class="royal-modal-close" onclick="closeSupportModal()">&times;</button>
                    </div>
                    <div class="royal-modal-body">
                        <div class="my-order-card">
                            <h4 style="margin: 0 0 6px 0; color: var(--color-dark-green);"><i class="fab fa-whatsapp" style="color: #25D366;"></i> WhatsApp Royal Concierge</h4>
                            <p style="margin: 0 0 10px 0; font-size: 0.85rem; color: #555;">Instant spice recommendations, recipe advice, and order assistance directly on WhatsApp.</p>
                            <a href="https://wa.me/919167435089" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #FFFFFF; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; text-decoration: none;">
                                <i class="fab fa-whatsapp"></i> Chat on WhatsApp (+91 91674 35089)
                            </a>
                        </div>
                        <div class="my-order-card">
                            <h4 style="margin: 0 0 6px 0; color: var(--color-dark-green);"><i class="fas fa-truck-fast" style="color: #E2B66B;"></i> Cancellation, Return &amp; Refund Policy</h4>
                            <p style="margin: 0; font-size: 0.84rem; color: #555; line-height: 1.55;">
                                &bull; <strong>1. Order Cancellation (Before Dispatch):</strong> Cancel anytime before courier handover ("Pending" or "Confirmed") for a 100% full refund. Once shipped, orders cannot be cancelled. Unjustified doorstep refusal of a prepaid shipment incurs an <strong>₹80</strong> round-trip shipping deduction.<br>
                                &bull; <strong>2. Food Hygiene &amp; No-Return Policy:</strong> Due to FSSAI food safety and hygiene standards, no returns/exchanges on opened, unsealed, or used spice packets and beverages, or for personal taste preferences once delivered intact.<br>
                                &bull; <strong>3. Free Replacement / Refund (Damaged, Leaked, or Wrong Items):</strong> 100% Free Replacement or Full Refund if you share a clear photo or continuous unboxing video showing the outer shipping label and product issue on WhatsApp within <strong>48 hours of delivery</strong>. Approved refunds are processed within <strong>5&ndash;7 business days</strong>.
                            </p>
                        </div>
                        <div class="my-order-card">
                            <h4 style="margin: 0 0 6px 0; color: var(--color-dark-green);"><i class="fas fa-shield-halved" style="color: #E2B66B;"></i> Authentic Freshness &amp; Quality Guarantee</h4>
                            <p style="margin: 0; font-size: 0.85rem; color: #555; line-height: 1.5;">
                                100% pure cold stone-ground spices. If your package arrives damaged in transit, enjoy an immediate replacement upon photo verification.
                            </p>
                        </div>
                        <div class="my-order-card" style="background: rgba(226, 182, 107, 0.08); border: 1px solid rgba(226, 182, 107, 0.3);">
                            <h4 style="margin: 0 0 8px 0; color: #12342A;"><i class="fas fa-scale-balanced" style="color: #E2B66B;"></i> Legal &amp; Brand Policies</h4>
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <a href="privacy.html" style="color: #12342A; font-weight: 700; text-decoration: underline; font-size: 0.85rem;"><i class="fas fa-shield-halved"></i> Privacy Policy</a>
                                <span style="color: #999;">&bull;</span>
                                <a href="terms.html" style="color: #12342A; font-weight: 700; text-decoration: underline; font-size: 0.85rem;"><i class="fas fa-file-contract"></i> Terms &amp; Conditions</a>
                                <span style="color: #999;">&bull;</span>
                                <a href="about.html" style="color: #12342A; font-weight: 700; text-decoration: underline; font-size: 0.85rem;"><i class="fas fa-crown"></i> About Us</a>
                            </div>
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
// ROYAL SKELETON SHIMMER LOADER CONTROLLER
// Matches Persian Luxury Theme (Cream, Gold & Velvety Emerald Shimmer)
// ==========================================================================
function initSkeletonShimmerLoaders() {
    const images = document.querySelectorAll('.card-img, .detail-main-img, .spice-showcase-img, .search-result-thumb');

    images.forEach(img => {
        function markLoaded() {
            img.classList.add('shimmer-loaded');
            const wrapper = img.closest('.card-img-wrapper, .detail-main-img-box, .spice-showcase-container');
            if (wrapper) {
                wrapper.classList.add('shimmer-loaded');
            }
        }

        if (img.complete && img.naturalWidth > 0) {
            markLoaded();
        } else {
            img.addEventListener('load', markLoaded, { once: true });
            img.addEventListener('error', markLoaded, { once: true });
        }
    });

    // Failsafe timer: after 1800ms, reveal all images regardless of network delays
    setTimeout(() => {
        document.querySelectorAll('.card-img:not(.shimmer-loaded), .detail-main-img:not(.shimmer-loaded), .spice-showcase-img:not(.shimmer-loaded)').forEach(img => {
            img.classList.add('shimmer-loaded');
            const wrapper = img.closest('.card-img-wrapper, .detail-main-img-box, .spice-showcase-container');
            if (wrapper) wrapper.classList.add('shimmer-loaded');
        });
    }, 1800);
}

// Global Skeleton test trigger for live preview & developer verification
window.triggerSkeletonTest = function (durationMs = 2000) {
    const skeletonGrid = document.getElementById('catalog-skeleton-grid');
    const productGrid = document.getElementById('product-grid');
    if (skeletonGrid && productGrid) {
        skeletonGrid.style.display = 'grid';
        productGrid.style.display = 'none';
        setTimeout(() => {
            skeletonGrid.style.display = 'none';
            productGrid.style.display = 'grid';
        }, durationMs);
    }
    document.querySelectorAll('.card-img-wrapper, .detail-main-img-box, .spice-showcase-container').forEach(el => {
        el.classList.remove('shimmer-loaded');
        setTimeout(() => el.classList.add('shimmer-loaded'), durationMs);
    });
    document.querySelectorAll('.card-img, .detail-main-img, .spice-showcase-img').forEach(img => {
        img.classList.remove('shimmer-loaded');
        setTimeout(() => img.classList.add('shimmer-loaded'), durationMs);
    });
};

window.initSkeletonShimmerLoaders = initSkeletonShimmerLoaders;

// ==========================================================================
// DOM INITIALIZATIONS & BINDINGS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // 0. Initialize Intro Animation & Skeleton Loaders
    initIntroAnimation();
    initSkeletonShimmerLoaders();

    // Ensure background videos (.heritage-bg-video, .home-bg-video) play smoothly
    const bgVideos = document.querySelectorAll('.heritage-bg-video, .home-bg-video');
    bgVideos.forEach(v => {
        try {
            v.muted = true;
            v.defaultMuted = true;
            v.playsInline = true;
            if (v.paused) {
                v.play().catch(() => {});
            }
        } catch (e) {}
    });

    // 1. Ensure modal and drawer elements exist
    ensureModalsInDOM();

    // 2. Initialize Cart UI and badges
    updateCartUI();
    updateWishlistCountBadge();
    updateMenuUserUI();

    // 2b. Initialize 3-Layer WhatsApp OTP Recovery Banner & Reminder Prompts
    refreshPendingOtpRecoveryBanner();
    setTimeout(() => {
        const pendingOrd = getActivePendingOtpOrder();
        if (!pendingOrd) return;
        let reminderCount = parseInt(sessionStorage.getItem('hamsa_otp_reminder_count') || '0', 10);
        if (reminderCount < 2) {
            sessionStorage.setItem('hamsa_otp_reminder_count', String(reminderCount + 1));
            refreshPendingOtpRecoveryBanner();
        }
    }, 15000);

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

        // Apply initial filter with smooth skeleton reveal
        const skeletonGrid = document.getElementById('catalog-skeleton-grid');
        if (skeletonGrid) {
            skeletonGrid.style.display = 'grid';
            productGrid.style.display = 'none';
            setTimeout(() => {
                filterProducts();
                skeletonGrid.style.display = 'none';
                productGrid.style.display = 'grid';
                initSkeletonShimmerLoaders();
            }, 300);
        } else {
            filterProducts();
            initSkeletonShimmerLoaders();
        }

        // Expose global category filter handler with skeleton transition
        window.filterCatalogCategory = function (cat, el) {
            activeCategory = cat || 'all';
            const pills = document.querySelectorAll('.filter-pill');

            pills.forEach(p => {
                if (p === el || p.getAttribute('data-category') === cat) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });

            const skeleton = document.getElementById('catalog-skeleton-grid');
            if (skeleton) {
                skeleton.style.display = 'grid';
                productGrid.style.display = 'none';
                setTimeout(() => {
                    filterProducts();
                    skeleton.style.display = 'none';
                    productGrid.style.display = 'grid';
                    initSkeletonShimmerLoaders();
                }, 220);
            } else {
                filterProducts();
            }
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

        // Sort Select with skeleton transition
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

                const skeleton = document.getElementById('catalog-skeleton-grid');
                if (skeleton) {
                    skeleton.style.display = 'grid';
                    productGrid.style.display = 'none';
                    setTimeout(() => {
                        cards.forEach(card => productGrid.appendChild(card));
                        skeleton.style.display = 'none';
                        productGrid.style.display = 'grid';
                        initSkeletonShimmerLoaders();
                    }, 220);
                } else {
                    cards.forEach(card => productGrid.appendChild(card));
                }
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
            else if (titleText.includes('raaz') || titleText.includes('kalimiri') || titleText.includes('kalimirgi')) detectedId = 'raaz-e-kalimiri';
            else if (titleText.includes('turkish') || titleText.includes('shank')) detectedId = 'turkish-lamb-shank';
            else if (titleText.includes('boti')) detectedId = 'boti-delight';
            else if (titleText.includes('ruz') || titleText.includes('sweet') || titleText.includes('haleebia')) detectedId = 'ruz-bi-haleebia';
            else if (titleText.includes('destiny') || titleText.includes('mulberry') || titleText.includes('mojito')) detectedId = 'destiny-queen-mojito';
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