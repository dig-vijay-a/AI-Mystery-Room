# AI Mystery Room — Technical Specification Document (SPEC.md)

**Version:** 1.0.0  
**Status:** Approved Blueprint  
**System Name:** AI Mystery Room (Gemini-Powered Detective & Mystery Experience)  
**Target Environment:** Node.js (v20+), React 18+ (Vite), MongoDB Atlas / Local MongoDB, Google Gemini API

---

## 1. Project Overview & Problem Statement

### 1.1 Overview
**AI Mystery Room** is an interactive, AI-driven detective web application where players step into the shoes of a lead investigator. Using Google's Gemini generative AI model, the application dynamically generates immersive, logically cohesive murder mystery and crime scenarios on-the-fly based on player-selected premises, themes, and difficulty levels.

Players explore crime scenes, examine suspect dossiers and interrogation alibis, uncover hidden forensic and circumstantial clues, request tactical hints, and piece together the narrative before submitting a formal accusation. 

### 1.2 Problem Statement
Traditional murder-mystery games and escape-room apps suffer from:
1. **Static Replayability:** Once a mystery is solved, the puzzle is spoiled forever.
2. **Predictable Logic & Scripting:** Hand-crafted storylines are expensive to produce and limited in volume.
3. **Premature Solution Leaks:** Client-heavy web implementations often expose the culprit or answers in network payloads or bundle state.

AI Mystery Room solves these problems by:
- Generating unlimited procedural mysteries with high dramatic tension using the Gemini API.
- Strictly enforcing backend-controlled access to the true culprit and solution until the player makes their final accusation.
- Offering structured difficulty tiers (Easy, Medium, Hard) that balance clue-to-suspect ratios and scoring mechanics.

### 1.3 Target Users & Expected User Experience
- **Target Audience:** Mystery enthusiasts, puzzle and escape-room fans, casual gamers, and developers interested in applied Generative AI.
- **Experience Goals:**
  - **Atmospheric & Immersive:** Noir / modern detective theme featuring dark glassmorphism, sleek glowing accents, crime-board connections, and audio-visual tactile feedback.
  - **Intuitive & Responsive:** Seamless mystery creation within 5–10 seconds, clear clue discovery mechanics, and real-time score tracking.
  - **Fair & Logical:** Every mystery is generated with a coherent timeline where the culprit has opportunity, motive, and a forensic loophole exposed strictly through the clues.

### 1.4 Core Features & Optional Enhancements

#### Core Features (MVP)
- **Dynamic Mystery Generation:** Users input custom premises (or pick curated starter prompts) with 3 difficulty levels (Easy, Medium, Hard).
- **Secure Backend State:** Solution and culprit details remain encrypted or omitted from client responses during the investigation phase.
- **Interactive Dossiers & Clue Board:** Suspect profiles with portraits, occupations, alibis, and motives; interactive clues that can be unlocked/inspected.
- **Progressive Hint System:** Contextual hints that deduct points when revealed.
- **Accusation & Verdict Engine:** Accuse a suspect with optional deduction notes; backend verifies the accusation, calculates final scores, and unmasks the culprit with a full confession breakdown.
- **Case Archive & Replay:** View past cases, review previous deductions, or start a new case immediately.

#### Optional / Future Enhancements
- Mock Gemini Generator fallback for offline testing or rate-limited environments.
- AI Suspect Interrogation (chat directly with suspects powered by Gemini).
- Ambient soundscapes (rain on window, noir jazz, suspense strings).
- Social shareable detective badges (e.g., "Sherlock Grade: S-Rank Mastermind").

### 1.5 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 / 19 + Vite | High-performance reactive UI with fast HMR |
| **Styling & Icons** | Tailwind CSS + Lucide React | Modern dark noir detective theme, responsive layouts |
| **Routing & Client State** | React Router v6, Axios | Single-page navigation and API communication |
| **Backend Runtime** | Node.js + Express.js | REST API server, validation, and AI orchestration |
| **Database & ODM** | MongoDB + Mongoose | Persistence for cases, clue discovery states, and scores |
| **AI Generation Engine** | `@google/genai` (Gemini API) | Structured JSON generation for airtight mystery narratives |
| **Data Validation** | Zod | Runtime schema validation for AI payloads and API inputs |
| **Environment & Tooling** | Dotenv, Nodemon, Git | Configuration management and development lifecycle |

### 1.6 Limitations & Deliverables
- **AI Rate Limits:** Graceful handling of Gemini API quotas, rate limits, and schema recovery via Zod fallback parsing.
- **Single Culprit Rule:** Standard cases have exactly one primary culprit to maintain deterministic scoring.
- **Deliverables:**
  1. Complete specification documentation (`SPEC.md`).
  2. Full-stack repository containing `client/` and `server/`.
  3. Deployed frontend and backend with operational Gemini integration.
  4. Verified test suite ensuring security and scoring compliance.

---

## 2. User Flow & Journey

The user experience follows a 7-stage state machine:

```mermaid
flowchart TD
    A[1. Home Page] -->|Click 'Start Investigation'| B[2. Create Mystery Page]
    B -->|Select Premise & Difficulty| C[Gemini AI Case Generation]
    C -->|Generate Structured JSON| D[Save Case to DB (Hide Culprit)]
    D -->|Redirect to /case/:id| E[3. Investigation Room]
    E -->|Click to Examine| F[Discover Clue (+5 pts each)]
    E -->|Request Hint| G[Reveal Hint (-10 pts each)]
    E -->|Ready to Accuse| H[4. Accusation Modal / Page]
    H -->|Select Suspect & Submit| I[Backend Evaluation & Scoring]
    I -->|Calculate Score & Unlock Solution| J[5. Results & Verdict Page]
    J -->|Review Case Breakdown| K[Case Debrief & Timeline]
    K -->|Start New Case| B
```

### Detailed Flow Steps:
1. **Landing (`/`):**
   - User lands on the atmospheric detective bureau dashboard.
   - Learns game rules, scoring multipliers, and case guidelines.
   - Clicks **"Begin Investigation"**.
2. **Case Creation (`/create`):**
   - User types a custom premise (e.g. *"A billionaire tech CEO found lifeless inside a locked server room"*) or picks one from a randomized set of curated noir, cyberpunk, vintage manor, or arctic expedition templates.
   - Selects difficulty: **Easy**, **Medium**, or **Hard**.
   - Submits request; an animated investigation dossier spinner runs while the Gemini API constructs the crime scene.
3. **Investigation Room (`/case/:id`):**
   - **Case Overview:** Title, setting description, crime recap, victim details, and incident time.
   - **Suspect Gallery:** Card grid showing each suspect's name, role, background, stated alibi, and possible motive.
   - **Evidence Board:** Clues represented as classified files. Clicking a clue marks it as "discovered" and unseals its forensic findings, adding **+5 points** to the score.
   - **Hints Section:** Detective helpline with locked hints. Players can unlock up to the difficulty limit; each unlocked hint costs **-10 points**.
   - **Detective Notebook:** A client-side scratchpad where the player can jot down deductions.
4. **Accusation (`/case/:id/accuse`):**
   - Player reviews the suspect lineup.
   - Selects the prime suspect.
   - Optional: writes out the key deduction/murder weapon rationale.
   - Submits the accusation to `POST /api/cases/:id/accuse`.
5. **Results & Debrief (`/case/:id/results`):**
   - **Verdict Banner:** Dramatic animation revealing whether the accusation was **"CASE SOLVED: MASTER DETECTIVE"** or **"WRONGFUL ACCUSATION: THE KILLER WALKED FREE"**.
   - **Score Breakdown:** Base points (if correct) + Clue exploration bonuses − Hint penalty = Final Score.
   - **Culprit Unmasked:** Official identity of the culprit, their motive, the flaw in their alibi, and the crucial piece of evidence that proved their guilt.
   - **Action Options:** "Investigate Another Mystery" or "Review Evidence Board".

---

## 3. UI and Page Specifications

### 3.1 Design System & Theme
- **Aesthetic:** High-contrast Noir Sleuth & Modern Cyber-Bureau.
- **Palette:**
  - Dark Backgrounds: Slate-950 (`#020617`), Slate-900 (`#0f172a`), Zinc-900 (`#18181b`)
  - Accent Gold/Amber: Amber-400 (`#fbbf24`), Amber-500 (`#f59e0b`) for detective badge highlights
  - Evidence Blood/Crimson: Rose-500 (`#f43f5e`), Red-600 (`#dc2626`) for murder alerts
  - Investigation Cyan/Emerald: Emerald-400 (`#34d399`) for discovered clues, Cyan-400 for forensic data
  - Borders: Glassmorphic borders (`border-white/10`, `backdrop-blur-md`)
- **Typography:**
  - Headings: Serif or bold industrial (e.g. *Cinzel*, *Playfair Display*, or *Inter Black*)
  - Body & Dossiers: Monospace accents (*JetBrains Mono* / *Courier Prime*) for clues and case files; Clean Sans (*Inter*) for readability.

### 3.2 Page Breakdown

#### A. Home Page (`/`)
- **Hero Section:**
  - Headline: *"Crack Procedural Murder Mysteries Powered by AI"*.
  - Subheadline: *"Interrogate suspects, inspect crime scenes, gather forensic evidence, and bring killers to justice before your score slips away."*
  - CTA Button: *"Launch New Case"*.
- **Feature Highlights:**
  - Card 1: *Infinite Generation* (Gemini AI builds bespoke, non-repeating cases).
  - Card 2: *Evidence & Forensics* (Unseal crime scene files and verify alibis).
  - Card 3: *Zero Spoilers Guaranteed* (Culprit data secured on the server until formal indictment).
- **Rules & Scoring Matrix:** Quick reference table explaining points for Easy, Medium, and Hard tiers.

#### B. Create Mystery Page (`/create`)
- **Premise Input:**
  - Textarea with placeholder: *"e.g., An antique collector was found poisoned inside an elevator stopped between floors..."*
  - Preset Quick-Pick Chips: *"Vintage Manor Murder"*, *"Silicon Valley Tech Sabotage"*, *"Orient Express Train Mystery"*, *"Deep Sea Research Lab"*.
- **Difficulty Selector:**
  - Segmented control / 3 clickable cards for **Easy**, **Medium**, **Hard**.
  - Displays specs dynamically:
    - *Easy:* 3 Suspects, 5 Clues, 2 Hints (Base: 100 pts)
    - *Medium:* 4 Suspects, 7 Clues, 3 Hints (Base: 150 pts)
    - *Hard:* 5 Suspects, 9 Clues, 3 Hints (Base: 200 pts)
- **Submit Button:** *"Generate Mystery Dossier"* with loading state featuring rotating detective status updates (*"Examining forensic perimeter..."*, *"Interrogating witnesses..."*, *"Compiling suspect profiles..."*).

#### C. Investigation Room (`/case/:id`)
- **Header Bar:**
  - Case Code (e.g. `#CASE-8492`), Difficulty Badge, Current Potential Score Indicator, and "Accuse Suspect" floating CTA button.
- **Narrative Dossier:**
  - Incident Briefing, Crime Location, Victim Profile, and Time of Death.
- **Suspects Section:**
  - Grid of interactive suspect profile cards.
  - Details: Name, Age/Role, Motive hypothesis, Stated Alibi, Psychological notes, and Suspect status tag ("Under Investigation").
- **Clue & Forensic Board:**
  - Cards for each clue.
  - States:
    - *Undiscovered:* Sealed evidence bag icon, title preview, "Inspect Evidence (+5 pts)" button.
    - *Discovered:* Glowing border, detailed forensic findings revealed, timestamp of discovery, green check badge.
- **HQ Hints Drawer / Section:**
  - Hint counter: `Used: X / Max: Y`.
  - "Request Hint (-10 pts)" button with confirmation modal.
  - Unlocked hints list with forensic deduction tips.
- **Detective Scratchpad:**
  - Collapsible drawer for personal deduction notes saved in `localStorage`.

#### D. Accusation Modal / View (`/case/:id/accuse`)
- **Lineup View:**
  - Radio/select cards of all suspects with avatar, name, and role.
- **Reasoning Input (Optional):**
  - "Why do you believe this suspect committed the crime?"
- **Warning Notice:**
  - *"Once submitted, the case is officially closed and your score will be locked. Ensure you have examined sufficient evidence!"*
- **Action Buttons:**
  - Cancel / Return to Investigation
  - Confirm Accusation

#### E. Results & Case Resolution (`/case/:id/results`)
- **Hero Banner:**
  - If Correct: Emerald badge, celebratory animation, "CASE CLOSED: CULPRIT APPREHENDED".
  - If Incorrect: Crimson badge, siren pulse, "CASE FAILED: WRONGFUL ACCUSATION".
- **Score Card:**
  - Base Score: +100 / +150 / +200 (or 0 if wrong)
  - Clues Found: `+5 pts × N = +X pts`
  - Hints Used: `-10 pts × N = -Y pts`
  - **Total Detective Score:** Calculated final tally (minimum 0).
- **The Confession & Truth:**
  - Identity of the actual killer.
  - The real motive unmasked.
  - The fatal flaw in their alibi that betrayed them.
  - Step-by-step crime timeline reconstruct.
- **Next Steps:**
  - "Start Another Mystery" button.
  - "Review Solved Evidence" toggle.

---

## 4. Backend and Database Design

### 4.1 Architecture & Security Requirement
> **CRITICAL SECURITY REQUIREMENT:**
> The `solution` object (containing `culpritId`, `culpritName`, `explanation`, and `motive`) must **NEVER** be returned to the client in the `GET /api/cases/:id` endpoint while `status === 'investigating'`. It is only projected into the response upon submission of `POST /api/cases/:id/accuse` or via `GET /api/cases/:id/result` after the case status has moved to `solved` or `failed`.

### 4.2 Database Schema (Mongoose Model: `Case`)

```typescript
interface ISuspect {
  id: string;              // e.g. "suspect_1"
  name: string;            // e.g. "Dr. Aris Thorne"
  role: string;            // e.g. "Chief Geneticist"
  bio: string;             // Background description
  alibi: string;           // Where they claim to have been
  motive: string;          // Possible reason they might want the victim dead
  avatarUrl?: string;      // Curated avatar or placeholder icon
}

interface IClue {
  id: string;              // e.g. "clue_1"
  title: string;           // e.g. "Shattered Erlenmeyer Flask"
  category: "forensic" | "testimony" | "documentary" | "physical";
  description: string;     // Detailed forensic analysis
  discovered: boolean;     // Default: false
  discoveredAt?: Date;
}

interface IHint {
  id: string;              // e.g. "hint_1"
  order: number;           // 1, 2, 3
  text: string;            // The hint guidance
  revealed: boolean;       // Default: false
  revealedAt?: Date;
}

interface ISolution {
  culpritId: string;       // Matches ISuspect.id
  culpritName: string;     // Matches ISuspect.name
  motive: string;          // The true underlying motive
  explanation: string;     // Detailed breakdown connecting clues to the culprit
  fatalFlaw: string;       // The exact contradiction in their alibi/action
}

interface IScore {
  base: number;
  cluesBonus: number;
  hintsDeduction: number;
  total: number;
}

interface ICaseDocument {
  title: string;
  premise: string;
  theme: string;
  difficulty: "easy" | "medium" | "hard";
  story: {
    setting: string;
    victim: string;
    crimeScene: string;
    timeOfDeath: string;
    narrative: string;
  };
  suspects: ISuspect[];
  clues: IClue[];
  hints: IHint[];
  solution: ISolution;     // Hidden until case completion!
  status: "investigating" | "solved" | "failed";
  accusation?: {
    suspectId: string;
    suspectName: string;
    reasoning?: string;
    isCorrect: boolean;
    accusedAt: Date;
  };
  score: IScore;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.3 REST API Endpoints

#### 1. `POST /api/cases`
- **Description:** Generates a new mystery using Gemini AI and stores it in MongoDB.
- **Request Body:**
  ```json
  {
    "premise": "A rare emerald is stolen and the museum curator is found dead in the vault",
    "difficulty": "medium",
    "theme": "noir"
  }
  ```
- **Validation Rules:**
  - `premise`: String, 5–500 chars (optional; defaults to a curated prompt if empty).
  - `difficulty`: Enum `["easy", "medium", "hard"]` (required).
  - `theme`: String (optional, e.g., "noir", "cyberpunk", "victorian").
- **Response (201 Created):**
  - Returns the newly created case object with `solution` stripped out.
  ```json
  {
    "success": true,
    "data": {
      "_id": "671e...",
      "title": "The Vault of the Green Eye",
      "difficulty": "medium",
      "story": { ... },
      "suspects": [ ... ],
      "clues": [
        { "id": "clue_1", "title": "Scratched Electronic Lock", "discovered": false }
      ],
      "hints": [
        { "id": "hint_1", "revealed": false }
      ],
      "status": "investigating",
      "score": { "base": 0, "cluesBonus": 0, "hintsDeduction": 0, "total": 0 }
    }
  }
  ```

#### 2. `GET /api/cases/:id`
- **Description:** Retrieves the active state of an ongoing investigation.
- **Security Logic:**
  - If `status === 'investigating'`, exclude `solution` from MongoDB projection:
    `.select('-solution')`.
  - For clues, return description only if `discovered === true` (or return preview for undiscovered ones).
  - For hints, return text only if `revealed === true`.
- **Response (200 OK):** Active case state.

#### 3. `POST /api/cases/:id/clues/:clueId/discover`
- **Description:** Marks a clue as examined and discovered, granting +5 clue bonus points.
- **Logic:**
  - Finds clue by `id`. If already `discovered: true`, returns existing status without double-counting points.
  - Sets `discovered = true`, `discoveredAt = new Date()`.
  - Recalculates `score.cluesBonus = discoveredCount * 5`.
  - Saves and returns updated clue and score.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "clue": {
      "id": "clue_1",
      "title": "Scratched Electronic Lock",
      "description": "Microscopic copper residue indicates a modified bypass tool was used at 11:42 PM.",
      "discovered": true
    },
    "score": { "cluesBonus": 5 }
  }
  ```

#### 4. `POST /api/cases/:id/hints`
- **Description:** Requests the next available hint in sequence, applying a -10 point penalty.
- **Logic:**
  - Finds the first hint with `revealed: false`.
  - If all hints are already revealed, returns 400 Bad Request ("All hints unlocked").
  - Marks `revealed = true`, `revealedAt = new Date()`.
  - Recalculates `score.hintsDeduction = revealedCount * 10`.
  - Saves and returns the revealed hint.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "hint": {
      "id": "hint_1",
      "order": 1,
      "text": "Check the security log timestamp against the suspect who claimed they were in the dining hall until midnight.",
      "revealed": true
    },
    "score": { "hintsDeduction": 10 }
  }
  ```

#### 5. `POST /api/cases/:id/accuse`
- **Description:** Submits the final accusation against a suspect.
- **Request Body:**
  ```json
  {
    "suspectId": "suspect_3",
    "reasoning": "The copper residue on the lock matches the modified bypass tool found in his workshop."
  }
  ```
- **Validation & Scoring Logic:**
  - Rejects if case is already `status !== 'investigating'`.
  - Compares `suspectId` with `case.solution.culpritId` (or case-insensitive name match).
  - Determines `isCorrect`:
    - If `true`:
      - Easy: Base = 100
      - Medium: Base = 150
      - Hard: Base = 200
      - `status = 'solved'`
    - If `false`:
      - Base = 0
      - `status = 'failed'`
  - Computes `total = Math.max(0, base + cluesBonus - hintsDeduction)`.
  - Updates `case.accusation` and `case.status`.
  - Saves case.
  - Returns the **complete** case, including the unsealed `solution`.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "verdict": {
      "isCorrect": true,
      "accusedSuspect": "Marcus Vance",
      "actualCulprit": "Marcus Vance",
      "score": {
        "base": 150,
        "cluesBonus": 35,
        "hintsDeduction": 10,
        "total": 175
      },
      "solution": {
        "culpritId": "suspect_3",
        "culpritName": "Marcus Vance",
        "motive": "To recover financial losses before the audit",
        "fatalFlaw": "He claimed his keycard was stolen, yet the timestamp proves his biometric token was verified.",
        "explanation": "Marcus used his specialized electronics kit..."
      }
    }
  }
  ```

#### 6. `GET /api/cases/:id/result`
- **Description:** Retrieves the completed debrief and solution for a finished case.
- **Validation:** Returns 403 Forbidden if case is still in `investigating` status.

---

## 5. AI Behavior & Scoring Rules

### 5.1 Difficulty Specifications Matrix

| Difficulty | Suspects | Clues | Hints | Base Score (Win) | Target Complexity |
|---|---|---|---|---|---|
| **Easy** | 3 | 5 | 2 | 100 pts | Direct evidence, clear alibi contradiction, obvious motive. |
| **Medium** | 4 | 7 | 3 | 150 pts | Multiple overlapping motives, one subtle timeline conflict, forensic evidence required. |
| **Hard** | 5 | 9 | 3 | 200 pts | Red herrings present, complex alibis, circumstantial + forensic deductions needed to isolate single culprit. |

### 5.2 Scoring Formula

$$\text{Final Score} = \max\left(0, \text{Base Points} + (\text{Discovered Clues} \times 5) - (\text{Hints Used} \times 10)\right)$$

- **Base Points:**
  - Correct Accusation:
    - Easy: $+100$
    - Medium: $+150$
    - Hard: $+200$
  - Incorrect Accusation: $0$
- **Clue Discovery Bonus:** $+5\text{ pts}$ per unique clue examined.
- **Hint Usage Penalty:** $-10\text{ pts}$ per hint revealed.
- **Score Floor:** Score cannot drop below $0$.

### 5.3 Gemini Prompt Engineering & Zod Schema Enforcement

The backend uses the official `@google/genai` SDK with strict JSON schema instructions:

#### System Prompt Directives:
1. **Air Tight Logic:** The mystery must have exactly ONE guilty culprit among the suspects.
2. **Fair Play Detective Rule:** Every piece of evidence needed to deduce the killer must be present in the clues and suspect alibis. The player must NOT require outside knowledge.
3. **Red Herrings:** In Medium and Hard difficulties, innocent suspects should have suspicious secrets (e.g. minor theft, hidden relationship), but their alibis or physical constraints conclusively clear them of the murder.
4. **Output Format:** Strict raw JSON matching the required schema, with NO markdown backticks or commentary.

#### Zod Output Validation Schema:
```typescript
import { z } from "zod";

export const MysteryGenerationSchema = z.object({
  title: z.string().min(3),
  story: z.object({
    setting: z.string(),
    victim: z.string(),
    crimeScene: z.string(),
    timeOfDeath: z.string(),
    narrative: z.string()
  }),
  suspects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    alibi: z.string(),
    motive: z.string()
  })),
  clues: z.array(z.object({
    id: z.string(),
    title: z.string(),
    category: z.enum(["forensic", "testimony", "documentary", "physical"]),
    description: z.string()
  })),
  hints: z.array(z.object({
    id: z.string(),
    order: z.number(),
    text: z.string()
  })),
  solution: z.object({
    culpritId: z.string(),
    culpritName: z.string(),
    motive: z.string(),
    explanation: z.string(),
    fatalFlaw: z.string()
  })
});
```

---

## 6. Acceptance Criteria

| ID | Category | Condition |
|---|---|---|
| **AC-1** | Generation | Users can generate mysteries across all 3 difficulty tiers (Easy: 3 suspects/5 clues, Medium: 4/7, Hard: 5/9). |
| **AC-2** | Security | The `solution` (culprit identity, confession, motive) is never exposed via network responses during the active investigation. |
| **AC-3** | Clue Discovery | Clicking a clue marks it as discovered on the backend, updates points (+5), and reveals forensic details. |
| **AC-4** | Hint System | Players can unlock sequential hints at -10 points each, up to the difficulty limit. |
| **AC-5** | Scoring | Backend calculates scores deterministically (Base + Clues - Hints, floored at 0). |
| **AC-6** | Accusation | Submitting an accusation changes case status, locks further clue/hint modifications, unmasks the culprit, and displays verdict. |
| **AC-7** | Error Handling | Invalid AI output, missing API keys, or database disconnects trigger descriptive, user-friendly error banners and fallbacks. |
| **AC-8** | Responsiveness | UI adapts seamlessly across desktop, tablet, and mobile screens. |

---

## 7. Deployment & Environment Strategy

### 7.1 Environment Variables

#### Backend (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_mystery_room  # Or MongoDB Atlas URI
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 7.2 Deployment Target
- **Backend:** Render / Railway / Node server with configured `MONGODB_URI` and `GEMINI_API_KEY`.
- **Frontend:** Vercel / Netlify with `VITE_API_URL` pointing to the deployed backend.
- **Database:** MongoDB Atlas M0 Free Cluster.

---

*This document serves as the architectural contract for the AI Mystery Room implementation.*
