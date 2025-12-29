# EduSync - Your All-in-One Campus Ecosystem

EduSync is a unified platform designed to simplify campus life for university students. It integrates academic planning, resource management, social services, and campus amenities into one intuitive dashboard.

## 🎯 Features

### 📚 Notes.Co - Smart Study Management
- **PDF Upload & Organization**: Upload lecture notes and study materials with intelligent indexing
- **AI-Powered Q&A**: Chat with your notes using RAG (Retrieval-Augmented Generation) backed by Google Gemini
- **YouTube Integration**: Organize and access YouTube learning resources in one place
- **Personal Notes**: Create and sync handwritten digital notes

### 📅 Timetable Generator
- **AI-Generated Schedules**: Automatically create conflict-free weekly timetables based on:
  - Subject preferences (love/like/neutral/dislike/hate)
  - Importance levels (critical/important/moderate/low)
  - Minimum study hours per subject
- **One-Click Generation**: Get optimized schedules in seconds
- **Flexible Updates**: Regenerate as needed with different parameters

### ☕ J-Cafe - Campus Dining
- **Smart Ordering**: Browse menus and skip the queue with direct app ordering
- **Real-Time Cart**: Add items and track your order
- **Rewards System**: Earn points on every purchase
- **Student Combos**: Special discounted meal bundles

### 🏫 Campus Essentials
- **Library Search**: Real-time book availability and location tracking
- **Smart Printing**: Upload documents and print with B&W or color options
  - ₹5/page for B&W, ₹10/page for color
  - QR-based secure payments
  - Print queue management
- **Campus Marketplace**: Buy, sell, and trade textbooks and essentials

### 🚗 Car Buddy - Carpool Network
- **Ride Sharing**: Connect with students heading your direction
- **Live Map**: Visual placeholder for nearby destinations
- **Direct Messaging**: Chat with potential ride partners
- **Trip History**: Track your carpool activities

### 📢 Announcements
- **Real-Time Notifications**: Stay updated on:
  - Academic events and exams
  - Hackathons and competitions
  - Internship opportunities
  - Campus news
- **Smart Filtering**: Filter by type (Academic/Career/Events/Urgent)

### 🆘 Help & Support
- **Issue Reporting**: Report campus infrastructure problems with photo evidence
- **Status Tracking**: Monitor repair progress (Pending/In Progress/Resolved)
- **Quick Response**: Average 24-hour response time from maintenance crew

### 📋 My Shelf - Digital Library
- **PDF Resources**: Store and organize lecture PDFs
- **Video Gallery**: YouTube video collections by subject
- **Personal Notes**: Digital handwritten notes storage
- **Cloud Backup**: All resources backed up to Cloudinary

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Components**: Shadcn/ui + Custom components
- **Styling**: CSS with CSS Variables for theming
- **State Management**: React Hooks
- **Authentication**: Firebase Auth (Google Sign-In)

### Backend
- **API Framework**: Next.js API Routes
- **Database**: MongoDB (User data, listings, messages)
- **File Storage**: Cloudinary (PDFs, images, videos)
- **Authentication**: Firebase Admin SDK
- **LLM Integration**: Google Gemini API

### RAG Backend (LMS-RAG)
- **Framework**: FastAPI (Python)
- **Vector Database**: Qdrant Cloud
- **Embeddings**: Google Gemini (768-dimensional vectors)
- **LLM**: Groq Mixtral-8x7b
- **Document Processing**: LangChain

## 📁 Project Structure

```
EduSync/
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   ├── announcements/    # Announcements page
│   │   ├── buy-and-sell/     # Marketplace
│   │   ├── car-buddy/        # Carpool service
│   │   ├── dashboard/        # Main dashboard
│   │   ├── essentialServices/# Library & printing
│   │   ├── help/             # Support & reporting
│   │   ├── home/             # Landing page
│   │   ├── jcafe/            # Campus cafe
│   │   ├── notes/            # Notes.Co
│   │   ├── shelf/            # Digital library
│   │   ├── signup/           # Registration
│   │   ├── timetable/        # Schedule generator
│   │   └── layout.tsx        # Root layout
│   ├── components/           # Reusable React components
│   │   ├── ui/               # Shadcn components
│   │   ├── ChatBoxNotes.tsx  # RAG chat interface
│   │   ├── SideBar.tsx       # Main navigation
│   │   ├── TopBar.tsx        # Auth & header
│   │   └── ...
│   ├── lib/
│   │   ├── firebase.ts       # Firebase config
│   │   ├── firebaseAdmin.ts  # Admin SDK
│   │   ├── cloudinary.ts     # File storage
│   │   ├── dbConnect.ts      # MongoDB
│   │   └── utils.ts          # Helpers
│   ├── model/                # MongoDB schemas
│   │   ├── user.model.ts
│   │   ├── booking.model.ts
│   │   ├── Listing.ts
│   │   └── Message.ts
│   └── types/                # TypeScript types
├── LMS-RAG/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   └── readme.md            # RAG documentation
├── emails/                   # Email templates
├── public/                   # Static assets
└── .env                      # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+ (for RAG backend)
- MongoDB Atlas account
- Firebase project
- Cloudinary account
- Groq API key
- Google API key (Gemini)
- Qdrant Cloud account

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd EduSync
```

2. **Install Node.js dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Update `.env.local` with:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin
FIREBASE_ADMIN_SDK_KEY=your_admin_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# MongoDB
MONGODB_URI=your_mongodb_uri

# Google Gemini
GOOGLE_API_KEY=your_gemini_key

# RAG Service
NEXT_PUBLIC_NOTES_QUERY_URL=http://localhost:8000/query
NEXT_PUBLIC_NOTES_DELETE_URL=http://localhost:8000/reset
```

4. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### RAG Backend Setup

1. **Navigate to LMS-RAG**
```bash
cd LMS-RAG
```

2. **Create Python virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Create .env file**
```bash
cp .env.example .env
```

Add your API keys:
```env
GROQ_API_KEY=your_groq_key
GOOGLE_API_KEY=your_google_key
QDRANT_API_KEY=your_qdrant_key
```

5. **Start the RAG server**
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## 📚 Key Pages & Features

### Dashboard (`/dashboard`)
Central hub showing all services with quick access tiles:
- Notes.Co summary
- J-Cafe status
- Timetable view
- Campus Essentials
- Live announcements
- Campus Essentials

### Notes.Co (`/notes`)
- Upload PDFs for intelligent indexing
- Real-time preview
- Chat interface for RAG queries
- Powered by Google Gemini

### Timetable (`/timetable`)
1. Enter number of subjects
2. Specify preferences and importance levels
3. Set minimum hours per subject
4. Click "Generate Timetable"
5. View optimized 7-day schedule

### J-Cafe (`/jcafe`)
- Browse menu items by category
- Add to shopping tray
- View order history
- Collect rewards points

### Campus Essentials (`/essentialServices`)
- **Library**: Search and locate books
- **Printing**: Upload, queue, and pay for prints via QR code
- **Marketplace**: Buy and sell campus items

### My Shelf (`/shelf`)
Three tabs for organizing resources:
- **PDF Resources**: Lecture PDFs
- **YouTube Gallery**: Learning videos
- **Personal Notes**: Handwritten notes

## 🔌 API Endpoints

### Files API (`/api/files`)
```http
GET /api/files?type=pdf|notes
Headers: Authorization: Bearer {idToken}
```
Returns paginated list of user's files from Cloudinary.

### Videos API (`/api/videos`)
```http
GET /api/videos
POST /api/videos
DELETE /api/videos/{id}
```

### Upload API (`/api/upload`)
```http
POST /api/upload
Headers: Authorization: Bearer {idToken}
Body: FormData with file and type
```

### Timetable Generation (`/api/generate-timetable`)
```http
POST /api/generate-timetable
Content-Type: application/json
Body: {
  "subjects": [...],
  "totalHours": 40
}
```

### RAG Endpoints (`http://localhost:8000`)

**Query**
```http
POST /query
{
  "question": "What is...",
  "top_k": 4,
  "source_type": "pdf|web|null"
}
```

**Upload PDF**
```http
POST /load-pdf
Content-Type: multipart/form-data
file: <PDF file>
```

**Load URLs**
```http
POST /load-urls
{
  "urls": ["https://example.com"]
}
```

## 🔐 Authentication

- **Firebase Auth**: Google Sign-In for user authentication
- **ID Tokens**: Used to authenticate API requests
- **Role-Based Access**: AuthGuard component protects routes

## 💾 Database Schema

### User Model
```typescript
{
  uid: string (Firebase UID)
  email: string
  displayName: string
  photoURL: string
  createdAt: Date
  bookmarks: ObjectId[]
}
```

### Booking Model
```typescript
{
  user: ObjectId
  destination: {
    lat: number
    lng: number
    placeName: string
  }
  status: "open" | "contacted"
  timestamps
}
```

### Listing Model (Marketplace)
```typescript
{
  title: string
  description: string
  price: number
  category: string
  seller: ObjectId
  images: string[]
  timestamps
}
```

## 🎨 Styling

- **Color Scheme**: Golden accent (#d4a23a) with modern white/gray palette
- **Typography**: Clean, modern fonts
- **Responsive**: Mobile-first design approach
- **CSS Variables**: Defined in layout CSS files for easy theming

## 📊 State Management

- **React Hooks**: useState, useEffect, useContext
- **Firebase Auth State**: onAuthStateChanged listener
- **Toast Notifications**: react-toastify for user feedback

## 🔄 RAG System (Notes.Co)

The RAG (Retrieval-Augmented Generation) system powers intelligent Q&A:

1. **Document Ingestion**
   - PDFs uploaded to Qdrant vector database
   - Web URLs indexed for contextual learning

2. **Embedding Generation**
   - Google Gemini embeddings (768-dimensional)
   - Semantic similarity search

3. **Answer Generation**
   - Groq Mixtral LLM for fast inference
   - Context-aware responses
   - Source attribution

4. **Source Differentiation**
   - Separate tracking for PDF vs. web sources
   - Filtered queries by source type

## 🧪 Testing & Debugging

### Frontend Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Backend Testing
```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/files?type=pdf \
  -H "Authorization: Bearer {token}"
```

### RAG Testing
```bash
# Test RAG endpoints
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is..."}'
```

## 📦 Dependencies

### Key Frontend Libraries
- `next`: Framework
- `firebase`: Authentication & admin SDK
- `cloudinary`: File storage
- `lucide-react`: Icons
- `react-toastify`: Notifications
- `@radix-ui/react-*`: Headless UI primitives

### Key Backend Libraries
- `fastapi`: API framework
- `langchain`: LLM orchestration
- `qdrant-client`: Vector DB client
- `google-generativeai`: Gemini API
- `groq`: LLM inference

See [package.json](package.json) and [LMS-RAG/requirements.txt](LMS-RAG/requirements.txt) for complete dependencies.

## 🚨 Error Handling

- **Firebase Errors**: Caught and displayed via toast notifications
- **Upload Failures**: Validation and retry mechanisms
- **RAG Errors**: Graceful fallbacks with error messages
- **Network Issues**: Timeout handling and error states

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Peer tutoring marketplace
- [ ] Campus events calendar
- [ ] Grade tracker
- [ ] Study group finder
- [ ] Campus navigation maps
- [ ] Integration with university systems

## 📄 License

This project is private and owned by the EduSync team.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions, please reach out to the development team.

---

**EduSync** - Making campus life less chaotic, one feature at a time. 🎓
