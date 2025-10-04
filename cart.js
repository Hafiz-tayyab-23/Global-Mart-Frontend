// Sample product data (same as in script.js for consistency)
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

// DOM Elements
const cartItemsContainer = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartShipping = document.getElementById('cart-shipping');
const cartTax = document.getElementById('cart-tax');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

// Initialize cart from localStorage
let shoppingCart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    renderCart();
    setupEventListeners();
});

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('globalMartCart');
    if (savedCart) {
        shoppingCart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('globalMartCart', JSON.stringify(shoppingCart));
}

// Render cart items and summary
function renderCart() {
    updateCartCount();
    
    if (shoppingCart.length === 0) {
        // Show empty cart message
        emptyCartMessage.style.display = 'flex';
        cartItemsContainer.innerHTML = '';
        updateOrderSummary(0, 0, 0);
        return;
    }
    
    // Hide empty cart message and show items
    emptyCartMessage.style.display = 'none';
    
    // Clear previous items
    cartItemsContainer.innerHTML = '';
    
    // Calculate totals
    let subtotal = 0;
    
    // Add each item to the cart
    shoppingCart.forEach(item => {
        // Try to find product by numeric id first, but support string ids
        const product = products.find(p => String(p.id) === String(item.id));

        // If product not found in products array (e.g., category pages used custom ids),
        // fall back to using the data stored in the cart item object.
        const displayName = product ? product.name : (item.name || 'Product');
        const displayPrice = product ? product.price : (parseFloat(item.price) || 0);
        const displayImage = product ? product.image : (item.image || '');

        const itemTotal = displayPrice * item.quantity;
        subtotal += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');

        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${displayImage}" alt="${displayName}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${displayName}</h3>
                <p class="cart-item-price">$${displayPrice.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <input type="number" value="${item.quantity}" min="1" max="99" data-id="${item.id}">
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">
                <p>$${itemTotal.toFixed(2)}</p>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Calculate shipping and tax
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.08; // 8% tax
    
    // Update order summary
    updateOrderSummary(subtotal, shipping, tax);
}

// Update order summary values
function updateOrderSummary(subtotal, shipping, tax) {
    const total = subtotal + shipping + tax;
    
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartShipping.textContent = `$${shipping.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Disable checkout button if cart is empty
    checkoutBtn.disabled = subtotal === 0;
    if (subtotal === 0) {
        checkoutBtn.classList.add('disabled');
    } else {
        checkoutBtn.classList.remove('disabled');
    }
}

// Update cart count
function updateCartCount() {
    const totalItems = shoppingCart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Setup event listeners
function setupEventListeners() {
    // Quantity change events
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('decrease')) {
            const productId = e.target.getAttribute('data-id');
            updateItemQuantity(productId, -1);
        }

        if (e.target.classList.contains('increase')) {
            const productId = e.target.getAttribute('data-id');
            updateItemQuantity(productId, 1);
        }

        if (e.target.classList.contains('remove-item-btn') || e.target.closest('.remove-item-btn')) {
            const button = e.target.classList.contains('remove-item-btn') ? e.target : e.target.closest('.remove-item-btn');
            const productId = button.getAttribute('data-id');
            removeFromCart(productId);
        }
    });
    
    // Quantity input change
    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT') {
            const productId = e.target.getAttribute('data-id');
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity > 0) {
                setItemQuantity(productId, newQuantity);
            } else {
                e.target.value = 1;
                setItemQuantity(productId, 1);
            }
        }
    });
    
    // Clear cart button
    clearCartBtn.addEventListener('click', () => {
        if (shoppingCart.length > 0) {
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
            }
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (shoppingCart.length > 0) {
            alert('Thank you for your order! This would proceed to checkout in a real application.');
            // In a real application, this would redirect to a checkout page
        }
    });
}

// Update item quantity
function updateItemQuantity(productId, change) {
    // Compare IDs as strings to support both numeric and string ids
    const cartItem = shoppingCart.find(item => String(item.id) === String(productId));
    
    if (cartItem) {
        cartItem.quantity += change;
        
        if (cartItem.quantity < 1) {
            cartItem.quantity = 1;
        }
        
        saveCartToLocalStorage();
        renderCart();
    }
}

// Set item quantity directly
function setItemQuantity(productId, quantity) {
    const cartItem = shoppingCart.find(item => String(item.id) === String(productId));

    if (cartItem) {
        cartItem.quantity = quantity;
        saveCartToLocalStorage();
        renderCart();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => String(item.id) !== String(productId));
    saveCartToLocalStorage();
    renderCart();
}

// Clear the entire cart
function clearCart() {
    shoppingCart = [];
    saveCartToLocalStorage();
    renderCart();
}