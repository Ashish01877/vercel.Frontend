// Load products dynamically
document.addEventListener('DOMContentLoaded', async () => {
  await loadFeaturedProducts();
});

// Load featured products
async function loadFeaturedProducts() {
  const featuredWrapper = document.querySelector('.featured-slider .swiper-wrapper');

  if (!featuredWrapper) return;

  try {
    // Show loading
    showLoading(featuredWrapper, 'Loading books...');

    const products = await API.products.getAll();

    // Clear loading
    featuredWrapper.innerHTML = '';

    // Populate products
    products.forEach(product => {
      const productHTML = createProductSlide(product);
      featuredWrapper.insertAdjacentHTML('beforeend', productHTML);
    });

    // Reinitialize Swiper if needed
    if (window.featuredSwiper) {
      window.featuredSwiper.destroy();
    }
    window.featuredSwiper = new Swiper('.featured-slider', {
      spaceBetween: 10,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        450: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      },
    });

  } catch (error) {
    console.error('Error loading products:', error);
    showError(featuredWrapper, 'Failed to load books. Please try again later.');
  }
}

// Create product slide HTML
function createProductSlide(product) {
  const originalPrice = product.originalPrice ? `<span>$${product.originalPrice.toFixed(2)}</span>` : '';
  const stockStatus = product.inStock ? 'In Stock' : 'Out of Stock';
  const stockClass = product.inStock ? 'stockStatus' : 'stockStatus out';

  return `
    <div class="swiper-slide box">
      <div class="icons">
        <a href="#" class="fas fa-search"></a>
        <a href="#" class="fas fa-eye"></a>
      </div>
      <div class="image">
        <a href="./product.html?id=${product._id}">
          <img src="${product.image}" alt="${product.title}">
        </a>
      </div>
      <div class="content">
        <h3>${product.title}</h3>
        <div class="price">$${product.price.toFixed(2)} ${originalPrice}</div>
        <p class="${stockClass}">${stockStatus}</p>
        <button class="btn add-to-cart" data-product-id="${product._id}" ${!product.inStock ? 'disabled' : ''}>
          ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  `;
}

// Handle add to cart
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('add-to-cart')) {
    e.preventDefault();
    const productId = e.target.dataset.productId;

    try {
      // Fetch full product details
      const product = await API.products.getById(productId);

      // Add to cart
      addToCart(product, 1);

      // Update cart count in header
      updateCartCount();

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  }
});

// Utility functions
function showLoading(element, text = 'Loading...') {
  element.innerHTML = `<div class="swiper-slide loading-slide"><div class="loading" style="text-align: center; padding: 20px; color: #666;">${text}</div></div>`;
}

function showError(element, message) {
  element.innerHTML = `<div class="swiper-slide error-slide"><div class="error" style="text-align: center; padding: 20px; color: #f00;">${message}</div></div>`;
}