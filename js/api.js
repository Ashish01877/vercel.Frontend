// API Configuration - Environment-aware
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction
  ? 'https://books4mu-backend.onrender.com/api'  // Replace with your actual production backend URL
  : '/api';  // Local development

// Utility function for making API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available (skip for orders since we use Firebase)
  const token = localStorage.getItem('token');
  if (token && !endpoint.startsWith('/orders')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data.message || data || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);

    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your connection.');
    }

    throw error;
  }
}

// Show loading indicator
function showLoading(element, text = 'Loading...') {
  console.log('Showing loading:', text);
  if (element) {
    element.innerHTML = `<div class="swiper-slide loading-slide"><div class="loading" style="text-align: center; padding: 20px; color: #666;">${text}</div></div>`;
  }
}

// Hide loading indicator
function hideLoading(element) {
  // Implementation depends on how loading is shown
}

// Show error message
function showError(element, message) {
  console.log('Showing error:', message);
  if (element) {
    element.innerHTML = `<div class="swiper-slide error-slide"><div class="error" style="text-align: center; padding: 20px; color: #f00;">${message}</div></div>`;
  }
}

// Products API
const productsAPI = {
  // Get all products with optional query params
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return apiRequest(endpoint);
  },

  // Get single product
  async getById(id) {
    return apiRequest(`/products/${id}`);
  },

  // Create product (admin only)
  async create(productData) {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product (admin only)
  async update(id, productData) {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product (admin only)
  async delete(id) {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth API
const authAPI = {
  // Register user
  async register(userData) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  async login(credentials) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token if login successful
    if (response.token) {
      localStorage.setItem('token', response.token);
    }

    return response;
  },

  // Get current user
  async getCurrentUser() {
    return apiRequest('/auth/me');
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
  },
};

// Orders API
const ordersAPI = {
  // Get user's orders
  async getUserOrders() {
    return apiRequest('/orders');
  },

  // Get single order
  async getById(id) {
    return apiRequest(`/orders/${id}`);
  },

  // Create order
  async create(orderData) {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Update order status (admin only)
  async updateStatus(id, status) {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get all orders (admin only)
  async getAll() {
    return apiRequest('/orders/admin/all');
  },
};

// Export APIs
window.API = {
  products: productsAPI,
  auth: authAPI,
  orders: ordersAPI,
};