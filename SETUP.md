## :rocket: Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create SQLite database and push schema
npx prisma db push
```

### 3. Configure Environment

Create `.env` in `apps/api/`:
```env
# Database
DATABASE_URL="file:./dev.db"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key-here"

# API Configuration
API_PORT="3000"
CORS_ORIGIN="localhost"
NODE_ENV="development"
```

**Get Gemini API Key:**
1. Go to [Google AI Studio](aistudio.google.com/app/apikey)
2. Create a new API key
3. Paste it in `.env`

### 4. Generate Mock Data (Optional)
```bash
npm run mock:generate 20
```

This creates 20 realistic mock sessions for demoing.

---

## :runner: Development

### Terminal 1: Backend API
```bash
npm run dev:api
```
Runs on `localhost`

### Terminal 2: Frontend Dashboard
```bash
npm run dev:web
```
Runs on `localhost`

### Terminal 3: Chrome Extension
```bash
npm run dev:ext
```

---

## :jigsaw: Load Extension in Chrome

1. Open `chrome://extensions`
2. Toggle **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select `apps/extension/dist`
5. You'll see CodeLens extension
6. Click the extension icon and verify it's active

---

## :dart: Testing the Flow

### Option A: Real LeetCode Session
1. Navigate to [LeetCode](leetcode.com/problems/two-sum)
2. Click the CodeLens extension icon
3. Solve the problem
4. Extension will show a "Save Session" button when done
5. Click it
6. Check the dashboard at `localhost`

### Option B: Mock Sessions (Recommended for Demo)
```bash
npm run mock:generate 10
```

Then open the dashboard to see realistic sessions.

---

## :bar_chart: Database Commands

### View Data in Prisma Studio
```bash
npm run db:studio
```
Opens interactive GUI at `localhost`

### Reset Database
```bash
npx prisma db push --skip-generate
```

### View Database File
The SQLite database is at `prisma/dev.db`

---

## :file_folder: Project Structure

```
hackathon/
├── apps/
│   ├── api/                 # Backend (Fastify)
│   │   ├── src/
│   │   │   ├── server.ts    # API routes
│   │   │   ├── ai/
│   │   │   │   └── analyzer.ts   # Feature extractor, rule engine, Gemini
│   │   │   └── mock.ts      # Mock data generator
│   │   └── package.json
│   ├── web/                 # Frontend (React)
│   │   ├── src/
│   │   │   ├── App.tsx      # Main dashboard component
│   │   │   ├── LandingPage.tsx
│   │   │   └── main.tsx
│   │   └── package.json
│   └── extension/           # Chrome Extension
│       ├── src/
│       │   ├── content.ts   # Runs on LeetCode, tracks events
│       │   ├── background.ts
│       │   └── popup.ts     # Extension popup UI
│       ├── public/
│       │   └── manifest.json
│       └── package.json
├── packages/
│   └── shared/              # Shared types
│       └── types.ts         # TypeScript enums & interfaces
├── prisma/
│   ├── schema.prisma        # Database schema with enums
│   └── dev.db               # SQLite database (created by db:push)
└── README.md
```

---

## :bug: Debugging

### Browser Console Issues
Open DevTools in the extension:
1. Go to `chrome://extensions`
2. Click **Details** on CodeLens
3. Click **Errors** to see any errors

### Backend Logs
The terminal running `npm run dev:api` shows all API logs.

### Database Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset and repush schema
rm prisma/dev.db
npx prisma db push
```

---

## :clapper: Demo Flow (5 minutes)

1. **Landing Page** (30 sec)
   - Show `localhost`
   - Click "Install" → shows extension installation

2. **Dashboard Overview** (1 min)
   - Show stats, contribution calendar
   - Show session score breakdown

3. **Session Replay** (1.5 min)
   - Open a mock session
   - Show code evolution side-by-side
   - Show AI commentary on changes

4. **AI Coach** (1 min)
   - Show strengths & weaknesses
   - Show practice recommendations

5. **Roadmap** (1 min)
   - Mention V2 (multiple platforms)
   - Mention V3 (teams, interviews)

---

## :package: Build for Production

### Build All Services
```bash
npm run build:api
npm run build:web
npm run build:ext
```

### Backend
```bash
# Create production build
npm run build:api

# Start with Node
node apps/api/dist/server.js
```

### Frontend
Built files go to `apps/web/dist` (ready for Vercel)

### Extension
Built files go to `apps/extension/dist` (ready for Chrome Web Store)

---

## :ship: Deployment

### Backend (Railway or similar)
```bash
npm install
npx prisma db push --skip-generate
npm run build:api
npm start
```

### Frontend (Vercel)
```bash
npm run build:web
# Deploy apps/web/dist to Vercel
```

### Extension (Chrome Web Store)
1. Build: `npm run build:ext`
2. Zip `apps/extension/dist`
3. Upload to Chrome Web Store

---

## :key: Environment Variables

### Development
```env
NODE_ENV=development
API_PORT=3000
CORS_ORIGIN=localhost
DATABASE_URL=file:./dev.db
GEMINI_API_KEY=sk-abc123... (optional for fallback)
```

### Production
```env
NODE_ENV=production
API_PORT=3000
CORS_ORIGIN=yourdomain.com
DATABASE_URL=postgresql://user:pass@neon.tech/db
GEMINI_API_KEY=sk-abc123...
```

---

## :books: API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/api/sessions` | List all sessions |
| GET | `/api/sessions/:id` | Get session details |
| GET | `/api/sessions/:id/analysis` | Get session analysis |
| POST | `/api/sessions` | Create new session |
| POST | `/api/sessions/:id/analyze` | Re-analyze session |

---

## :art: Customization

### Change Colors
Edit `apps/web/tailwind.config.js` to adjust Tailwind theme.

### Modify AI Prompts
Edit `apps/api/src/ai/analyzer.ts` to change Gemini prompts.

### Adjust Extension Tracking
Edit `apps/extension/src/content.ts` to change event capture.

---

## :telephone_receiver: Support

For issues:
1. Check logs: `npm run dev:api` terminal
2. Check browser console: DevTools on extension
3. Check database: `npm run db:studio`
4. Reset: `rm prisma/dev.db && npx prisma db push`

---

## :trophy: Next Steps

- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Add user authentication
- [ ] Add more LeetCode metadata tracking
- [ ] Implement Session Replay visualization
- [ ] Add Codeforces support (V2)

---

**Happy hacking! :rocket:**