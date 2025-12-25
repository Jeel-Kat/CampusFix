# CampusFix AI - Campus Complaint Management System

A full-stack campus complaint management system for KJ Somaiya College of Engineering. Built ensuring **STRICT free-tier usage** with:

- ✅ **Firebase Spark Plan** (free Auth, Firestore, Storage, Hosting)
- ✅ **Google Gemini 3.0 Flash** via Google AI Studio (no billing required)
- ✅ **Mapbox GL JS** for campus mapping and heatmaps
- ✅ **Zero credit card required**

## 📋 Features

### Student Features
- 🔐 Google Sign-in via Firebase Auth
- ➕ Create complaint tickets with description and optional photo
- 📍 Pin location on Mapbox campus map
- 🤖 AI-powered automatic classification (category, urgency, summary)
- 📌 View all their tickets with status tracking
- 🏢 Select building and floor for each complaint

### Admin Features
- 📊 Dashboard with all tickets (filterable by status, category, urgency)
- 🗺️ Interactive Mapbox map with:
  - Ticket markers with status-based colors
  - Heatmap layer showing urgency hotspots
  - Popup info on marker click
- 📈 Analytics page with:
  - Tickets by status breakdown
  - Tickets by category distribution
  - Urgency score histogram
  - Average resolution time
  - Resolution rate metrics
- 🔧 Update ticket status (open → in_progress → resolved)
- 👤 Assign tickets to staff members

---

## 🚀 Setup Guide

### Prerequisites
- **Node.js** v18+
- **Git** (for version control)
- **Google Account** (for Firebase & Gemini)
- **Mapbox Account** (for maps)

---

### Step 1: Firebase Setup (Spark Plan - FREE)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
   - Project name: `CampusFixAI`
   - ✅ Disable Google Analytics (not needed)
3. **Enable Firebase Authentication**
   - Navigate to **Authentication** → **Sign-in method**
   - Click **Google** and enable it
   - Set **Support email** to your email
4. **Create Firestore Database**
   - Go to **Firestore Database** → **Create Database**
   - **Location**: `nam5` (us-central) or nearest to you (free tier eligible)
   - **Security rules**: Start in **Production Mode** (we'll update rules later)
5. **Enable Cloud Storage**
   - Go to **Storage** → **Get Started**
   - Location: Same as Firestore
   - Security rules: Start in **Production Mode**
6. **Copy Firebase Config**
   - Go to **Project Settings** (gear icon) → **General**
   - Scroll to **Your apps** section
   - Click the `</>` (Web) icon
   - Copy the entire config object
   - Save for `.env` setup

---

### Step 2: Gemini API Setup (FREE - NO BILLING)

⚠️ **IMPORTANT**: Use **Google AI Studio**, NOT Vertex AI (which requires billing)

1. Go to [Google AI Studio](https://aistudio.google.com/) (NOT Google Cloud)
2. Click **"Get API Key"**
3. Click **"Create API key in new Google Cloud project"**
4. Copy the API key displayed
5. ✅ **DO NOT** enable billing or attach credit card
6. Save the key for `.env` setup

---

### Step 3: Mapbox Setup (FREE PUBLIC TOKEN)

1. Go to [Mapbox](https://www.mapbox.com/) → Sign up/Log in
2. Go to **Account** → **Tokens**
3. Use the default **"Default public token"** (already created)
4. If not visible, create a new **Public token** with scopes: `maps:read`, `styles:read`
5. Copy the token (starts with `pk.eyJ...`)

---

### Step 4: Backend Server Setup (Render - FREE)

#### Option A: Deploy to Render (Recommended)
1. Push this repository to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/) → Sign up/Log in
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repo
5. Fill in:
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node index.js`
   - **Instance Type**: Free
6. Under **Environment**:
   - Add `GEMINI_API_KEY`: Paste your key from Step 2
   - Add `PORT`: `10000`
   - Add `CLIENT_URL`: Will update after frontend deploy
7. Click **"Create Web Service"**
8. Wait for deployment (save the URL, e.g., `https://campusfix-api.onrender.com`)

#### Option B: Run Locally (for development)
See "Local Development" section below.

---

### Step 5: Frontend Setup & Deployment

#### 1. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Firebase (from Step 1)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=campusfixai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=campusfixai
VITE_FIREBASE_STORAGE_BUCKET=campusfixai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Gemini (from Step 2)
VITE_GEMINI_API_KEY=AIzaSy...

# Mapbox (from Step 3)
VITE_MAPBOX_TOKEN=pk.eyJ1...

# Backend URL (from Step 4)
VITE_API_URL=https://campusfix-api.onrender.com
# For local dev, use: http://localhost:3000
```

#### 2. Install Dependencies & Build
```bash
npm install
npm run build
```

#### 3. Deploy to Firebase Hosting

Install Firebase CLI:
```bash
npm install -g firebase-tools
```

Login & Initialize:
```bash
firebase login
firebase init hosting
```

When prompted:
- **Project**: Select `CampusFixAI`
- **Public directory**: `dist`
- **Single-page app**: Yes
- **Automatic builds**: No (for now)

Deploy:
```bash
firebase deploy --only hosting
```

Your app is live! 🚀

---

#### 4. Update Firestore Security Rules

Go to [Firebase Console](https://console.firebase.google.com/) → **Firestore Database** → **Rules**

Replace with the contents of `firestore.rules` from this repo. This ensures:
- Students can only create/read their own tickets
- Admins can read/update all tickets
- No privilege escalation

---

### Step 6: (Optional) Make Admin User

By default, all users are students. To make yourself admin:

1. After logging in once, go to Firebase Console
2. **Firestore Database** → **Collections** → **users**
3. Find your user document (UID matches)
4. Edit the `role` field from `student` to `admin`
5. Refresh the app - you'll now see admin features

---

## 💻 Local Development

### Setup
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Create Local .env Files

**Root `.env`:**
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=campusfixai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=campusfixai
VITE_FIREBASE_STORAGE_BUCKET=campusfixai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_GEMINI_API_KEY=AIzaSy...
VITE_MAPBOX_TOKEN=pk.eyJ1...
VITE_API_URL=http://localhost:3000
```

**`server/.env`:**
```env
GEMINI_API_KEY=AIzaSy...
PORT=3000
CLIENT_URL=http://localhost:5173
```

### Run Locally

Terminal 1 - Backend:
```bash
cd server
node index.js
# Should print: "Server running on port 3000"
```

Terminal 2 - Frontend:
```bash
npm run dev
# Should open http://localhost:5173
```

---

## 📱 Usage Guide

### Student Workflow
1. Log in with Google
2. Click **"New Ticket"**
3. Describe the issue
4. (Optional) Attach photo
5. (Optional) Click map to pin location
6. Click **"Analyze with AI"** → AI classifies it
7. Click **"Submit Complaint"**
8. View ticket in **"My Tickets"** page

### Admin Workflow
1. Log in with Google (ensure your user is set as admin in Firestore)
2. View **"Dashboard"** → See all tickets
   - Filter by status, category, urgency
   - Update ticket status
   - Assign to staff
3. View **"Map & Heatmap"** → See geographical distribution
4. View **"Analytics"** → See metrics and trends

---

## 🔒 Security Notes

- ✅ Firestore rules enforce student/admin access control
- ✅ Google Sign-in prevents unauthorized access
- ✅ Photos stored in Firebase Storage with secure URLs
- ✅ No API keys exposed in frontend code (via Vite env variables)
- ⚠️ Render backend handles Gemini API key (backend-only)

---

## 🆓 Free Tier Limits (Should not exceed)

| Service | Free Tier Limit | Our Usage |
|---------|-----------------|-----------|
| **Firebase Auth** | 50k signups/month | ✅ Low |
| **Firestore** | 50k reads, 20k writes, 20k deletes/day | ✅ Low |
| **Cloud Storage** | 5GB storage, 1GB/day download | ✅ Low |
| **Firebase Hosting** | 10GB/month bandwidth | ✅ Low |
| **Gemini API** | 15 requests/minute free | ✅ Easily covered |

---

## 📂 Project Structure

```
CampusFix/
├── src/
│   ├── App.jsx                 # Main routing
│   ├── main.jsx               # Entry point
│   ├── index.css              # Global styles
│   ├── App.css                # App-specific styles
│   ├── components/
│   │   └── Navbar.jsx         # Navigation bar
│   ├── config/
│   │   └── firebase.js        # Firebase initialization
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state & user role
│   ├── pages/
│   │   ├── Login.jsx          # Google Sign-in page
│   │   ├── Student/
│   │   │   ├── NewTicket.jsx  # Create complaint
│   │   │   └── MyTickets.jsx  # View own tickets
│   │   └── Admin/
│   │       ├── Dashboard.jsx  # All tickets table
│   │       ├── Map.jsx        # Map + heatmap
│   │       └── Analytics.jsx  # Metrics & charts
│   ├── services/
│   │   └── api.js             # API calls to backend
│   └── assets/                # Static assets
├── server/
│   ├── index.js               # Express server + Gemini AI
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Backend env template
├── vite.config.js             # Vite configuration
├── package.json               # Frontend dependencies
├── .env.example               # Frontend env template
├── firestore.rules            # Security rules
└── README.md                  # This file
```

---

## 🔧 Troubleshooting

### Backend can't connect to Gemini
- Check `GEMINI_API_KEY` is valid
- Ensure no Google Cloud Billing is enabled
- Try getting a new key from [Google AI Studio](https://aistudio.google.com/)

### Mapbox token not working
- Verify token starts with `pk.eyJ`
- Check public token is enabled
- Create new token if needed

### Firebase auth not working
- Ensure Google provider is enabled in Firebase Console
- Check Firebase config is correct in `.env`
- Try logging out and back in

### CORS errors on API calls
- Ensure backend `CLIENT_URL` env var matches frontend URL
- Check both frontend & backend are running
- Verify `VITE_API_URL` points to correct backend

---

## 📧 Support

For issues:
1. Check troubleshooting above
2. Review `.env` files for typos
3. Check browser console for errors
4. Check backend logs for API errors

---

## 📄 License

MIT License - Feel free to use for your college

---

**Built with ❤️ for KJ Somaiya College of Engineering**
1.  Install tools: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Init: `firebase init hosting`
    -   "Use an existing project" -> Select `CampusFixAI`
    -   "What do you want to use as your public directory?": `dist`
    -   "Configure as a single-page app (rewrite all urls to /index.html)?": `Yes`
    -   "Set up automatic builds and deploys with GitHub?": `No` (for now)
4.  Build & Deploy:
    ```bash
    npm run build
    firebase deploy --only hosting
    ```
