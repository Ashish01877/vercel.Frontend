// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

// Checkout form handling
document.addEventListener('DOMContentLoaded', function() {
  const checkoutForm = document.querySelector('.needs-validation');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      if (!checkoutForm.checkValidity()) {
        checkoutForm.classList.add('was-validated');
        return;
      }

      // Check Firebase authentication
      const user = window.getCurrentUser();
      if (!user) {
        alert('Please login to place an order!');
        return;
      }

      // Get cart from sessionStorage
      const cartData = sessionStorage.getItem('checkoutCart');
      if (!cartData) {
        alert('No items in cart. Please add items to cart first.');
        window.location.href = 'cart.html';
        return;
      }

      const cart = JSON.parse(cartData);

      // Collect form data
      const formData = new FormData(checkoutForm);
      const shippingAddress = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        address: formData.get('address'),
        address2: formData.get('address2') || '',
        country: formData.get('country'),
        state: formData.get('state'),
        zip: formData.get('zip')
      };

      try {
        // Show loading
        const submitBtn = checkoutForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        const orderData = {
          items: cart.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          shippingAddress: shippingAddress,
          paymentMethod: 'cash_on_delivery',
          userId: user.uid // Firebase user ID
        };

        console.log('Creating order:', orderData);

        const response = await API.orders.create(orderData);

        // Clear cart and session data
        localStorage.removeItem('cart');
        sessionStorage.removeItem('checkoutCart');

        alert('Order placed successfully! Order ID: ' + response._id);
        window.location.href = 'index.html';

      } catch (error) {
        console.error('Checkout failed:', error);
        alert('Checkout failed: ' + (error.message || 'Please try again.'));
      } finally {
        // Reset button
        const submitBtn = checkoutForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order';
      }
    });
  }

  // Load cart summary
  loadCheckoutSummary();
});

async function loadCheckoutSummary() {
  const cartData = sessionStorage.getItem('checkoutCart');
  if (!cartData) return;

  const cart = JSON.parse(cartData);

  // Update cart summary in the checkout form
  const cartItemsContainer = document.querySelector('.list-group.mb-3');
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemElement = document.createElement('li');
      itemElement.className = 'list-group-item d-flex justify-content-between lh-sm';
      itemElement.innerHTML = `
        <div>
          <h6 class="my-0">${item.title}</h6>
          <small class="text-muted">Quantity: ${item.quantity}</small>
        </div>
        <span class="text-muted">$${itemTotal.toFixed(2)}</span>
      `;
      cartItemsContainer.appendChild(itemElement);
    });

    // Add total
    const totalElement = document.createElement('li');
    totalElement.className = 'list-group-item d-flex justify-content-between';
    totalElement.innerHTML = `
      <span>Total (USD)</span>
      <strong>$${subtotal.toFixed(2)}</strong>
    `;
    cartItemsContainer.appendChild(totalElement);
  }
}
