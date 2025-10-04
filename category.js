// Category page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            // try to get image from the product card
            const productCard = this.closest('.product-card');
            let productImage = '';
            if (productCard) {
                const imgEl = productCard.querySelector('.product-image');
                if (imgEl) {
                    if (imgEl.tagName === 'IMG') productImage = imgEl.src;
                    else if (imgEl.querySelector && imgEl.querySelector('img')) productImage = imgEl.querySelector('img').src;
                    else if (imgEl.style && imgEl.style.backgroundImage) productImage = imgEl.style.backgroundImage.replace(/url\(["']?(.*?)["']?\)/, '$1');
                }
            }

            // Add item to cart (include image)
            addToCart(productId, productName, productPrice, productImage);
            
            // Show success notification
            showAddedToCartNotification(productName);
        });
    });

    // View details functionality (delegated) — attach a click handler to the document
    const modal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalProductDetails = document.getElementById('modal-product-details');

    document.addEventListener('click', function(event) {
        const button = event.target.closest && event.target.closest('.btn-view-details');
        if (!button) return;

        // Prevent default if button is inside a form or link
        event.preventDefault();

        const productId = button.getAttribute('data-id');
        const productCard = button.closest('.product-card');
        if (!productCard) return;
        const productName = (productCard.querySelector('h3') || { textContent: '' }).textContent;
        const productPrice = (productCard.querySelector('.product-price') || { textContent: '' }).textContent;

        // Prefer description provided on the view button (data-description).
        // Fallback to a .product-description element if present.
        const dataDesc = button.getAttribute('data-description');
        const descElem = productCard.querySelector('.product-description');
        const productDescription = dataDesc || (descElem ? descElem.textContent : '');

        // product-image might be an <img> or a div with background-image
        let productImageSrc = '';
        const imgContainer = productCard.querySelector('.product-image');
        if (imgContainer) {
            if (imgContainer.tagName === 'IMG') {
                productImageSrc = imgContainer.src;
            } else if (imgContainer.querySelector && imgContainer.querySelector('img')) {
                productImageSrc = imgContainer.querySelector('img').src;
            } else {
                const bg = imgContainer.style.backgroundImage;
                if (bg && bg !== 'none') {
                    productImageSrc = bg.replace(/url\(["']?(.*?)["']?\)/, '$1');
                }
            }
        }

        // Populate modal with product details. Support two modal styles:
        // 1) Generic: an element with id 'modal-product-details' (used on most category pages)
        // 2) Books-specific: elements with ids 'modal-product-image', 'modal-product-name', 'modal-product-price', 'modal-product-description', and 'modal-add-to-cart'
        const genericContainer = document.getElementById('modal-product-details');
        if (genericContainer) {
            genericContainer.innerHTML = `
                <div class="modal-product-image">
                    <img src="${productImageSrc}" alt="${productName}">
                </div>
                <div class="modal-product-info">
                    <h2>${productName}</h2>
                    <p class="modal-product-price">${productPrice}</p>
                    <p class="modal-product-description">${productDescription}</p>
                    <button class="btn-add-to-cart" data-id="${productId}" data-name="${productName}" data-price="${productPrice.replace('$', '')}">Add to Cart</button>
                </div>
            `;

            // Show modal
            modal.style.display = 'block';

            // Add event listener to the Add to Cart button in the generic modal (replace handler by assigning onclick)
            const modalAddToCartButton = genericContainer.querySelector('.btn-add-to-cart');
            if (modalAddToCartButton) {
                modalAddToCartButton.onclick = function() {
                    const productId = this.getAttribute('data-id');
                    const productName = this.getAttribute('data-name');
                    const productPrice = parseFloat(this.getAttribute('data-price'));
                    let productImage = '';
                    const modalImg = genericContainer.querySelector('.modal-product-image img');
                    if (modalImg) productImage = modalImg.src;
                    addToCart(productId, productName, productPrice, productImage);
                    modal.style.display = 'none';
                    showAddedToCartNotification(productName);
                };
            }
        } else {
            // books-style modal
            const booksImg = document.getElementById('modal-product-image');
            const booksName = document.getElementById('modal-product-name');
            const booksPrice = document.getElementById('modal-product-price');
            const booksDesc = document.getElementById('modal-product-description');
            const booksAddBtn = document.getElementById('modal-add-to-cart');

            if (booksImg) booksImg.src = productImageSrc || '';
            if (booksName) booksName.textContent = productName || '';
            if (booksPrice) booksPrice.textContent = productPrice || '';
            if (booksDesc) booksDesc.textContent = productDescription || '';

            // ensure add button has correct dataset
            if (booksAddBtn) {
                booksAddBtn.setAttribute('data-id', productId);
                booksAddBtn.setAttribute('data-name', productName);
                booksAddBtn.setAttribute('data-price', (productPrice || '').replace('$', ''));
                booksAddBtn.onclick = function() {
                    const productId = this.getAttribute('data-id');
                    const productName = this.getAttribute('data-name');
                    const productPrice = parseFloat(this.getAttribute('data-price'));
                    let productImage = '';
                    const imgEl = document.getElementById('modal-product-image');
                    if (imgEl) productImage = imgEl.src;

                    addToCart(productId, productName, productPrice, productImage);
                    modal.style.display = 'none';
                    showAddedToCartNotification(productName);
                };
            }

            // Show modal
            modal.style.display = 'block';
        }
    });

    // Close modal when clicking on the close button
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Show notification when product is added to cart
    function showAddedToCartNotification(productName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `<p>${productName} added successfully to cart</p>`;
        
        // Add notification to the page
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Cart functionality
    function addToCart(productId, productName, productPrice, productImage) {
        // Get existing cart from localStorage or initialize empty array
        let cart = JSON.parse(localStorage.getItem('globalMartCart')) || [];
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        if (existingProductIndex > -1) {
            // Increment quantity if product already in cart
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage || '',
                quantity: 1
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('globalMartCart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('globalMartCart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    }

    // Cart button navigation
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
});