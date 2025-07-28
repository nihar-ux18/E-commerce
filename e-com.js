// ===== JAVASCRIPT FUNCTIONALITY =====

// Sample product data
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 199.99,
        image: "🎧",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals."
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 299.99,
        image: "⌚",
        description: "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone connectivity. Track your health goals in style."
    },
    {
        id: 3,
        name: "Minimalist Desk Lamp",
        price: 89.99,
        image: "💡",
        description: "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for any workspace or study area."
    },
    {
        id: 4,
        name: "Organic Coffee Beans",
        price: 24.99,
        image: "☕",
        description: "Premium organic coffee beans sourced from sustainable farms. Rich flavor and aromatic experience in every cup."
    },
    {
        id: 5,
        name: "Portable Phone Charger",
        price: 49.99,
        image: "🔋",
        description: "High-capacity portable charger with fast charging technology. Never run out of battery when you're on the go."
    },
    {
        id: 6,
        name: "Eco-Friendly Water Bottle",
        price: 29.99,
        image: "🍶",
        description: "Sustainable stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Perfect for daily use."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
});

// Render products on the page
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.onclick = () => showProductModal(product);
        
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                Add to Cart
            </button>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Show product modal with details
function showProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${product.image}</div>
            <h2 style="margin-bottom: 1rem; color: #2c3e50;">${product.name}</h2>
            <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">${product.description}</p>
            <div style="font-size: 2rem; font-weight: 700; color: #667eea; margin-bottom: 1.5rem;">$${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id}); closeModal();" style="padding: 1rem 2rem;">
                Add to Cart
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close product modal
function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCart();
    
    // Show success feedback
    showNotification('Product added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Add some products to get started!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span style="margin: 0 0.5rem; font-weight: 600;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 1rem; background: #ff4757; color: white;">×</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
    
    // Clear cart after checkout
    cart = [];
    updateCartUI();
    saveCart();
    toggleCart();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 4000;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
        cartSidebar.classList.remove('active');
    }
});