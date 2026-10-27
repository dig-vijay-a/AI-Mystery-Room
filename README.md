# AI Mystery Room 🕵️‍♂️🔍

> **An interactive, AI-powered procedural murder mystery and detective web application built with Google Gemini, React (Vite), Tailwind CSS, Node.js, Express, and MongoDB.**

[![Specification](https://img.shields.io/badge/Architecture-SPEC.md-amber)](./SPEC.md)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)](https://ai.google.dev/)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Vite-10b981)]()

---

## 📖 Overview

**AI Mystery Room** places players in the shoes of a lead investigator tackling procedurally generated crime scenes. Using Google's Gemini generative AI model, every mystery is woven on demand with an airtight timeline, distinct suspects with authentic alibis and hidden motives, and a collection of forensic, documentary, and physical clues.

### Core Gameplay Mechanics
- **Dynamic Case Commissioning:** Choose custom crime premises or quick-pick curated templates (e.g., *Vintage Manor Poisoning*, *Silicon Valley Cyber Heist*, *Arctic Expedition Sabotage*).
- **Structured Difficulties:**
  - **Easy:** 3 Suspects, 5 Clues, 2 Hints (Base: 100 pts)
  - **Medium:** 4 Suspects, 7 Clues, 3 Hints (Base: 150 pts)
  - **Hard:** 5 Suspects, 9 Clues, 3 Hints (Base: 200 pts)
- **Zero-Spoiler Backend Security:** The true culprit, motive, and solution are strictly stripped from all network payloads until formal indictment.
- **Evidence Unsealing:** Inspect classified evidence bags to reveal forensic analysis (+5 pts each).
- **Tactical Hints Bureau:** Unlock strategic leads when stumped (-10 pts each).
- **Detective Scratchpad:** Persistent in-browser note-taking for alibi cross-examination.
- **Deterministic Scoring:** Server-validated scoring: $\max(0, \text{Base} + (\text{Clues} \times 5) - (\text{Hints} \times 10))$.

---

## 🏗️ Architecture & Project Structure

```
AI Mystery Room/
├── SPEC.md                    # Detailed specification & blueprint
├── README.md                  # Project documentation & run guide
├── .gitignore                 # Ignored dependencies & secrets
│
├── server/                    # Node.js + Express Backend
│   ├── .env                   # Environment variables (port, mongo, gemini)
│   ├── .env.example           # Example environment template
│   ├── package.json           # Backend dependencies (@google/genai, mongoose, zod)
│   └── src/
│       ├── index.js           # Server entrypoint with CORS & routes
│       ├── config/db.js       # MongoDB Mongoose connection
│       ├── models/Case.js     # Mongoose Case & Solution schema
│       ├── routes/cases.js    # REST API endpoints
│       ├── controllers/       # Case creation, clue discovery, accusation
│       ├── services/          # Gemini API + procedural engine fallback
│       ├── schemas/           # Zod runtime output validation
│       └── utils/scoring.js   # Scoring rules & difficulty matrix
│
└── client/                    # React 18+ Vite Frontend
    ├── .env                   # VITE_API_URL
    ├── package.json           # Frontend dependencies (lucide, axios, router)
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Detective noir dark theme configuration
    └── src/
        ├── App.jsx            # Routing and application layout
        ├── index.css          # Glassmorphism, Google fonts, scrollbars
        ├── services/api.js    # Axios client API service
        ├── components/        # Navbar, Footer, EvidenceCard, SuspectCard, HUD
        └── pages/             # Home, CreateCase, InvestigationRoom, Results, Archive
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ or v20+)
- **MongoDB** (Local MongoDB Community Server or MongoDB Atlas cluster)
- **Google Gemini API Key** (Get one at [Google AI Studio](https://aistudio.google.com/))

### 1. Backend Setup
```bash
cd server
npm install

# Configure your environment variables in server/.env
# PORT=5000
# MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
# GEMINI_API_KEY=your_gemini_api_key
# CLIENT_URL=http://localhost:5173

npm run dev    # Starts with nodemon on port 5000
# or
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install

# Start Vite dev server on port 5173
npm run dev
```

Open your browser at `http://localhost:5173` to start investigating!

---

## 🔒 Security & AI Verification

1. **Solution Privacy:** The MongoDB query uses `.select('-solution')` and custom projection during active cases. No client-side devtools or network inspection can reveal the killer prematurely.
2. **AI Schema Validation:** Gemini responses are validated at runtime with `Zod`. If Gemini is rate-limited or unconfigured, the built-in procedural engine seamlessly crafts mathematically consistent cases according to the difficulty matrix.

---

## 🌐 Deployment Guide

### Backend Deployment (Render / Railway / Fly.io)
1. Push repository to GitHub.
2. Create a new Web Service on Render / Railway pointing to `server/`.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Configure Environment Variables:
   - `PORT`: `5000` (or host provided)
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/ai_mystery_room`
   - `GEMINI_API_KEY`: Your Gemini API Key
   - `CLIENT_URL`: Your deployed frontend URL (e.g. `https://your-mystery-app.vercel.app`)

### Frontend Deployment (Vercel / Netlify)
1. In Vercel, import the repository and set the Root Directory to `client/`.
2. Framework Preset: `Vite`.
3. Environment Variables:
   - `VITE_API_URL`: `https://your-deployed-backend.onrender.com/api`
4. Deploy!

---

## 📜 Technical Specification
For the full blueprint, sequence diagrams, API request/response payloads, and acceptance criteria, refer to [`SPEC.md`](./SPEC.md).
