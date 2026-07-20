# CodeLens — AI Coach for LeetCode

**Understand how you code, not just what you solve.**

CodeLens is an AI-powered analytics platform that turns your LeetCode problem-solving sessions into personalized coaching insights. It uses Google Gemini AI to analyze your coding patterns and give you targeted recommendations to improve.

---

## :sparkles: Features

- **Session Replay** — Visual timeline showing your exact coding journey with diffs and AI comments.
- **AI Analysis** — Scores across Planning, Implementation, Debugging, and Optimization.
- **Pattern Recognition** — Identifies algorithms and data structures used during the session.
- **Smart Recommendations** — Target practice suggestions based on detected weak spots.
- **Privacy First** — Data is processed locally and uploaded only when you choose to save the session.

---

## :building_construction: Architecture

```
┌─────────────────────────────────────┐
│      Chrome Extension (Manifest V3)  │
│  - Tracks problem-solving events     │
│  - Records code snapshots            │
│  - Local storage buffering           │
│  - Single upload on completion       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       Fastify API Server             │
│  - Validates requests                │
│  - Stores sessions & events          │
│  - Runs Feature Extractor            │
│  - Executes Rule Engine              │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────┐
         ▼           ▼
    ┌────────┐   ┌──────────────┐
    │ Gemini │   │ Prisma ORM   │
    │   AI   │   │   Database   │
    └────────┘   └──────────────┘
         │           │
         └─────┬─────┘
               ▼
┌─────────────────────────────────────┐
│      React Dashboard (Vite)          │
│  - Landing page & Settings           │
│  - Session replay viewer             │
│  - AI coach insights                 │
│  - Performance trends & stats        │
└─────────────────────────────────────┘
```

---

## :open_file_folder: Folder Structure

```
CodeLens/
├── package.json         # Monorepo workspaces configuration
├── prisma/
│   └── schema.prisma    # Prisma SQLite schema
├── apps/
│   ├── extension/       # Manifest V3 chrome extension
│   ├── web/             # React dashboard & landing page SPA
│   └── api/             # Fastify backend server and AI analyzer
└── packages/
    └── shared/          # TypeScript models shared across projects
```

---

## :hammer_and_wrench: Tech Stack

- **Extension**: TypeScript, Vite, Chrome Extension Manifest V3
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Node.js, Fastify, TypeScript
- **Database**: Prisma ORM, SQLite database
- **AI Integration**: Google Gemini API

---

## :rocket: Getting Started

### 1. Install Dependencies
Run from the root directory to install all monorepo workspace dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in **both** the workspace root and the `apps/api/` directory:

**Workspace Root `.env`**:
```env
DATABASE_URL="file:./dev.db"
```

**`apps/api/.env`**:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-gemini-api-key"
API_PORT="3000"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

### 3. Database Initialization & Seeding
Generate the client, build the tables, and seed the database with mock session data:
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to SQLite
npx prisma db push

# Seed mock database sessions
npm run db:seed
```

### 4. Run Development Servers
Start the backend and frontend dev servers concurrently:

* **Terminal 1 (Backend API)**:
  ```bash
  npm run dev:api
  ```
  Runs at `http://localhost:3000`

* **Terminal 2 (Frontend Dashboard)**:
  ```bash
  npm run dev:web
  ```
  Runs at `http://localhost:5173`

---

## :jigsaw: Loading the Extension in Chrome

1. Build the extension bundle:
   ```bash
   npm run build:ext
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Toggle **Developer mode** in the top-right corner.
4. Click **Load unpacked** in the top-left.
5. Select the `apps/extension/dist` folder in the project workspace.
6. Refresh your LeetCode problem page to begin tracking sessions.

---


---

## �:world_map: Product Roadmap

### v1 (Current MVP)
- :white_check_mark: LeetCode extension integration
- :white_check_mark: Local workspace batch uploads
- :white_check_mark: Structured AI Analyzer & Fallback Mock mode
- :white_check_mark: Detailed session scores (Planning, Implementation, Debugging, Optimization)
- :white_check_mark: Interactive code snapshots diff timeline (Session Replay)
- :white_check_mark: Privacy-first landing page & dashboard portal

### v2 (Multi-Platform & Teams)
- :black_square_button: GeeksforGeeks, Codeforces, and HackerRank adapters
- :black_square_button: VS Code and JetBrains IDE extensions (tracking local compilation loops)
- :black_square_button: Team Dashboard (classrooms, bootcamp logs, and hiring assessments)

### v3 (Advanced Coaching)
- :black_square_button: Interactive Mock Interview voice simulator
- :black_square_button: Dynamic code optimization tips (suggesting custom cache implementations)
- :black_square_button: Suboptimal complexity block alerts

---

## :ship: Deployment & Hosting

For instructions on deploying the dashboard (Vercel) and backend database API (Render with volume mounts), refer to the [Hosting Guide](./hosting_guide.md).

---

## :page_facing_up: License

Licensed under the MIT License.
