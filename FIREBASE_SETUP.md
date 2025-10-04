# Firebase Authentication Setup for Books4MU

This guide will help you set up Firebase Authentication for your Books4MU application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "books4mu")
4. Follow the setup wizard to create your project

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on the **Get started** button
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. You can also enable other providers like Google, Facebook, etc. if desired

## Step 3: Get Your Firebase Configuration

1. In your Firebase project, click on the gear icon (⚙️) → **Project settings**
2. Scroll down to "Your apps" section
3. Click on the **Web app icon** (`</>`) to add a web app
4. Enter an app nickname (e.g., "Books4MU Web App")
5. **Copy the configuration object** - it should look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

## Step 4: Update Your Code

1. Open `proj/index.html`
2. Replace the placeholder Firebase config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Test Authentication

1. Start your backend server: `cd proj/backend && npm start`
2. Open your browser to `http://localhost:5000/`
3. Click the user icon to open the login form
4. Try creating a new account or logging in

## Features Now Available

- ✅ User registration with email/password
- ✅ User login/logout
- ✅ Persistent authentication state
- ✅ Protected checkout process
- ✅ Order creation with Firebase user ID

## 🚨 Quick Fix: "auth/operation-not-allowed" Error

If you see this error when trying to signup/login, you need to **enable Email/Password authentication** in Firebase:

### Steps to Fix:

1. **Go to Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Select your project:** `book4mu-794ca`
3. **Click "Authentication"** in the left sidebar
4. **Go to "Sign-in method" tab**
5. **Find "Email/Password"** in the provider list
6. **Click the toggle to enable it**
7. **Save changes**

### Visual Guide:
```
Firebase Console → Your Project → Authentication → Sign-in method → Email/Password → Enable
```

**After enabling, try signup/login again - it should work!**

## Troubleshooting

### "Auth/network-request-failed"
- Check your internet connection
- Verify your Firebase config is correct

### "Auth/invalid-email"
- Make sure you're entering a valid email address

### "Auth/weak-password"
- Password must be at least 6 characters

### Orders not being created
- Make sure you're logged in with Firebase
- Check browser console for errors
- Verify backend is running on port 5000

## Security Rules

For production, make sure to set up proper security rules in Firebase:

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain
3. Set up reCAPTCHA if needed for additional security

## Next Steps

- Consider adding email verification
- Add password reset functionality
- Implement social login (Google, Facebook, etc.)
- Add user profile management

---

**Note:** Firebase Authentication is free for basic usage. Check Firebase pricing for production usage.