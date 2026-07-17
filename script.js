// script.js – ACTIVE GADGETS with Admin Panel

(function() {
    // ============================================================
    // 🔥 PRODUCT DATA – stored in localStorage for persistence
    // ============================================================
    const DEFAULT_PRODUCTS = [
        { 
            id: 1, 
            name: 'iPhone 15 Pro Max', 
            category: 'phone', 
            price: 1450000, 
            desc: '6.7" · 48MP · A17 Pro', 
            img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg',
            badge: 'new' 
        },
        { 
            id: 2, 
            name: 'Samsung Galaxy S24 Ultra', 
            category: 'phone', 
            price: 1320000, 
            desc: '6.8" · 200MP · S Pen', 
            img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg',
            badge: 'top' 
        },
        { 
            id: 3, 
            name: 'Google Pixel 8 Pro', 
            category: 'phone', 
            price: 920000, 
            desc: '6.7" · AI Camera · 5G', 
            img: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg',
            badge: '' 
        },
        { 
            id: 4, 
            name: 'OnePlus 12', 
            category: 'phone', 
            price: 850000, 
            desc: '6.82" · 50MP · Snapdragon 8 Gen 3', 
            img: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg',
            badge: '' 
        },
        { 
            id: 5, 
            name: 'Xiaomi 14 Ultra', 
            category: 'phone', 
            price: 980000, 
            desc: '6.73" · 50MP · Leica', 
            img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra.jpg',
            badge: 'premium' 
        },
        { 
            id: 6, 
            name: 'MacBook Pro 16" M3', 
            category: 'laptop', 
            price: 2850000, 
            desc: 'M3 Max · 36GB · 1TB', 
            img: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830',
            badge: 'premium' 
        },
        { 
            id: 7, 
            name: 'Dell XPS 16', 
            category: 'laptop', 
            price: 1890000, 
            desc: 'i9 · 32GB · RTX 4070', 
            img: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-16-9640/media-gallery/notebook-xps-16-9640-uv1-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=400&hei=400',
            badge: '' 
        },
        { 
            id: 8, 
            name: 'Sony WH-1000XM5', 
            category: 'audio', 
            price: 420000, 
            desc: 'ANC · 30h · LDAC', 
            img: 'https://m.media-amazon.com/images/I/61qFw6IvqEL._AC_SL1500_.jpg',
            badge: 'sale' 
        },
        { 
            id: 9, 
            name: 'Apple AirPods Max', 
            category: 'audio', 
            price: 580000, 
            desc: 'Pro Audio · Spatial Audio', 
            img: 'https://m.media-amazon.com/images/I/61F7TZ1-+zL._AC_SL1500_.jpg',
            badge: '' 
        },
        { 
            id: 10, 
            name: 'Apple Watch Ultra 2', 
            category: 'wearable', 
            price: 890000, 
            desc: 'Titanium · 60h · GPS', 
            img: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-ultra-2-select-202309_GEO_EMEA?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1694114070',
            badge: 'new' 
        },
        { 
            id: 11, 
            name: 'Samsung Galaxy Watch 6', 
            category: 'wearable', 
            price: 450000, 
            desc: 'AMOLED · Body Comp.', 
            img: 'https://m.media-amazon.com/images/I/71FJ8XxMq5L._AC_SL1500_.jpg',
            badge: '' 
        },
        { 
            id: 12, 
            name: 'Garmin Fenix 7', 
            category: 'wearable', 
            price: 760000, 
            desc: 'Solar · Multi-GNSS', 
            img: 'https://m.media-amazon.com/images/I/71iH+3E3oKL._AC_SL1500_.jpg',
            badge: '' 
        }
    ];

    // Load products from localStorage or use defaults
    let products = [];
    let nextId = 13;

    function loadProducts() {
        const stored = localStorage.getItem('activeGadgetsProducts');
        if (stored) {
            try {
                products = JSON.parse(stored);
                // Find max id for nextId
                const maxId = products.reduce((max, p) => p.id > max ? p.id : max, 0);
                nextId = maxId + 1;
            } catch (e) {
                products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
                saveProducts();
            }
        } else {
            products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
            saveProducts();
        }
    }

    function saveProducts() {
        localStorage.setItem('activeGadgetsProducts', JSON.stringify(products));
        updateProductCount();
    }

    // ============================================================
    // DOM REFS
    // ============================================================
    const grid = document.getElementById('productGrid');
    const cartCountSpan = document.getElementById('cartCount');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const sortSelect = document.getElementById('sortSelect');
    const shopView = document.getElementById('shopView');
    const adminView = document.getElementById('adminView');
    const heroSection = document.getElementById('heroSection');
    const shopTab = document.getElementById('shopTab');
    const adminTab = document.getElementById('adminTab');
    const adminProductList = document.getElementById('adminProductList');
    const productCountSpan = document.getElementById('productCount');

    // Admin form elements
    const addName = document.getElementById('addName');
    const addCategory = document.getElementById('addCategory');
    const addPrice = document.getElementById('addPrice');
    const addDesc = document.getElementById('addDesc');
    const addImg = document.getElementById('addImg');
    const addBadge = document.getElementById('addBadge');
    const addProductBtn = document.getElementById('addProductBtn');

    // state
    let cart = [];
    let currentCategory = 'all';
    let currentSort = 'default';
    let editingId = null;

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================
    function formatNaira(amount) {
        return '₦' + amount.toLocaleString('en-NG');
    }

    function updateProductCount() {
        productCountSpan.textContent = products.length;
    }

    function showToast(msg) {
        toastMsg.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    // ============================================================
    // SHOP RENDER
    // ============================================================
    function renderProducts() {
        let filtered = currentCategory === 'all' 
            ? [...products] 
            : products.filter(p => p.category === currentCategory);

        switch (currentSort) {
            case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
            case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
            case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: break;
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; background:white; border-radius:40px; color:#4a6a8a;">📭 No gadgets in this category yet.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(p => {
            const badgeHtml = p.badge ? `<span class="product-badge">${p.badge}</span>` : '';
            return `
                <div class="product-card" data-id="${p.id}">
                    ${badgeHtml}
                    <div class="product-img">
                        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/200x160/1a2a3a/00b8ff?text=${encodeURIComponent(p.name)}'">
                    </div>
                    <div class="product-title">${p.name}</div>
                    <div class="product-desc">
                        <span><i class="fas fa-tag"></i> ${p.category}</span>
                        <span><i class="fas fa-microchip"></i> ${p.desc}</span>
                    </div>
                    <div class="product-price">${formatNaira(p.price)} <small>NGN</small></div>
                    <button class="add-btn" data-id="${p.id}"><i class="fas fa-plus-circle"></i> Add to cart</button>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                addToCart(id);
            });
        });
    }

    // ============================================================
    // CART
    // ============================================================
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        cart.push(product);
        cartCountSpan.textContent = cart.length;
        showToast(`${product.name} added ✅`);
        const cartBtn = document.getElementById('cartBtn');
        cartBtn.style.transform = 'scale(1.1)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 150);
    }

    // ============================================================
    // ADMIN RENDER
    // ============================================================
    function renderAdminList() {
        if (products.length === 0) {
            adminProductList.innerHTML = `<p style="color:#4a6a8a; padding:1rem;">No products in stock. Add one above!</p>`;
            return;
        }

        adminProductList.innerHTML = products.map(p => `
            <div class="admin-item" data-id="${p.id}">
                <div class="item-info">
                    <img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/40/1a2a3a/00b8ff?text=${p.name.charAt(0)}'">
                    <strong>${p.name}</strong>
                    <span class="item-price">${formatNaira(p.price)}</span>
                    <span style="font-size:0.8rem; color:#4a6a8a;">${p.category}</span>
                    ${p.badge ? `<span style="background:#00b8ff20; padding:0.1rem 0.6rem; border-radius:20px; font-size:0.7rem;">${p.badge}</span>` : ''}
                </div>
                <div class="item-actions">
                    <button class="edit-btn" data-id="${p.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" data-id="${p.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `).join('');

        // Delete buttons
        adminProductList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                if (confirm('Delete this product?')) {
                    products = products.filter(p => p.id !== id);
                    saveProducts();
                    renderAdminList();
                    renderProducts();
                    showToast('Product deleted');
                }
            });
        });

        // Edit buttons - populate form
        adminProductList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const product = products.find(p => p.id === id);
                if (!product) return;
                editingId = id;
                addName.value = product.name;
                addCategory.value = product.category;
                addPrice.value = product.price;
                addDesc.value = product.desc;
                addImg.value = product.img;
                addBadge.value = product.badge || '';
                addProductBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
                addProductBtn.style.background = '#ffc107';
                addProductBtn.style.color = '#0b1a2e';
                showToast('Editing: ' + product.name);
            });
        });
    }

    // ============================================================
    // ADMIN: ADD / UPDATE PRODUCT
    // ============================================================
    function handleAddProduct() {
        const name = addName.value.trim();
        const category = addCategory.value;
        const price = parseInt(addPrice.value);
        const desc = addDesc.value.trim();
        const img = addImg.value.trim() || 'https://placehold.co/200x160/1a2a3a/00b8ff?text=Gadget';
        const badge = addBadge.value;

        if (!name || !price || !desc) {
            showToast('⚠️ Please fill in all required fields');
            return;
        }

        if (editingId !== null) {
            // Update existing
            const index = products.findIndex(p => p.id === editingId);
            if (index !== -1) {
                products[index] = { ...products[index], name, category, price, desc, img, badge };
                saveProducts();
                renderAdminList();
                renderProducts();
                showToast('✅ Product updated!');
                resetForm();
            }
        } else {
            // Add new
            const newProduct = {
                id: nextId++,
                name,
                category,
                price,
                desc,
                img,
                badge
            };
            products.push(newProduct);
            saveProducts();
            renderAdminList();
            renderProducts();
            showToast(`✅ ${name} added!`);
            resetForm();
        }
    }

    function resetForm() {
        addName.value = '';
        addCategory.value = 'phone';
        addPrice.value = '';
        addDesc.value = '';
        addImg.value = '';
        addBadge.value = '';
        editingId = null;
        addProductBtn.innerHTML = '<i class="fas fa-save"></i> Add Product';
        addProductBtn.style.background = '#0b1a2e';
        addProductBtn.style.color = 'white';
    }

    // ============================================================
    // TAB SWITCHING
    // ============================================================
    function showShop() {
        shopView.style.display = 'block';
        adminView.style.display = 'none';
        heroSection.style.display = 'flex';
        shopTab.classList.add('active-tab');
        adminTab.classList.remove('active-tab');
        renderProducts();
    }

    function showAdmin() {
        shopView.style.display = 'none';
        adminView.style.display = 'block';
        heroSection.style.display = 'none';
        adminTab.classList.add('active-tab');
        shopTab.classList.remove('active-tab');
        renderAdminList();
    }

    // ============================================================
    // EVENT LISTENERS
    // ============================================================
    // Category filter
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderProducts();
        });
    });

    // Sort
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        renderProducts();
    });

    // Cart button
    document.getElementById('cartBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            showToast('🛒 Cart is empty');
        } else {
            const total = cart.reduce((sum, p) => sum + p.price, 0);
            showToast(`🛒 ${cart.length} items · ${formatNaira(total)} total`);
        }
    });

    // Tab switching
    shopTab.addEventListener('click', function(e) {
        e.preventDefault();
        showShop();
    });

    adminTab.addEventListener('click', function(e) {
        e.preventDefault();
        showAdmin();
    });

    // Add product button
    addProductBtn.addEventListener('click', handleAddProduct);

    // Enter key support on form
    document.querySelectorAll('.form-grid input, .form-grid select').forEach(el => {
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAddProduct();
            }
        });
    });

    // ============================================================
    // INIT
    // ============================================================
    loadProducts();
    showShop();
    updateProductCount();

    // If admin view is shown, render list
    renderAdminList();

})();