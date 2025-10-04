// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load cart items
function loadCart() {
  const cartWrap = document.querySelector('.cartWrap');
  if (!cartWrap) return;

  // Clear existing items except the first static one if any
  const existingItems = cartWrap.querySelectorAll('li.items');
  existingItems.forEach(item => item.remove());

  if (cart.length === 0) {
    cartWrap.innerHTML = '<li class="items"><div class="infoWrap"><p>Your cart is empty</p></div></li>';
    updateCartTotal();
    return;
  }

  // Add cart items
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'items even';

    li.innerHTML = `
      <div class="infoWrap">
        <div class="cartSection">
          <img src="${item.image || 'http://lorempixel.com/output/technics-q-c-300-300-4.jpg'}" alt="" class="itemImg" />
          <p class="itemNumber">#${item._id || 'QUE-007544-002'}</p>
          <h3>${item.title}</h3>
          <p><input type="number" class="qty" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" /> x $${item.price.toFixed(2)}</p>
          <p class="stockStatus ${item.inStock ? '' : 'out'}">${item.inStock ? 'In Stock' : 'Out of Stock'}</p>
        </div>
        <div class="prodTotal cartSection">
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div class="cartSection removeWrap">
          <a href="#" class="remove" onclick="removeFromCart(${index})">x</a>
        </div>
      </div>
    `;

    cartWrap.appendChild(li);
  });

  updateCartTotal();
}

// Update item quantity
function updateQuantity(index, newQty) {
  cart[index].quantity = parseInt(newQty);
  saveCart();
  loadCart();
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  loadCart();
}

// Add item to cart
function addToCart(product, quantity = 1) {
  const existingItem = cart.find(item => item._id === product._id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      _id: product._id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.image,
      inStock: product.inStock
    });
  }
  saveCart();
  alert('Added to cart!');
}

// Update cart count in header
function updateCartCount() {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  // Update cart icon if exists
  const cartIcon = document.querySelector('.fas.fa-shopping-cart');
  if (cartIcon) {
    // Add count badge
    let badge = cartIcon.parentElement.querySelector('.cart-count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count';
      badge.style.cssText = 'position: absolute; top: -10px; right: -10px; background: red; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px;';
      cartIcon.parentElement.style.position = 'relative';
      cartIcon.parentElement.appendChild(badge);
    }
    badge.textContent = cartCount;
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart total
function updateCartTotal() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 5.00;
  const tax = subtotal * 0.04;
  const total = subtotal + shipping + tax;

  // Update DOM elements
  const subtotalEl = document.querySelector('.totalRow .value');
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  const shippingEl = document.querySelectorAll('.totalRow .value')[1];
  if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;

  const taxEl = document.querySelectorAll('.totalRow .value')[2];
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;

  const totalEl = document.querySelector('.totalRow.final .value');
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Checkout functionality
async function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Check if user is logged in with Firebase
  const user = window.getCurrentUser();
  if (!user) {
    alert('Please login to checkout!');
    // Show login form
    const loginForm = document.querySelector('.login-form-container');
    if (loginForm) {
      loginForm.classList.add('active');
    }
    return;
  }

  // Store cart in sessionStorage for checkout process
  sessionStorage.setItem('checkoutCart', JSON.stringify(cart));

  // Redirect to checkout form
  window.location.href = 'form-validation.html';
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  loadCart();

  // Bind checkout button
  const checkoutBtn = document.querySelector('a.btn.continue');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      checkout();
    });
  }
});