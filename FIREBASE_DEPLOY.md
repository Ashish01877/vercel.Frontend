# Firebase Hosting Deployment Guide for Books4MU

This guide will help you deploy your Books4MU frontend application to Firebase Hosting.

## 🚀 Quick Deployment Steps

### ⚠️ IMPORTANT: Use Firebase Hosting (FREE) - NOT App Hosting

**Firebase App Hosting requires billing, but Firebase Hosting is FREE!**

### Step 1: Login to Firebase (Interactive)
```bash
firebase login
```
- This will open a browser window for authentication
- Sign in with your Google account

### Step 2: Deploy to Firebase Hosting (Skip firebase init)
```bash
cd frontend
firebase deploy --only hosting
```
- This will deploy your frontend to Firebase Hosting
- You'll get a hosting URL like: `https://book4mu-794ca.web.app`

### Alternative: If you need to initialize
```bash
cd frontend
firebase init hosting
```
- **IMPORTANT:** When asked "Which Firebase CLI features do you want to set up for this folder?", select **only "Hosting"**
- **DO NOT** select "App Hosting" - that requires billing
- Select your existing project: `book4mu-794ca`
- Public directory: `.` (current directory)
- Configure as single-page app: `Yes`
- File to overwrite: `No` (keep existing files)

### Step 3: Verify Deployment
```bash
cd frontend
firebase deploy --only hosting
```
- Should deploy successfully without billing errors

## 📋 Detailed Setup

## 🚨 CRITICAL: Backend Deployment Required

**Your backend MUST be deployed separately.** Firebase Hosting only serves static files. Without a deployed backend, products won't load and checkout won't work.

### **Backend Deployment Steps:**

#### **Option 1: Render (Recommended - Free & Easy)**

1. **Go to [Render.com](https://render.com)** and sign up
2. **Click "New" → "Web Service"**
3. **Connect your GitHub repo** (or upload `proj/backend` folder)
4. **Configure:**
   - **Name:** `books4mu-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Add Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://your-mongodb-atlas-connection-string
   JWT_SECRET=your_jwt_secret_key_here
   PORT=10000
   ```
6. **Deploy** - Get your URL like: `https://books4mu-backend.onrender.com`

#### **Option 2: Railway (Also Free & Easy)**

1. **Go to [Railway.app](https://railway.app)** and sign up
2. **Click "New Project" → "Deploy from GitHub"**
3. **Connect your repo** and select the `backend` folder
4. **Add environment variables** (same as above)
5. **Deploy** - Get your URL

#### **Option 3: Heroku (Classic Choice)**

1. **Install Heroku CLI:** `npm install -g heroku`
2. **Login:** `heroku login`
3. **Create app:** `heroku create books4mu-backend`
4. **Set environment variables:**
   ```bash
   heroku config:set MONGO_URI="your-mongodb-connection"
   heroku config:set JWT_SECRET="your-secret"
   ```
5. **Deploy:** `git push heroku main`

### **MongoDB Setup (Required):**

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create free cluster**
3. **Create database user**
4. **Whitelist IP: `0.0.0.0/0`** (for all IPs)
5. **Get connection string** and update `MONGO_URI`

### Update API Configuration

**✅ Already Done!** Your `js/api.js` is configured to automatically detect production and use the correct backend URL.

**Current Configuration:**
```javascript
const isProduction = window.location.hostname !== 'localhost';
const API_BASE_URL = isProduction
  ? 'https://books4mu-backend.onrender.com/api'  // Replace with your actual backend URL
  : '/api';
```

**After deploying your backend:**
1. Replace `'https://books4mu-backend.onrender.com/api'` with your actual backend URL
2. Example: `'https://your-app-name.onrender.com/api'`

### Firebase Configuration Files Created

- `firebase.json` - Hosting configuration
- `.firebaserc` - Project configuration

## 🔧 Manual File Setup (Already Done)

The following files have been configured for deployment:

### firebase.json
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/backend/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "book4mu-794ca"
  }
}
```

## 📱 Testing Deployment

### Local Testing
```bash
cd frontend
firebase serve
```
- Test locally before deploying
- Access at: `http://localhost:5000`

### Production Testing
After deployment:
1. Visit your Firebase hosting URL
2. Test login functionality
3. Test product browsing
4. Test cart functionality
5. Test checkout (will need backend for orders)

## 🔄 Updating Your App

### Make Changes
1. Edit your code in the `frontend/` directory
2. Test locally: `npm run firebase:serve`
3. Deploy updates: `npm run firebase:deploy`

### Version Control
```bash
git add .
git commit -m "Update Books4MU frontend"
git push origin main
```

## 🚨 Important Notes

### CORS Issues
- Ensure your backend allows requests from your Firebase domain
- Add your Firebase hosting URL to backend CORS settings

### Environment Variables
- Update any hardcoded URLs in your code
- Ensure API endpoints point to production backend

### Firebase Functions (Optional)
If you want to deploy backend to Firebase Functions:
```bash
firebase init functions
# Then deploy both hosting and functions
firebase deploy
```

## 🎯 Complete Deployment Checklist

### Phase 1: Backend Deployment (REQUIRED FIRST)
- [ ] Choose backend hosting: Render/Railway/Heroku
- [ ] Create MongoDB Atlas account and cluster
- [ ] Deploy backend to chosen platform
- [ ] Get production backend URL (e.g., `https://your-app.onrender.com`)
- [ ] Test backend API: `curl https://your-backend-url/api/products`

### Phase 2: Frontend Deployment
- [ ] Update `js/api.js` with your actual backend URL
- [ ] Firebase CLI installed
- [ ] Logged in to Firebase (`firebase login`)
- [ ] Deploy frontend: `firebase deploy --only hosting`
- [ ] Get hosting URL (e.g., `https://book4mu-794ca.web.app`)

### Phase 3: Final Testing
- [ ] Visit Firebase hosting URL
- [ ] Products load from backend API
- [ ] Login/signup works with Firebase
- [ ] Cart and checkout functional
- [ ] All features working in production

## 🚨 CURRENT STATUS: Backend Not Deployed

**Your frontend is deployed but products won't load because:**
- Frontend calls: `https://books4mu-backend.onrender.com/api/products`
- But no backend is deployed at that URL yet!

**Next Steps:**
1. Deploy backend to Render/Railway/Heroku
2. Update API URL in `js/api.js`
3. Redeploy frontend to Firebase
4. Products will then load correctly!

## 🆘 Troubleshooting

### "Cannot run login in non-interactive mode"
- Run `firebase login` in your terminal directly (not through scripts)

### "No project selected"
- Check `.firebaserc` file has correct project ID
- Run `firebase use book4mu-794ca`

### API calls failing
- Check backend URL in `js/api.js`
- Ensure backend CORS allows Firebase domain
- Check browser console for CORS errors

### Build errors
- Ensure all files are in correct locations
- Check `firebase.json` public directory setting

## 📞 Support

If you encounter issues:
1. Check Firebase console for deployment status
2. Review browser console for JavaScript errors
3. Verify backend is running and accessible
4. Check Firebase hosting logs

---

**Happy deploying! Your Books4MU app will be live on Firebase Hosting! 🎉**