# CampusFix AI - Quick Start Guide (5 Minutes)

## 🚀 Get Started in 5 Steps

### Step 1: Clone & Install (1 min)
```bash
# Clone the repository
git clone <your-repo-url>
cd CampusFix

# Install dependencies
npm install
cd server && npm install && cd ..
```

### Step 2: Get Your Keys (2 min)

Get these 3 keys from the services:

1. **Firebase Config** (from Firebase Console → Project Settings)
2. **Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))
3. **Mapbox Token** (from [Mapbox Dashboard](https://account.mapbox.com/tokens/))

### Step 3: Create .env Files (1 min)

**Root `.env`:**
```env
VITE_FIREBASE_API_KEY=YOUR_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc
VITE_GEMINI_API_KEY=YOUR_GEMINI_KEY
VITE_MAPBOX_TOKEN=pk.eyJ1...
VITE_API_URL=http://localhost:3000
```

**`server/.env`:**
```env
GEMINI_API_KEY=YOUR_GEMINI_KEY
PORT=3000
CLIENT_URL=http://localhost:5173
```

### Step 4: Run Locally (1 min)

**Terminal 1 - Backend:**
```bash
cd server
node index.js
# Should print: "Server running on port 3000"
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Should open http://localhost:5173
```

### Step 5: Test It Out (1 min)

1. Click "Sign in with Google"
2. Create a new complaint
3. Describe an issue and attach a photo
4. Click "Analyze with AI"
5. See the AI classification
6. Submit and view in "My Tickets"

---

## 📝 Testing Accounts

For development, use any Google account. To make yourself admin:
1. Log in once (creates user in Firestore)
2. Go to Firebase Console → Firestore → users collection
3. Edit your document and change `role` to `admin`
4. Refresh the app

---

## 🎯 Key URLs During Development

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Firebase Console:** https://console.firebase.google.com/
- **Google AI Studio:** https://aistudio.google.com/
- **Mapbox:** https://mapbox.com/

---

## 🚨 Common Issues

### Port already in use
```bash
# Find what's using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### Firebase keys not working
- Double-check `.env` file has no extra spaces
- Verify you're using the right project
- Make sure Google Sign-in is enabled

### Gemini API not working
- Verify API key is from Google AI Studio, not Google Cloud
- Check you have internet connection
- Try getting a new key

### Mapbox not showing
- Verify token starts with `pk.eyJ`
- Make sure it's a PUBLIC token
- Check `.env` has `VITE_` prefix

---

## 📱 Next: Deploy to Production

Once local testing works, follow `DEPLOYMENT.md` to deploy:
1. Push to GitHub
2. Deploy backend to Render
3. Build and deploy frontend to Firebase Hosting

---

## 📚 Full Documentation

- **Setup Details:** See `README.md`
- **Architecture:** See `ARCHITECTURE.md`
- **Deployment:** See `DEPLOYMENT.md`
- **Checklist:** See `COMPLETENESS_CHECKLIST.md`

---

**Happy coding! 🎉**
