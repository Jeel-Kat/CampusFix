# 🚀 CampusFix AI - Complete Getting Started Guide

> Your complete campus issue reporting system is now ready! Follow this guide to get everything running.

## ⚡ 5-Minute Quick Start

### Step 1: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Create Environment Files

**Create `.env` in root directory:**
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_MAPBOX_TOKEN=your_mapbox_public_token
VITE_API_URL=http://localhost:3000
```

**Create `server/.env`:**
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
CLIENT_URL=http://localhost:5173
```

### Step 3: Run the Application

**Terminal 1 - Frontend:**
```bash
npm run dev
# Open http://localhost:5173 in your browser
```

**Terminal 2 - Backend:**
```bash
cd server
npm start
# Backend running on http://localhost:3000
```

### Step 4: Test It!

1. Visit http://localhost:5173
2. Click "Get Started" or "Sign In"
3. Sign up with email/password or Google
4. Create a complaint
5. Check admin dashboard

---

## 🔐 Getting API Keys & Credentials (10 Minutes)

### 1️⃣ Firebase Setup (Free)

Go to https://console.firebase.google.com

#### Create New Project
1. Click "Create Project"
2. Name: `CampusFix`
3. Disable Analytics → Create

#### Get Firebase Config
1. Go to Project Settings (⚙️)
2. Copy these values to `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

#### Enable Authentication
1. Go to Authentication → Sign-in method
2. **Enable Google**:
   - Click Google provider
   - Enable toggle
   - Add authorized domain: `localhost`
   - Save

3. **Enable Email/Password**:
   - Click Email/Password
   - Enable toggle
   - Save

#### Create Firestore Database
1. Go to Firestore Database
2. Click "Create Database"
3. Select: **Spark Plan** (FREE - $0/month)
4. Location: Singapore
5. Click "Create"

#### Enable Cloud Storage
1. Go to Storage
2. Click "Get Started"
3. Start in Test Mode
4. Location: Singapore
5. Done

---

### 2️⃣ Google Generative AI (Free - No Credit Card)

Go to https://makersuite.google.com/app/apikey

1. Click **"Create API Key"**
2. Copy the key
3. Add to `server/.env` as `GEMINI_API_KEY`

⚠️ **Important**: Use Google AI Studio, NOT Vertex AI (which requires billing)

---

### 3️⃣ Mapbox (Free)

Go to https://account.mapbox.com

1. Sign up or login
2. Go to Tokens page
3. Copy your **Default Public Token**
4. Add to `.env` as `VITE_MAPBOX_TOKEN`

---

## 👤 Create Admin Account

Admin users can see dashboards and analytics. Here's how to create one:

1. **Sign up normally** via the app
2. Go to Firebase Console → Firestore
3. Find the `users` collection
4. Click your user document
5. Edit the `role` field: change `"student"` to `"admin"`
6. **Log out and log back in**
7. You should now see Admin Dashboard link

---

## 🎯 Feature Overview

### 👨‍🎓 For Students

**Home Screen**
- Sign up with email/password or Google OAuth
- View landing page with app features

**Create Complaint** (`/student/new-ticket`)
- Describe the issue
- Upload a photo (optional)
- Select location on campus map
- Click "Classify with AI" to auto-categorize
- Submit complaint

**View Complaints** (`/student/my-tickets`)
- See all your complaints
- View status (Open, In Progress, Resolved)
- Filter by status
- See submission and update dates

### 👨‍💼 For Admins

**Dashboard** (`/admin/dashboard`)
- View all student complaints
- Filter by status, category, urgency
- Assign staff member to complaint
- Update ticket status
- See creation and update times

**Heatmap** (`/admin/map`)
- See all complaint locations on campus map
- Heatmap shows issue density
- Click markers for details
- Dark theme for better visibility

**Analytics** (`/admin/analytics`)
- Total tickets and breakdowns
- Status distribution
- Category breakdown list
- Urgency distribution histogram
- Average resolution time
- Last 24 hour metrics

---

## 🧪 Testing the Application

### Test 1: Sign Up with Email
1. Go to http://localhost:5173/login
2. Click "Sign Up" tab
3. Fill in: Name, Email, Password
4. Click "Create Account"
5. ✅ Should auto-sign in and redirect to app

### Test 2: Sign In with Email
1. Go to /login
2. Click "Sign In" tab
3. Enter your email and password
4. Click "Sign In"
5. ✅ Should redirect to student dashboard

### Test 3: Sign In with Google
1. Go to /login
2. Click "Continue with Google"
3. Select a Google account
4. ✅ Should create user and auto-sign in

### Test 4: Create Complaint
1. Go to "New Complaint"
2. Type description: "Water tap broken in library"
3. Upload a photo (optional)
4. Click on map to select location
5. Click "Classify with AI"
6. ✅ Should show category and urgency
7. Click "Submit Complaint"
8. ✅ Should appear in "My Tickets"

### Test 5: Admin Dashboard
1. Create admin account (change role in Firestore)
2. Log out and log back in
3. Go to Admin Dashboard
4. ✅ Should see your complaint in the list
5. Try filtering by status/category/urgency
6. Assign a staff member

---

## 🔍 Monitoring & Debugging

### Check Backend Logs
When running `npm start` in server directory, you'll see:
- AI classification requests
- Response times
- Any errors with detailed messages
- Example:
```
Classification requested: "Water leaking from tap"
AI Response: { "category": "Water", "urgency": 7, ... }
Response sent successfully
```

### Check Frontend Console (F12)
- Network tab: See API calls to backend
- Console tab: JavaScript errors
- Application tab: Local storage and Firebase

### Firebase Console Monitoring
- Go to https://console.firebase.google.com
- **Firestore**: See all data being stored
- **Authentication**: See all users
- **Storage**: See uploaded images

---

## 📊 Database Structure

### Firestore Collections

**`users` Collection** - All users in the system
```json
{
  "uid_here": {
    "email": "student@college.com",
    "displayName": "John Doe",
    "role": "student",  // or "admin"
    "createdAt": timestamp
  }
}
```

**`tickets` Collection** - All complaints
```json
{
  "ticket_id": {
    "title": "Water tap leak",
    "description": "Tap in building A bathroom is leaking",
    "category": "Water",
    "urgency": 7,
    "status": "open",  // "open", "in-progress", "resolved"
    "studentId": "uid_of_student",
    "studentEmail": "student@college.com",
    "location": {
      "lat": 19.0730,
      "lng": 72.8997
    },
    "photoUrl": "https://...",
    "assignedTo": "Staff Name",  // optional
    "createdAt": timestamp,
    "updatedAt": timestamp
  }
}
```

---

## 🚀 Deployment Guide

### Deploy Backend to Render (FREE)

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "CampusFix Initial"
git push origin main
```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Deploy Backend**
   - Click "New+" → "Web Service"
   - Connect GitHub repo
   - Name: `campusfix-server`
   - Runtime: Node
   - Build: `cd server && npm install`
   - Start: `cd server && npm start`
   - Add env vars:
     - `GEMINI_API_KEY`
     - `CLIENT_URL` = your frontend URL (later)
   - Create

4. **Get Render URL**
   - After deploy, copy the URL
   - Update `.env`: `VITE_API_URL=https://render_url`

### Deploy Frontend to Firebase (FREE)

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize**
```bash
firebase init hosting
# Select your project
# Public dir: dist
# Configure as SPA: yes
```

3. **Build & Deploy**
```bash
npm run build
firebase deploy --only hosting
```

4. **Get Firebase URL**
   - Go to https://console.firebase.google.com
   - Hosting → Copy URL
   - Add to Render backend env: `CLIENT_URL=https://firebase_url`
   - Redeploy on Render

---

## 🆘 Troubleshooting

### "Firebase is not initialized"
**Solution**: Check `.env` file has all Firebase keys with correct names (start with `VITE_`)

### "AI Classification failing (500 error)"
**Solution**: 
- Check `server/.env` has `GEMINI_API_KEY`
- Verify key is from https://makersuite.google.com (NOT Vertex AI)
- Restart backend server
- Check server terminal for detailed error

### "Can't sign in with Google"
**Solution**:
- Add `localhost` to Firebase authorized domains
- Clear browser cookies/cache
- Check browser console for specific error

### "Mapbox map not showing"
**Solution**:
- Verify `VITE_MAPBOX_TOKEN` in `.env`
- Check it's a public token (not secret)
- Clear browser cache
- Restart dev server

### "Image upload not working"
**Solution**:
- Verify Firebase Storage is enabled
- Check file size is under 5MB
- Check browser allows file access
- Check Firestore Storage rules

### "Very slow page load"
**Solution**:
- Production build uses optimizations: `npm run build`
- Check internet connection
- Check Firebase is responding
- Check Mapbox is loading

---

## 📚 Documentation Files

After updates, you have these docs:

- **SETUP_GUIDE.md** - Complete setup & deployment
- **UPDATE_SUMMARY.md** - What's new in this version
- **README.md** - Project overview
- **ARCHITECTURE.md** - Technical details
- **DEPLOYMENT.md** - Deployment checklist
- **QUICKSTART.md** - 5-minute start
- **START_HERE.md** - Entry point

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Firebase**: https://firebase.google.com/docs
- **Vite**: https://vitejs.dev
- **Mapbox**: https://docs.mapbox.com
- **Google Generative AI**: https://ai.google.dev

---

## ✅ Production Ready Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Firebase storage enabled
- [ ] Authentication providers enabled
- [ ] Firestore database created
- [ ] Cloud Functions optionally set up
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Firebase Hosting
- [ ] Admin account created
- [ ] Test all features
- [ ] Monitor analytics
- [ ] Check Firestore usage (free tier limits)

**Current Free Tier Capacity:**
- Firestore: 1GB storage, 50k reads/day
- Storage: 5GB total
- Auth: Unlimited users
- Hosting: 10GB bandwidth/month

---

## 🎉 You're All Set!

Your CampusFix AI application is now complete and ready to use. 

**Next Steps:**
1. ✅ Set up credentials (Firebase, Gemini, Mapbox)
2. ✅ Run locally with `npm run dev` and `cd server && npm start`
3. ✅ Test all features thoroughly
4. ✅ Deploy when ready
5. ✅ Share with your college

**Questions?** Check the error messages in browser console (F12) and server terminal for detailed information.

---

**Happy complaint tracking! 🚀**

*Last updated: December 25, 2025*
*Status: Production Ready ✅*
