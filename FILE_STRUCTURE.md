# CampusFix AI - Complete File Structure Guide

```
CampusFix/
│
├── 📄 README.md                    # Main setup & usage guide
├── 📄 QUICKSTART.md               # 5-minute quick start
├── 📄 DEPLOYMENT.md               # Production deployment guide
├── 📄 ARCHITECTURE.md             # Technical architecture
├── 📄 COMPLETENESS_CHECKLIST.md   # Feature verification
├── 📄 IMPLEMENTATION_SUMMARY.md   # This project summary
│
├── 📄 package.json                # Frontend dependencies & scripts
├── 📄 vite.config.js              # Vite build configuration
├── 📄 eslint.config.js            # ESLint configuration
├── 📄 index.html                  # HTML entry point
├── 📄 firebase.json               # Firebase Hosting config
├── 📄 firestore.rules             # Firestore security rules
│
├── 📄 .env.example                # Frontend env template
├── 📄 .gitignore                  # Git ignore rules
│
├── 📁 src/
│   ├── 📄 main.jsx               # React entry point
│   ├── 📄 App.jsx                # Main App component with routing
│   ├── 📄 App.css                # Application styles
│   ├── 📄 index.css              # Global styles
│   │
│   ├── 📁 config/
│   │   └── 📄 firebase.js        # Firebase initialization & config
│   │
│   ├── 📁 context/
│   │   └── 📄 AuthContext.jsx    # Auth state management & user role
│   │
│   ├── 📁 components/
│   │   └── 📄 Navbar.jsx         # Navigation bar (role-based links)
│   │
│   ├── 📁 services/
│   │   └── 📄 api.js             # API service for backend calls
│   │
│   ├── 📁 pages/
│   │   ├── 📄 Login.jsx          # Google Sign-in page
│   │   │
│   │   ├── 📁 Student/
│   │   │   ├── 📄 NewTicket.jsx  # Create complaint (with AI analysis)
│   │   │   └── 📄 MyTickets.jsx  # View personal tickets
│   │   │
│   │   └── 📁 Admin/
│   │       ├── 📄 Dashboard.jsx  # All tickets table (filterable)
│   │       ├── 📄 Map.jsx        # Mapbox with heatmap
│   │       └── 📄 Analytics.jsx  # Metrics & charts
│   │
│   ├── 📁 assets/
│   │   └── [static assets]
│   │
│   └── 📁 public/
│       └── [public files]
│
├── 📁 server/
│   ├── 📄 index.js               # Express server + Gemini AI endpoint
│   ├── 📄 package.json           # Backend dependencies
│   └── 📄 .env.example           # Backend env template
│
└── 📁 node_modules/              # (generated after npm install)

```

---

## 📋 File-by-File Breakdown

### Root Level Files

| File | Purpose |
|------|---------|
| `README.md` | Complete setup guide with Firebase, Gemini, Mapbox instructions |
| `QUICKSTART.md` | Fast 5-minute setup for impatient developers |
| `DEPLOYMENT.md` | Step-by-step production deployment checklist |
| `ARCHITECTURE.md` | Technical architecture, data models, API specs |
| `COMPLETENESS_CHECKLIST.md` | Verify all features are implemented |
| `IMPLEMENTATION_SUMMARY.md` | High-level project summary |
| `package.json` | Frontend npm dependencies & scripts |
| `vite.config.js` | Vite build tool configuration |
| `eslint.config.js` | Code linting rules |
| `index.html` | HTML skeleton for React app |
| `firebase.json` | Firebase Hosting configuration |
| `firestore.rules` | Firestore database security rules |
| `.env.example` | Template for frontend environment variables |
| `.gitignore` | Files to exclude from git |

---

### Source Code (`src/`)

#### Entry Points
- `main.jsx` - ReactDOM render entry point
- `App.jsx` - Main App component with routing
- `App.css` - Application-wide styles
- `index.css` - Global CSS variables and styles

#### Configuration (`src/config/`)
- `firebase.js` - Firebase SDK initialization and export of services

#### State Management (`src/context/`)
- `AuthContext.jsx` - Authentication context providing:
  - `currentUser` - Firebase auth user
  - `userRole` - "student" or "admin"
  - `login()` - Google OAuth login
  - `logout()` - Sign out

#### Components (`src/components/`)
- `Navbar.jsx` - Navigation bar with role-based routing links

#### Services (`src/services/`)
- `api.js` - Backend API calls (classifyTicket function)

#### Pages (`src/pages/`)

**Login.jsx**
- Google Sign-in page
- Redirects to app if already logged in

**Student Pages (`Student/`)**
- `NewTicket.jsx`
  - Complaint form
  - Photo upload
  - Mapbox location picker
  - AI analysis button
  - Ticket submission
  
- `MyTickets.jsx`
  - Grid view of personal tickets
  - Status badges
  - Real-time updates

**Admin Pages (`Admin/`)**
- `Dashboard.jsx`
  - Table view of all tickets
  - Filters: status, category, urgency
  - Status update dropdown
  - Staff assignment field
  
- `Map.jsx`
  - Mapbox displaying all tickets
  - Heatmap layer (urgency-weighted)
  - Marker popups
  - Legend
  
- `Analytics.jsx`
  - Stat cards (total, open, in progress, resolved)
  - Status breakdown bar chart
  - Category breakdown list
  - Urgency distribution histogram
  - Summary metrics

---

### Server (`server/`)

| File | Purpose |
|------|---------|
| `index.js` | Express server + POST /api/classify endpoint for Gemini API |
| `package.json` | Backend npm dependencies |
| `.env.example` | Template for backend environment variables |

**Server Flow:**
1. Client sends POST to `/api/classify` with description + photo
2. Server receives request with body containing description & base64 photo
3. Server initializes Gemini model with API key
4. Server sends prompt + photo to Gemini API
5. Gemini returns JSON with category, urgency, summary
6. Server parses response and sends back to client

---

## 🔄 Request/Response Flow

### Creating a Ticket

```
User fills form (description, photo, location)
         ↓
User clicks "Analyze with AI"
         ↓
Frontend calls POST /api/classify (backend)
         ↓
Backend calls Google Generative AI (Gemini 3.0 Flash)
         ↓
Gemini returns: {category, urgency, summary}
         ↓
Frontend displays AI results
         ↓
User reviews and clicks "Submit Complaint"
         ↓
Frontend uploads photo to Firebase Storage
         ↓
Frontend creates document in Firestore /tickets collection
         ↓
Ticket appears in "My Tickets" (real-time)
         ↓
Admins see it in Dashboard immediately
```

---

## 🔐 Data Flow with Security

```
Student Request
     ↓
Firebase Auth Token Validation
     ↓
Request to Firestore
     ↓
Firestore Security Rules Check:
  ✓ Is user authenticated?
  ✓ Does user have permission?
  ✓ Is data valid?
     ↓
If all checks pass → Data returned
If any check fails → Access denied
```

---

## 📊 Component Tree

```
App
├── Router
│   ├── Route: /login
│   │   └── Login (public)
│   │
│   ├── Route: /student/*
│   │   ├── ProtectedRoute (student|admin)
│   │   ├── Navbar
│   │   ├── Route: /new-ticket → NewTicket
│   │   └── Route: /my-tickets → MyTickets
│   │
│   ├── Route: /admin/*
│   │   ├── ProtectedRoute (admin only)
│   │   ├── Navbar
│   │   ├── Route: /dashboard → Dashboard
│   │   ├── Route: /map → Map
│   │   └── Route: /analytics → Analytics
│   │
│   └── Route: / → RootRedirect (role-based)
```

---

## 🗄️ Database Collections

### `users/{uid}`
```
{
  email: string,
  displayName: string,
  role: "student" | "admin",
  createdAt: Timestamp
}
```

### `tickets/{ticketId}`
```
{
  userId: string,
  userEmail: string,
  description: string,
  photoUrl: string | null,
  building: string,
  floor: string,
  location: {lat: number, lng: number} | null,
  category: string,
  urgency: number,
  summary: string,
  status: "open" | "in_progress" | "resolved",
  assignedTo: string | null,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  resolvedAt: Timestamp | null
}
```

---

## 📦 Dependencies

### Frontend (`package.json`)
- `react` - UI framework
- `react-dom` - React renderer
- `react-router-dom` - Routing
- `firebase` - Cloud services
- `mapbox-gl` - Maps library
- `lucide-react` - Icons
- `date-fns` - Date utilities
- `vite` - Build tool

### Backend (`server/package.json`)
- `express` - Web framework
- `@google/generative-ai` - Gemini API client
- `cors` - CORS middleware
- `multer` - File upload handling
- `dotenv` - Environment variables

---

## 🔑 Environment Variables

### Frontend (`.env`)
```
VITE_FIREBASE_API_KEY          # Firebase API key
VITE_FIREBASE_AUTH_DOMAIN      # Firebase auth domain
VITE_FIREBASE_PROJECT_ID       # Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET   # Firebase storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID  # Firebase sender ID
VITE_FIREBASE_APP_ID           # Firebase app ID
VITE_GEMINI_API_KEY            # Gemini API key
VITE_MAPBOX_TOKEN              # Mapbox access token
VITE_API_URL                   # Backend server URL
```

### Backend (`server/.env`)
```
GEMINI_API_KEY                 # Gemini API key
PORT                           # Server port (default 3000)
CLIENT_URL                     # Frontend URL (for CORS)
```

---

## 🚀 Running Commands

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd server
npm install          # Install dependencies
node index.js        # Start server (requires .env)
```

### Firebase Hosting
```bash
firebase init        # Initialize Firebase project
firebase deploy      # Deploy to Firebase Hosting
firebase logs        # View deployment logs
```

---

## 📍 Key File Relationships

```
App.jsx
  ├── uses → AuthContext (user state)
  ├── uses → Navbar (in each page)
  ├── renders → Login (public route)
  ├── renders → Student pages
  │   ├── NewTicket
  │   │   ├── uses → api.classifyTicket()
  │   │   ├── uses → firebase (addDoc, uploadString)
  │   │   └── uses → mapboxgl
  │   └── MyTickets
  │       └── uses → firebase (onSnapshot)
  └── renders → Admin pages
      ├── Dashboard
      │   └── uses → firebase (updateDoc)
      ├── Map
      │   ├── uses → mapboxgl
      │   └── uses → firebase (onSnapshot)
      └── Analytics
          └── uses → firebase (onSnapshot)
```

---

## ✅ File Checklist

- ✅ All React components created
- ✅ All pages implemented
- ✅ Backend API server ready
- ✅ Firebase configuration file
- ✅ Environment templates
- ✅ Security rules defined
- ✅ CSS styling complete
- ✅ Documentation complete
- ✅ No missing files
- ✅ No syntax errors

---

**Total Files:** 30+
**Total Lines of Code:** ~3000+
**Documentation Pages:** 6
**Status:** ✅ Complete & Ready to Deploy

