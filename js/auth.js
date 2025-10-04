// Firebase Authentication
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

let currentUser = null;

// Initialize auth state listener
onAuthStateChanged(window.auth, (user) => {
  currentUser = user;
  updateAuthUI(user);
});

// Update UI based on auth state
function updateAuthUI(user) {
  const loginBtn = document.getElementById('login-btn');
  const userIcon = document.querySelector('.fas.fa-user');

  if (user) {
    // User is signed in
    if (loginBtn) {
      loginBtn.style.display = 'none';
    }
    // Show user email or something
    console.log('User signed in:', user.email);
  } else {
    // User is signed out
    if (loginBtn) {
      loginBtn.style.display = 'inline-block';
    }
  }
}

// Login form handling
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form-container form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      try {
        const userCredential = await signInWithEmailAndPassword(window.auth, email, password);
        console.log('Login successful:', userCredential.user);
        // Hide login form
        document.querySelector('.login-form-container').classList.remove('active');
        alert('Login successful!');
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
      }
    });
  }

  // Handle signup (you might want to add a signup form)
  // For now, just login
});

// Logout function
window.logout = async () => {
  try {
    await signOut(window.auth);
    alert('Logged out successfully!');
  } catch (error) {
    console.error('Logout error:', error);
    alert('Logout failed: ' + error.message);
  }
};

// Export current user
window.getCurrentUser = () => currentUser;