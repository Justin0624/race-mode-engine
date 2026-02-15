# 🏁 Race Mode Engine

AI-powered tuning coach for 1/10 scale RC racing. Your pit crew chief in your pocket.

## What It Does

Race Mode Engine is a conversational setup coach that helps RC racers tune their cars during race nights. Instead of spiraling through random changes under pressure, the app provides intelligent, setup-aware recommendations one change at a time.

### Core Features

- **Conversational Setup Builder** — Build your complete setup sheet through a guided conversation. The app teaches you what each setting does as you go.
- **"What Is X?" Knowledge Engine** — Ask about any RC concept (anti-squat, caster, roll center, etc.) and get a plain-language explanation with how it applies to your car's current settings.
- **Race Night Coaching** — Tell the coach what the car is doing, get one specific recommendation based on YOUR setup, test it, log the result. One change at a time.
- **Spiral Prevention** — After two "worse" results, the coach pumps the brakes and suggests rolling back. No more stacking bad changes.
- **Setup Awareness** — Every recommendation references your actual current values: "Your front oil is **35wt** — drop to **30wt**."
- **Setup Sheet Viewer** — View your full setup anytime with changes from baseline highlighted.

### Supported Cars (Phase 1)

- Team Associated RC10B7 (2WD Buggy)
- Team Associated RC10B84 (4WD Buggy) — *coming soon*
- Team Associated RC10T7 (Stadium Truck) — *coming soon*

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Auth**: Supabase Auth (Google, Apple, Facebook OAuth)
- **Database**: Supabase (PostgreSQL)
- **Backend**: FastAPI (Python) — for AI coaching engine
- **AI**: Claude API (Anthropic) — for intelligent recommendations
- **Hosting**: Vercel (frontend) + Render (API)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/race-mode-engine.git
cd race-mode-engine

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase keys (see Auth Setup below)

# Run dev server
npm run dev
```

### Auth Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers** and enable:
   - Google (requires Google Cloud Console OAuth credentials)
   - Apple (requires Apple Developer account)
   - Facebook (requires Meta Developer app)
3. Copy your project URL and anon key to `.env.local`

See [docs/AUTH_SETUP.md](docs/AUTH_SETUP.md) for detailed instructions.

## Project Structure

```
race-mode-engine/
├── src/
│   ├── components/      # React components
│   │   ├── Chat.jsx     # Main chat interface
│   │   ├── SetupViewer.jsx
│   │   ├── KnowledgeBase.jsx
│   │   └── Auth/
│   │       ├── LoginPage.jsx
│   │       └── AuthProvider.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Coach.jsx
│   │   └── Profile.jsx
│   ├── lib/
│   │   ├── supabase.js  # Supabase client
│   │   ├── knowledge.js # RC concept knowledge base
│   │   └── baselines.js # Kit baseline data
│   ├── hooks/
│   │   └── useAuth.js
│   ├── data/
│   │   └── cars/
│   │       └── b7_kit_baseline.json
│   ├── App.jsx
│   └── main.jsx
├── public/
├── docs/
│   └── AUTH_SETUP.md
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Roadmap

### Phase 1: Race Night Guardrail ✅
- Conversational coaching UI
- Setup builder (guided + freetext)
- Knowledge engine (25+ concepts)
- B7 kit baseline (verified)
- Spiral prevention

### Phase 2: Auth & Persistence
- User accounts (Google/Apple/FB)
- Save/load setups
- Session history
- PDF setup sheet upload & parsing

### Phase 3: Track Intelligence
- Track profiles (surface, grip, conditions)
- Aggregate anonymous session data
- Pattern recognition ("at this track, racers end up around 50k diff")
- PetitRC setup database integration

### Phase 4: Multi-Car Support
- B84 (4WD buggy)
- T7 (stadium truck)
- Car-specific knowledge & recommendations

## Contributing

This project is in early development. If you're an RC racer who wants to help, reach out!

## License

MIT
