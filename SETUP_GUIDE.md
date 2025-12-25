# CampusFix AI - Complete Setup & Deployment Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 16+ installed
- Firebase account (free)
- Google Generative AI API key
- Mapbox account (free tier)

### 1. Clone & Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2. Configure Environment Variables

**Frontend (.env)**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_MAPBOX_TOKEN=your_mapbox_public_token
VITE_API_URL=http://localhost:3000
```

**Backend (server/.env)**
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
CLIENT_URL=http://localhost:5173
```

### 3. Run Local Development

```bash
# Terminal 1 - Frontend
npm run dev
# Visit http://localhost:5173

# Terminal 2 - Backend
cd server
npm start
# Server runs on http://localhost:3000
```

---

## 🔧 Feature Overview

### Student Features
- ✅ Sign up with Email/Password or Google
- ✅ Report issues with description & optional photos
- ✅ Select location on campus map
- ✅ AI-powered issue classification (category + urgency)
- ✅ View ticket status and resolution updates
- ✅ Track complaint history

### Admin Features
- ✅ Dashboard with all tickets and filters
- ✅ Real-time heatmap showing issue locations
- ✅ Analytics dashboard with metrics
- ✅ Category & urgency filtering
- ✅ Staff assignment for tickets
- ✅ Status management (Open → In Progress → Resolved)

### AI Classification
- Category detection (Electrical, Water, Cleanliness, Infrastructure, Safety, Hostel, Academic, Other)
- Urgency scoring (1-10 scale)
- Automatic summary generation
- Photo analysis support

---

## 🌍 Firebase Setup (Step-by-Step)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Name: `CampusFix`
4. Disable Google Analytics
5. Create project

### 2. Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable **Google** provider
3. Enable **Email/Password** provider
4. Add authorized domains (localhost for development, your domain for production)

### 3. Create Firestore Database
1. Go to Firestore Database
2. Click "Create Database"
3. Select **Spark Plan** (free)
4. Start in Production mode
5. Location: Singapore (closest to India)

### 4. Create Collections
In Firestore, create these collections with sample documents:

**users collection**
```json
{
  "email": "admin@example.com",
  "displayName": "Admin User",
  "role": "admin",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**tickets collection**
```json
{
  "title": "Broken Water Tap",
  "description": "Water tap in building A is leaking",
  "category": "Water",
  "urgency": 5,
  "status": "open",
  "studentId": "uid123",
  "studentEmail": "student@example.com",
  "location": {
    "lat": 19.0730,
    "lng": 72.8997
  },
  "photoUrl": "",
  "createdAt": "2025-01-01T12:00:00Z",
  "updatedAt": "2025-01-01T12:00:00Z"
}
```

### 5. Configure Firestore Security Rules
In Firestore → Rules, paste this:

```firestore
rules_version = '3';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - each user can only read/write their own document
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId && !request.resource.data.role;
    }

    // Tickets collection
    match /tickets/{ticketId} {
      // Students can create and read their own tickets
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
      allow read: if request.auth.uid == resource.data.studentId || getUserRole(request.auth.uid) == 'admin';
      allow update: if getUserRole(request.auth.uid) == 'admin';
      allow delete: if false;
    }
  }

  function getUserRole(uid) {
    return get(/databases/$(database)/documents/users/$(uid)).data.role;
  }
}
```

### 6. Enable Cloud Storage
1. Go to Storage
2. Click "Start in test mode"
3. Location: Singapore
4. Click "Done"

---

## 🔑 Google Generative AI Setup

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Add to `server/.env` as `GEMINI_API_KEY`

**Note**: Use Google AI Studio, NOT Vertex AI (no credit card required)

---

## 🗺️ Mapbox Setup

### 1. Get Mapbox Token
1. Go to [Mapbox](https://account.mapbox.com/auth/signin/)
2. Sign up / Sign in
3. Go to Tokens page
4. Copy your Default Public Token
5. Add to `.env` as `VITE_MAPBOX_TOKEN`

### Campus Coordinates
- **Somaiya Campus Center**: 19.0730°N, 72.8997°E

---

## 📊 Backend API Endpoints

### POST /api/classify
Classifies a ticket with AI

**Request:**
```json
{
  "description": "Water leaking from tap in building A",
  "photo": "base64_encoded_image_optional"
}
```

**Response:**
```json
{
  "category": "Water",
  "urgency": 7,
  "summary": "Water tap leak in building A"
}
```

---

## 🎯 Making Admin Users

### Method 1: Firestore Console
1. Open Firestore Console
2. Go to `users` collection
3. Find the user document
4. Edit `role` field: change `"student"` to `"admin"`

### Method 2: Firebase Functions (Advanced)
Create a Cloud Function to set admin role on user signup.

---

## 🚀 Production Deployment

### Backend Deployment (Render)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - Set settings:
     - Name: `campusfix-server`
     - Environment: Node
     - Build Command: `cd server && npm install`
     - Start Command: `cd server && npm start`
   - Add environment variables:
     - `GEMINI_API_KEY`
     - `CLIENT_URL=https://your-frontend-url.com`
   - Click "Create Web Service"

4. **Get Backend URL**
   - After deployment, copy the service URL
   - Update frontend `VITE_API_URL` to this URL

### Frontend Deployment (Firebase Hosting)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Choose your project
   - Public directory: `dist`
   - Configure as SPA: Yes
   - Overwrite: No

3. **Build & Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

4. **Update CORS in Backend**
   - Update `CLIENT_URL` in `server/.env` to your Firebase Hosting URL
   - Redeploy backend on Render

---

## 🔍 Common Issues & Solutions

### 1. Firebase Offline Errors
**Problem**: "Failed to get document because the client is offline"

**Solution**:
- Check internet connection
- Verify Firebase credentials are correct
- Clear browser cache
- Check if firestore.googleapis.com is accessible (not blocked by firewall/proxy)

### 2. AI Classification 500 Error
**Problem**: `/api/classify` returns 500 error

**Solution**:
- Verify `GEMINI_API_KEY` is correct
- Check if API key has Generative AI access
- Ensure backend server is running
- Check server logs for detailed error

### 3. Mapbox Not Loading
**Problem**: Mapbox token errors

**Solution**:
- Verify `VITE_MAPBOX_TOKEN` is public token, not secret
- Check token is enabled for Maps GL
- Clear browser cache

### 4. Login Issues
**Problem**: Google Sign-in not working

**Solution**:
- Add localhost to authorized domains in Firebase
- For production, add your domain to Firebase authorized domains
- Check browser console for specific error

---

## 📈 Performance Optimization

### Frontend Optimizations
- ✅ Code splitting with Vite
- ✅ Image optimization
- ✅ Lazy loading components
- ✅ CSS minification
- ✅ Terser compression (no console logs in production)

### Backend Optimizations
- ✅ Request validation
- ✅ Error handling
- ✅ CORS optimization
- ✅ Image size limits (5MB max)

### Firebase Optimizations
- ✅ Indexes for filtered queries
- ✅ Collection-level security rules
- ✅ Cached reads
- ✅ Regional database (Singapore)

---

## 🧪 Testing

### Test Student Flow
1. Sign up with email/password
2. Create a new ticket with photo
3. Select location on map
4. Click "Classify with AI"
5. Verify AI response
6. Submit ticket
7. Check "My Tickets" page

### Test Admin Flow
1. Sign in as admin user (role must be 'admin' in Firestore)
2. Access `/admin/dashboard`
3. Check ticket list and filters
4. Test category/urgency filtering
5. Assign ticket to staff
6. View heatmap at `/admin/map`
7. Check analytics at `/admin/analytics`

---

## 📱 Mobile Optimization

The app is fully responsive:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

All features work seamlessly on mobile devices.

---

## 🔐 Security Checklist

- ✅ Firebase Spark plan (no billing risk)
- ✅ Role-based access control
- ✅ User authentication required
- ✅ Firestore security rules enforced
- ✅ API key validation on backend
- ✅ CORS properly configured
- ✅ No sensitive data in frontend code
- ✅ Environment variables in .env files (not in git)

---

## 📞 Support & Next Steps

### For Issues
1. Check browser console (F12) for errors
2. Check server logs in terminal
3. Verify all environment variables
4. Check Firebase console for any warnings

### For Enhancements
- Add more dashboard widgets
- Implement email notifications
- Add ticket chat/comments
- Create mobile app with React Native
- Add SMS alerts for urgent issues

---

## 📋 File Structure Reference

```
CampusFix/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx          # Home page
│   │   ├── Login.jsx             # Auth page (email + Google)
│   │   ├── Student/
│   │   │   ├── NewTicket.jsx    # Create complaint
│   │   │   └── MyTickets.jsx    # View complaints
│   │   └── Admin/
│   │       ├── Dashboard.jsx    # Ticket management
│   │       ├── Map.jsx          # Heatmap visualization
│   │       └── Analytics.jsx    # Statistics
│   ├── components/
│   │   └── Navbar.jsx           # Navigation
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state
│   ├── services/
│   │   └── api.js               # Backend API client
│   ├── config/
│   │   └── firebase.js          # Firebase config
│   ├── App.jsx                  # Routes
│   └── App.css                  # Styles
├── server/
│   ├── index.js                 # Express backend
│   └── package.json
├── index.html                   # HTML entry
├── vite.config.js               # Build config
└── package.json
```

---

**Last Updated**: December 25, 2025
**Status**: Production Ready ✅
