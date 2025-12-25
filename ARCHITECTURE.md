# CampusFix AI - Architecture & Technical Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CAMPUSFIX AI SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

                            BROWSER
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                 LOGIN   STUDENT    ADMIN
                    │         │         │
        ┌───────────┴──────┬──┴──┬──────┴──────────┐
        │                  │     │                 │
        v                  v     v                 v
    Firebase Auth      New Ticket   Dashboard    Analytics
    (Google OAuth)     My Tickets    Map View     Heatmap
                       Map Preview   Filters      Trends

                          ▼▼▼ FIREBASE SERVICES ▼▼▼

    ┌──────────────────────────────────────────────────┐
    │        Firebase Web SDK (v12+, Modular)         │
    │  ┌────────────────┬──────────────┬────────────┐ │
    │  │ Authentication │  Firestore   │ Storage    │ │
    │  │  (Google Sign-in)  (Database) │ (Photos)   │ │
    │  └────────────────┴──────────────┴────────────┘ │
    │                       │                          │
    │              Firestore Collections:             │
    │         ┌─────────────────────────────┐        │
    │         │  /users/{uid}               │        │
    │         │  /tickets/{ticketId}        │        │
    │         └─────────────────────────────┘        │
    └──────────────────────────────────────────────────┘

                             ▼▼▼ BACKEND ▼▼▼

    ┌──────────────────────────────────────────────────┐
    │     Node.js Express Server (Render Free)        │
    │                                                  │
    │    POST /api/classify                           │
    │      ├─ Receives: description, photo (base64)   │
    │      ├─ Calls: Google Generative AI (Gemini)    │
    │      └─ Returns: {category, urgency, summary}   │
    │                                                  │
    │    Uses: @google/generative-ai SDK              │
    │    Model: gemini-3.0-flash (FREE TIER)          │
    └──────────────────────────────────────────────────┘

                      ┌────────────────────────┐
                      │  EXTERNAL SERVICES     │
                      ├────────────────────────┤
                      │ • Mapbox GL JS         │
                      │ • Google Generative AI │
                      │ • Firebase Hosting     │
                      └────────────────────────┘
```

## Data Model (Firestore Collections)

### Collection: `users/{uid}`
```javascript
{
  email: "student@somaiya.ac.in",
  displayName: "Atharv Sharma",
  role: "student", // or "admin"
  createdAt: Timestamp(2024-01-01),
  lastLogin: Timestamp(2024-01-15)
}
```

### Collection: `tickets/{ticketId}`
```javascript
{
  // Submission Info
  userId: "firebase-uid",
  userEmail: "student@somaiya.ac.in",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Description
  description: "Water leakage in 2nd floor washroom",
  photoUrl: "https://firebasestorage.googleapis.com/...",
  
  // Location
  building: "Main Building",
  floor: "2nd",
  location: {
    lat: 19.0730,
    lng: 72.8997
  },
  
  // AI Classification (from Gemini)
  category: "Water",           // Electrical, Water, Cleanliness, etc.
  urgency: 7,                  // 1-10 scale
  summary: "Washroom water leak",
  
  // Status Management
  status: "open",              // open, in_progress, resolved
  assignedTo: "Maintenance Staff",
  resolvedAt: Timestamp|null
}
```

## API Endpoints

### Backend Server

#### POST /api/classify
**Purpose:** AI classification of complaints

**Request:**
```json
{
  "description": "Water dripping from ceiling",
  "photo": "data:image/jpeg;base64,/9j/4AAQSk..."
}
```

**Response:**
```json
{
  "category": "Water",
  "urgency": 8,
  "summary": "Water leakage from ceiling"
}
```

**Error Response:**
```json
{
  "error": "Failed to classify ticket",
  "details": "..."
}
```

---

## Frontend Routes (React Router v7)

| Path | Component | Protected | Allowed Roles |
|------|-----------|-----------|---------------|
| `/login` | Login | No | All |
| `/` | RootRedirect | Yes | student, admin |
| `/student/new-ticket` | NewTicket | Yes | student, admin |
| `/student/my-tickets` | MyTickets | Yes | student, admin |
| `/admin/dashboard` | AdminDashboard | Yes | admin |
| `/admin/map` | AdminMap | Yes | admin |
| `/admin/analytics` | AdminAnalytics | Yes | admin |

---

## Technology Stack

### Frontend
- **React** 19.2.0 - UI framework
- **Vite** 7.2.4 - Build tool
- **React Router DOM** 7.11.0 - Client-side routing
- **Firebase SDK** 12.7.0 (modular) - Auth, Firestore, Storage
- **Mapbox GL JS** 3.17.0 - Maps and heatmaps
- **Lucide React** 0.562.0 - Icons
- **date-fns** 4.1.0 - Date utilities

### Backend
- **Node.js** - Runtime
- **Express** 5.2.1 - Web framework
- **@google/generative-ai** 0.24.1 - Gemini API client
- **cors** 2.8.5 - Cross-origin support
- **dotenv** 17.2.3 - Environment variables
- **multer** 2.0.2 - File upload handling

### Services (Cloud)
- **Firebase Authentication** - Google Sign-in
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - Image/file storage
- **Firebase Hosting** - Static SPA hosting
- **Render** - Backend hosting (free)
- **Google Generative AI** - Gemini API (free)
- **Mapbox** - Maps service (free public token)

---

## Security Architecture

### Authentication Flow
```
1. User clicks "Sign in with Google"
2. Firebase Auth shows Google OAuth dialog
3. User authorizes
4. Firebase creates/updates user doc in Firestore
5. Frontend receives auth token
6. All API calls include Firebase token
7. Firestore Security Rules validate requests
```

### Firestore Security Rules
```
✓ Students: Read/write only own tickets
✓ Admins: Read all tickets, update all tickets
✓ No one can delete tickets
✓ Privilege escalation prevented (can't change own role)
✓ Timestamp validation (only serverTimestamp accepted)
```

### Data Protection
- ✅ All data encrypted at rest (Firebase default)
- ✅ All communications use HTTPS/TLS
- ✅ API keys stored in backend environment (never in frontend)
- ✅ Sensitive keys in `.env` files (not in version control)
- ✅ Firebase provides DDoS protection

---

## AI Classification Pipeline

### Workflow
```
1. User submits complaint with optional photo
2. Frontend calls backend /api/classify endpoint
3. Backend receives description + base64 photo
4. Backend calls Google Generative AI (Gemini)
5. Prompt: "Classify this complaint, return JSON only"
6. Gemini returns: { category, urgency (1-10), summary }
7. Frontend receives classification
8. User reviews and submits full ticket to Firestore
9. Firestore stores ticket with AI-generated fields
```

### Categories
- Electrical
- Water
- Cleanliness
- Infrastructure
- Safety
- Hostel
- Academic
- Other

### Urgency Scoring
- **1-3** Low (non-emergency)
- **4-6** Medium (should be addressed soon)
- **7-10** High (critical/safety issues)

---

## Mapbox Integration

### Features
1. **Student Map (NewTicket)**
   - Centered on Somaiya campus (19.0730°N, 72.8997°E)
   - Click to add marker
   - Stores lat/lng with ticket

2. **Admin Map (AdminMap)**
   - All tickets displayed as markers
   - Marker colors by status:
     - Red: Open
     - Orange: In Progress
     - Green: Resolved
   - Heatmap layer with urgency as weight
   - Click markers for popup info
   - Dark theme for visibility

3. **Heatmap Visualization**
   - Weight = Urgency score (1-10)
   - Color gradient: Blue (low) → Red (high)
   - Updates in real-time as new tickets arrive

---

## Performance & Limits

### Free Tier Quotas (Daily)
| Service | Limit | Expected Usage |
|---------|-------|-----------------|
| Firestore reads | 50,000 | ~100-200 |
| Firestore writes | 20,000 | ~10-50 |
| Storage bandwidth | 1 GB | ~10-100 MB |
| Gemini API | 15 req/min | ~1-10 per minute |
| Firebase Hosting | 10 GB/month | ~100 MB |

### Optimizations
- Firestore indexes for common queries
- Real-time listeners (avoid polling)
- Lazy loading of images
- CDN caching on Firebase Hosting
- Batch operations where possible

---

## Deployment Pipeline

```
LOCAL DEVELOPMENT
  ↓
  git push origin main
  ↓
┌─────────────────────────────────────────┐
│       GITHUB REPOSITORY                 │
└─────────────────────────────────────────┘
  ↓                            ↓
RENDER (Backend)         Firebase Hosting
  (Auto-deploy)          (Manual or CI/CD)
  ↓                            ↓
Production API           Production Frontend
```

---

## Future Enhancement Ideas

### Phase 2
- [ ] Email notifications on ticket updates
- [ ] Ticket comments/discussion thread
- [ ] Photo gallery per ticket
- [ ] Bulk ticket export
- [ ] Admin reports generation
- [ ] SMS notifications

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Voice complaint submission
- [ ] AR location pinning
- [ ] Real-time notifications
- [ ] Integration with campus ERP

### Phase 4
- [ ] Predictive maintenance (ML)
- [ ] Historical trend analysis
- [ ] Integration with maintenance systems
- [ ] Mobile-responsive dashboard
- [ ] Multi-language support

---

## Common Issues & Solutions

### Issue: "CORS error"
**Solution:** Check `CLIENT_URL` in backend matches frontend URL

### Issue: "Gemini API not responding"
**Solution:** Verify API key in backend `.env`, check quota

### Issue: "Mapbox not loading"
**Solution:** Verify `VITE_MAPBOX_TOKEN` is valid public token

### Issue: "Firebase auth not working"
**Solution:** Check Firebase config in `.env`, verify Google provider enabled

### Issue: "Photos not uploading"
**Solution:** Check Firebase Storage rules, verify storage bucket in .env

---

## Contributing

When adding new features:
1. Maintain free-tier compliance
2. Test in local environment first
3. Update relevant docs
4. Keep security rules up-to-date
5. Test on Spark plan before merging

---

**Last Updated:** December 2024
**Version:** 1.0.0
