# CampusFix AI - Quick Deployment Checklist

## Pre-Deployment Checklist

- [ ] Firebase project created with Spark plan
- [ ] Gemini API key obtained from Google AI Studio
- [ ] Mapbox access token created
- [ ] Backend deployed to Render with environment variables set
- [ ] Firebase Hosting enabled
- [ ] All `.env` files filled with correct values
- [ ] `.env` files are in `.gitignore`

## Deployment Steps

### 1. Backend Deployment (Render)

```bash
# Push to GitHub
git add .
git commit -m "Initial CampusFix AI deployment"
git push origin main

# Go to Render and create new Web Service
# Connect your GitHub repository
```

**Render Configuration:**
```
Build Command: cd server && npm install
Start Command: cd server && node index.js
Instance Type: Free
Environment Variables:
  - GEMINI_API_KEY=<your-gemini-key>
  - PORT=10000
  - CLIENT_URL=https://<your-firebase-domain>.web.app
```

After deployment, note your Render URL (e.g., `https://campusfix-api.onrender.com`)

### 2. Frontend Environment Setup

Update `VITE_API_URL` in `.env` to your Render backend URL:
```env
VITE_API_URL=https://campusfix-api.onrender.com
```

### 3. Build & Deploy to Firebase Hosting

```bash
# Install Firebase tools
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting
# Respond:
# - Project: Select your CampusFixAI project
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# Build the app
npm run build

# Deploy
firebase deploy --only hosting
```

Your app is now live at `https://<your-firebase-project>.web.app`

### 4. Update Firebase Hosting Environment Variables (Optional)

For production builds, you may want to set environment variables in Firebase:

```bash
firebase functions:config:set \
  env.gemini_api_key="YOUR_GEMINI_KEY" \
  env.mapbox_token="YOUR_MAPBOX_TOKEN"
```

### 5. Set Firestore Security Rules

In Firebase Console → Firestore Database → Rules, paste the contents of `firestore.rules`

### 6. Make Admin Users

In Firebase Console → Firestore Database → Collections → users:
- Find your user document
- Set `role` field to `admin`

## Testing

### Local Testing
```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend
npm run dev
```

Visit `http://localhost:5173`

### Production Testing
Visit your Firebase Hosting URL and verify:
- [ ] Google login works
- [ ] Can create a new ticket
- [ ] AI classification works
- [ ] Mapbox map displays correctly
- [ ] Admin can access dashboard
- [ ] Filters work properly
- [ ] Analytics page loads

## Monitoring

### Check Logs
**Backend (Render):**
- Render Dashboard → Logs

**Frontend (Firebase):**
- Firebase Console → Hosting → Logs

**Issues?**
1. Check browser console for errors (F12)
2. Check browser network tab for API calls
3. Verify environment variables are set correctly
4. Check Firebase & Render logs

## Database Backups

Firestore automatically maintains backups. To export data:
```bash
# Export Firestore
firebase firestore:export ./backups/$(date +%Y%m%d_%H%M%S)
```

## Updating Code

```bash
# Make changes to code
git add .
git commit -m "Description of changes"
git push origin main

# For backend:
# Render automatically redeploys when you push to GitHub

# For frontend:
npm run build
firebase deploy --only hosting
```

---

**Successfully deployed! 🎉**
