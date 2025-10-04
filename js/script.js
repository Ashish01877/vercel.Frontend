let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
  searchForm.classList.toggle('active');
}

// Search functionality
document.querySelector('.search-form input').addEventListener('input', async function(e) {
  const query = e.target.value.trim();
  if (query.length > 2) {
    await searchProducts(query);
  } else if (query.length === 0) {
    // Reload all products if search is cleared
    await loadFeaturedProducts();
  }
});

async function searchProducts(query) {
  try {
    const response = await API.products.getAll({ search: query, limit: 10 });
    const products = response.products || response;

    const featuredWrapper = document.querySelector('.featured-slider .swiper-wrapper');
    if (!featuredWrapper) return;

    // Clear existing content
    featuredWrapper.innerHTML = '';

    if (products.length === 0) {
      featuredWrapper.innerHTML = '<div class="swiper-slide"><p>No products found</p></div>';
      return;
    }

    // Add search results
    products.forEach(product => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide box';

      slide.innerHTML = `
        <div class="icons">
          <a href="#" class="fas fa-search"></a>
          <a href="#" class="fas fa-eye"></a>
        </div>
        <div class="image">
          <a href="./product.html?id=${product._id}">
            <img src="${product.image || 'image/book-1.png'}" alt="${product.title}">
          </a>
        </div>
        <div class="content">
          <h3>${product.title}</h3>
          <div class="price">$${product.price.toFixed(2)} ${product.originalPrice ? `<span>$${product.originalPrice.toFixed(2)}</span>` : ''}</div>
          <a href="./cart.html" class="btn" onclick='addToCart(${JSON.stringify(product).replace(/'/g, "\\'")})'>add to cart</a>
        </div>
      `;

      featuredWrapper.appendChild(slide);
    });

  } catch (error) {
    console.error('Search failed:', error);
  }
}

let loginForm = document.querySelector('.login-form-container');

document.querySelector('#login-btn').onclick = () =>{
  loginForm.classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () =>{
  loginForm.classList.remove('active');
}

// Firebase Authentication - Initialize after Firebase loads
function initializeFirebaseAuth() {
  console.log('Initializing Firebase auth...');

  // Login form handling
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const showSignupBtn = document.getElementById('show-signup');
  const showLoginBtn = document.getElementById('show-login');

  // Show Firebase warning if not configured
  const firebaseWarning = document.getElementById('firebase-warning');
  if (firebaseWarning) {
    if (!window.firebaseReady) {
      firebaseWarning.style.display = 'block';
      console.log('Firebase not configured - showing warning');
    } else {
      firebaseWarning.style.display = 'none';
      console.log('Firebase configured - hiding warning');
    }
  }

  // Toggle between login and signup forms
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (loginForm) loginForm.style.display = 'none';
      if (signupForm) signupForm.style.display = 'block';
    });
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (signupForm) signupForm.style.display = 'none';
      if (loginForm) loginForm.style.display = 'block';
    });
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Check if Firebase is ready
      if (!window.firebaseReady) {
        alert('Firebase authentication is not configured. Please set up your Firebase project first. Check FIREBASE_SETUP.md for instructions.');
        return;
      }

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const userCredential = await window.firebaseSignIn(window.firebaseAuth, email, password);
        const user = userCredential.user;
        console.log('Login successful:', user);

        alert('Login successful!');
        loginForm.closest('.login-form-container').classList.remove('active');

        // Update UI for logged in user
        updateUserUI(user);
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
      }
    });
  }

  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Check if Firebase is ready
      if (!window.firebaseReady) {
        alert('Firebase authentication is not configured. Please set up your Firebase project first. Check FIREBASE_SETUP.md for instructions.');
        return;
      }

      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      try {
        const userCredential = await window.firebaseSignUp(window.firebaseAuth, email, password);
        const user = userCredential.user;
        console.log('Signup successful:', user);

        alert('Account created successfully! You are now logged in.');
        signupForm.closest('.login-form-container').classList.remove('active');

        // Update UI for logged in user
        updateUserUI(user);
      } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
      }
    });
  }

  // Listen for authentication state changes
  if (window.firebaseReady && window.firebaseOnAuthStateChanged) {
    window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
        updateUserUI(user);
      } else {
        console.log('User is signed out');
        updateUserUI(null);
      }
    });
  } else {
    console.log('Firebase not ready for auth state listener');
  }
}

// Update UI based on user login status
function updateUserUI(user) {
  const loginBtn = document.querySelector('#login-btn');
  if (user) {
    // Show user email or display name
    const displayName = user.displayName || user.email.split('@')[0];
    loginBtn.innerHTML = '<i class="fas fa-user"></i> ' + displayName;

    // Change to logout functionality
    loginBtn.onclick = function() {
      window.firebaseSignOut(window.firebaseAuth).then(() => {
        alert('Logged out successfully!');
        location.reload();
      }).catch((error) => {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
      });
    };
  } else {
    // Reset to login functionality
    loginBtn.innerHTML = '<i class="fas fa-user"></i>';
    loginBtn.onclick = function() {
      document.querySelector('.login-form-container').classList.toggle('active');
    };
  }
}

window.onscroll = () =>{

  searchForm.classList.remove('active');

  if(window.scrollY > 80){
    document.querySelector('.header .header-2').classList.add('active');
  }else{
    document.querySelector('.header .header-2').classList.remove('active');
  }

}

window.onload = () =>{

  if(window.scrollY > 80){
    document.querySelector('.header .header-2').classList.add('active');
  }else{
    document.querySelector('.header .header-2').classList.remove('active');
  }

  fadeOut();

}

function loader(){
  document.querySelector('.loader-container').classList.add('active');
}

function fadeOut(){
  setTimeout(loader, 4000);
}

// Initialize Swiper instances after libraries are loaded
function initializeSwipers() {
  if (typeof Swiper === 'undefined') {
    console.log('Swiper not loaded yet, retrying...');
    setTimeout(initializeSwipers, 500);
    return;
  }

  console.log('Initializing all Swiper instances...');

  // Books slider
  if (document.querySelector('.books-slider')) {
    var swiper = new Swiper(".books-slider", {
      loop:true,
      centeredSlides: true,
      autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }

  // Featured slider (will be reinitialized after loading products)
  if (document.querySelector('.featured-slider')) {
    var swiper = new Swiper(".featured-slider", {
      spaceBetween: 10,
      loop:true,
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
        0: {
          slidesPerView: 1,
        },
        450: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      },
    });
  }

  // Arrivals slider
  if (document.querySelector('.arrivals-slider')) {
    var swiper = new Swiper(".arrivals-slider", {
      spaceBetween: 10,
      loop:true,
      centeredSlides: true,
      autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }

  // Reviews slider
  if (document.querySelector('.reviews-slider')) {
    var swiper = new Swiper(".reviews-slider", {
      spaceBetween: 10,
      grabCursor:true,
      loop:true,
      centeredSlides: true,
      autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }

  // Blogs slider
  if (document.querySelector('.blogs-slider')) {
    var swiper = new Swiper(".blogs-slider", {
      spaceBetween: 10,
      grabCursor:true,
      loop:true,
      centeredSlides: true,
      autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }

  console.log('All Swiper instances initialized');
}

// Initialize swipers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Swiper...');
  initializeSwipers();
});

// Load featured products from API
async function loadFeaturedProducts() {
  console.log('Loading featured products...');
  const featuredWrapper = document.querySelector('.featured-slider .swiper-wrapper');
  console.log('Featured wrapper found:', !!featuredWrapper);

  if (!featuredWrapper) {
    console.error('Featured wrapper not found!');
    return;
  }

  // Show loading
  showLoading(featuredWrapper, 'Loading products...');

  try {
    console.log('Making API call...');
    const response = await API.products.getAll({ limit: 10 });
    console.log('API response:', response);

    const products = response.products || response;
    console.log('Products extracted:', products);

    // Clear loading
    featuredWrapper.innerHTML = '';

    if (!products || products.length === 0) {
      console.log('No products found');
      featuredWrapper.innerHTML = '<div class="swiper-slide"><p>No products available</p></div>';
      return;
    }

    console.log(`Adding ${products.length} products to DOM`);

    // Add products dynamically
    products.forEach((product, index) => {
      console.log(`Adding product ${index + 1}:`, product.title);
      const slide = document.createElement('div');
      slide.className = 'swiper-slide box';

      slide.innerHTML = `
        <div class="icons">
          <a href="#" class="fas fa-search"></a>
          <a href="#" class="fas fa-eye"></a>
        </div>
        <div class="image">
          <a href="./product.html?id=${product._id}">
            <img src="${product.image || 'image/book-1.png'}" alt="${product.title}" onerror="this.src='image/book-1.png'">
          </a>
        </div>
        <div class="content">
          <h3>${product.title}</h3>
          <div class="price">$${product.price.toFixed(2)} ${product.originalPrice ? `<span>$${product.originalPrice.toFixed(2)}</span>` : ''}</div>
          <a href="./cart.html" class="btn" onclick='addToCart(${JSON.stringify(product).replace(/'/g, "\\'")})'>add to cart</a>
        </div>
      `;

      featuredWrapper.appendChild(slide);
    });

    console.log('Products added to DOM, initializing swiper...');

    // Initialize swiper with retry mechanism
    const initSwiper = () => {
      if (typeof Swiper !== 'undefined') {
        // Destroy existing swiper and create new one
        const sliderElement = document.querySelector('.featured-slider');
        if (sliderElement && sliderElement.swiper) {
          sliderElement.swiper.destroy();
        }

        var swiper = new Swiper(".featured-slider", {
          spaceBetween: 10,
          loop: products.length > 4,
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
            0: {
              slidesPerView: 1,
            },
            450: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          },
        });
        console.log('Swiper initialized successfully');
      } else {
        console.log('Swiper not ready, retrying...');
        setTimeout(initSwiper, 500);
      }
    };

    initSwiper();

  } catch (error) {
    console.error('Failed to load featured products:', error);
    showError(featuredWrapper, 'Failed to load products. Please try again later.');
  }
}

// Add to cart function - accepts product data directly to avoid API calls
function addToCart(productData) {
  try {
    console.log('Adding to cart:', productData);

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already in cart
    const existingItem = cart.find(item => item._id === productData._id);
    if (existingItem) {
      existingItem.quantity += 1;
      console.log('Increased quantity for existing item');
    } else {
      cart.push({
        _id: productData._id,
        title: productData.title,
        price: productData.price,
        originalPrice: productData.originalPrice,
        image: productData.image,
        quantity: 1,
        inStock: productData.inStock
      });
      console.log('Added new item to cart');
    }

    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved, total items:', cart.length);

    alert('Added to cart!');
  } catch (error) {
    console.error('Failed to add to cart:', error);
    alert('Failed to add item to cart. Please try again.');
  }
}

// Fallback function if API is not available
async function loadFeaturedProductsFallback() {
  console.log('Using fallback product loading...');
  const featuredWrapper = document.querySelector('.featured-slider .swiper-wrapper');
  if (!featuredWrapper) {
    console.error('Featured wrapper not found');
    return;
  }

  // Show loading
  featuredWrapper.innerHTML = '<div class="swiper-slide"><div class="loading">Loading products...</div></div>';

  try {
    // Try direct fetch
    console.log('Trying direct fetch to /api/products...');
    const response = await fetch('/api/products');
    console.log('Direct fetch response:', response);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Direct fetch data:', data);

    const products = data.products || data;
    console.log('Products from direct fetch:', products);

    // Clear loading
    featuredWrapper.innerHTML = '';

    if (!products || products.length === 0) {
      featuredWrapper.innerHTML = '<div class="swiper-slide"><p>No products available</p></div>';
      return;
    }

    // Add products
    products.forEach((product, index) => {
      console.log(`Adding product ${index + 1}:`, product.title);
      const slide = document.createElement('div');
      slide.className = 'swiper-slide box';
      slide.innerHTML = `
        <div class="image">
          <img src="${product.image || 'image/book-1.png'}" alt="${product.title}" onerror="this.src='image/book-1.png'">
        </div>
        <div class="content">
          <h3>${product.title}</h3>
          <div class="price">$${product.price ? product.price.toFixed(2) : '15.99'}</div>
        </div>
      `;
      featuredWrapper.appendChild(slide);
    });

    console.log('Products added via fallback');

  } catch (error) {
    console.error('Fallback failed:', error);
    featuredWrapper.innerHTML = '<div class="swiper-slide"><div class="error">Failed to load products</div></div>';
  }
}

// Load products and initialize Firebase when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');

  // Initialize Firebase auth after a short delay to ensure Firebase is loaded
  setTimeout(() => {
    initializeFirebaseAuth();
  }, 1000);

  // Load products with better API availability checking
  loadProductsWhenReady();
});

// Function to load products when API is ready
function loadProductsWhenReady() {
  console.log('Checking API availability...');
  console.log('API object:', typeof API);
  console.log('window.API:', typeof window.API);

  // Check if API is available
  if (typeof window.API !== 'undefined' && window.API) {
    console.log('API available, loading products...');
    loadFeaturedProducts();
  } else {
    console.log('API not available yet, waiting...');
    // Wait and try again, but give up after 10 seconds
    if (window.apiCheckAttempts >= 20) {
      console.error('API failed to load after 10 seconds, using fallback');
      loadFeaturedProductsFallback();
      return;
    }
    window.apiCheckAttempts = (window.apiCheckAttempts || 0) + 1;
    setTimeout(loadProductsWhenReady, 500);
  }
}
