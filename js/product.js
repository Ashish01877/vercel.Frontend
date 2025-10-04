$(document).ready(function() {

  $('.color-choose input').on('click', function() {
      var headphonesColor = $(this).attr('data-image');

      $('.active').removeClass('active');
      $('.left-column img[data-image = ' + headphonesColor + ']').addClass('active');
      $(this).addClass('active');
  });

});

// Load product details
async function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    document.querySelector('.right-column .product-description h1').textContent = 'Product not found';
    return;
  }

  try {
    const product = await API.products.getById(productId);

    // Update product details
    document.querySelector('.right-column .product-description span').textContent = product.category || 'Books';
    document.querySelector('.right-column .product-description h1').textContent = product.title;
    document.querySelector('.right-column .product-description h2').textContent = `~By ${product.author}`;

    const descriptionEl = document.querySelector('.right-column .product-description p');
    if (descriptionEl) {
      descriptionEl.textContent = product.description || 'No description available.';
    }

    // Update image
    const imgEl = document.querySelector('.left-column img.active');
    if (imgEl) {
      imgEl.src = product.image || './image/book-1.png';
      imgEl.alt = product.title;
    }

    // Update price
    const priceEl = document.querySelector('.right-column .product-price span');
    if (priceEl) {
      priceEl.textContent = `$${product.price.toFixed(2)}`;
    }

    // Update add to cart button
    const cartBtn = document.querySelector('.right-column .product-price a.cart-btn');
    if (cartBtn) {
      cartBtn.onclick = function() {
        addToCart(product);
      };
    }

  } catch (error) {
    console.error('Failed to load product:', error);
    document.querySelector('.right-column .product-description h1').textContent = 'Product not found';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadProductDetails();
});
