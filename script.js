// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "Premium wireless headphones with noise cancellation technology, 30-hour battery life, and crystal-clear sound quality for an immersive audio experience."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
        description: "Advanced smartwatch with health monitoring, GPS tracking, and smartphone notifications. Water-resistant design with a customizable interface."
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "Durable and water-resistant laptop backpack with multiple compartments, USB charging port, and anti-theft features. Perfect for travel and daily commute."
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "Portable Bluetooth speaker with 360° sound, 20-hour playtime, and waterproof design. Connect multiple speakers for an enhanced audio experience."
    },
    {
        id: 5,
        name: "Digital Camera",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "High-resolution digital camera with 4K video recording, optical zoom, and advanced image stabilization. Includes Wi-Fi connectivity for instant sharing."
    },
    {
        id: 6,
        name: "Fitness Tracker",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80",
        description: "Sleek fitness tracker with heart rate monitoring, sleep tracking, and workout detection. Waterproof design with a long-lasting battery life."
    }
];

// Shopping cart array
let shoppingCart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const modal = document.getElementById('product-modal');
const modalProductDetails = document.getElementById('modal-product-details');
const closeModal = document.querySelector('.close-modal');
const cartCount = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from local storage
    loadCartFromLocalStorage();

    // Only render dynamic product grid when an element with id 'product-grid' exists
    if (productGrid) {
        renderProducts();
        setupEventListeners();
    }

    // Update cart count if the cartCount element exists
    if (cartCount) updateCartCount();

    // Always add image fallback handlers for any images that fail to load on the page
    addImageFallbacks();
});

// Render product cards
function renderProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn-view-details" data-id="${product.id}">View Details</button>
                    <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
        // attach fallback handler to the newly added image
        const img = productCard.querySelector('img');
        if (img) setImageFallback(img);
    });
}

// Setup event listeners
function setupEventListeners() {
    // View Details and Add to Cart button clicks within the dynamic grid
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-view-details')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                openProductModal(productId);
            }

            if (e.target.classList.contains('btn-add-to-cart')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                addToCart(productId);
            }
        });
    }
    
    // Close modal when clicking on X
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Modal add to cart button
    if (modalProductDetails) {
        modalProductDetails.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add-to-cart')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                addToCart(productId);
            }
        });
    }
    
    // Cart button click - navigate to cart page
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
}

// Open product modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        modalProductDetails.innerHTML = `
            <div class="modal-product">
                <div class="modal-product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-product-info">
                    <h2 class="modal-product-title">${product.name}</h2>
                    <p class="modal-product-price">$${product.price.toFixed(2)}</p>
                    <p class="modal-product-description">${product.description}</p>
                    <div class="modal-product-actions">
                        <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        // ensure modal image has fallback
        const modalImg = modalProductDetails.querySelector('img');
        if (modalImg) setImageFallback(modalImg);
    }
}

// Image fallback helpers: replace broken images with local `2.png`
function setImageFallback(img) {
    if (!img) return;
    // avoid infinite loop if fallback also fails
    img.addEventListener('error', function handleError() {
        img.removeEventListener('error', handleError);
        // choose a category-specific placeholder when possible
        const path = window.location.pathname.toLowerCase();
        if (path.includes('fashion')) {
            img.src = 'images/fashion/placeholder-fashion.svg';
        } else if (path.includes('books')) {
            img.src = 'images/books/placeholder-books.svg';
        } else if (path.includes('home-kitchen') || path.includes('home') || path.includes('kitchen')) {
            img.src = 'images/home-kitchen/placeholder-home-kitchen.svg';
        } else if (path.includes('electronics')) {
            // use electronics svg if available
            img.src = 'images/electronics/electronics.svg';
        } else {
            // fallback to a generic local image that exists
            img.src = '2.png';
        }
        img.alt = img.alt || 'Image unavailable';
    });
}

function addImageFallbacks() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => setImageFallback(img));
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Check if product is already in cart
        const existingItem = shoppingCart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            shoppingCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save cart to local storage
        saveCartToLocalStorage();
        updateCartCount();
        
        // Show notification
        showAddedToCartNotification(product.name);
    }
}

// Save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('globalMartCart', JSON.stringify(shoppingCart));
}

// Load cart from local storage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('globalMartCart');
    if (savedCart) {
        shoppingCart = JSON.parse(savedCart);
    }
}

// Update cart count
function updateCartCount() {
    const totalItems = shoppingCart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show notification when product is added to cart
function showAddedToCartNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
        <p>Added to cart: ${productName}</p>
    `;
    
    // Add styles to notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--accent-color)';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    
    // Add keyframes for animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cart button click - For future implementation of cart page or dropdown
document.getElementById('cart-btn').addEventListener('click', () => {
    alert('Shopping Cart:\n' + 
          shoppingCart.map(item => `${item.name} (${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n') +
          '\n\nTotal: $' + shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
});