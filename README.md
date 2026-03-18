# Slot Engine MVP Practical Assessment

A config-driven **server-side slot engine MVP** built for a retail gaming platform. The project separates RNG, reel generation, win evaluation, jackpot handling, API delivery, and a lightweight Next.js operator/player UI.

## Project Overview

This repository contains:

- **Backend**: Express + TypeScript slot engine service.
- **Frontend**: Next.js dashboard for authentication, wallet funding, spinning, and running simulations.
- **Config-driven game math**: reel strips, paylines, paytable, and jackpot rules are all stored in JSON configuration files.
- **Simulation tooling**: run large spin batches and review RTP / hit frequency / jackpot metrics.

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- Local JSON persistence for wallets and jackpot meter
- JSON config files for reel math

### Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Features Implemented

- 5 reels with configurable symbol strips.
- RNG stop position per reel.
- 5x3 visible result grid.
- 5 paylines evaluated left-to-right.
- Minimum 3-of-a-kind line wins.
- Wild substitution on paylines.
- Scatter count anywhere on screen.
- Bonus trigger flag when 3+ scatters land.
- Bet-based payout calculation from configurable paytable.
- Progressive jackpot contribution (`2%` by default).
- Jackpot meter returned on every spin.
- Simple jackpot trigger model:
  - 5 scatters, or
  - weighted random trigger from config.
- Exposure control with `max_win = bet × 100`.
- Simulation reporting with RTP / hit frequency / bonus frequency / jackpot growth.

## Repository Structure

```text
backend/
  config/
    reels.json
    paylines.json
    paytable.json
    jackpot.json
  engine/
    rng.ts
    reels.ts
    evaluator.ts
    jackpot.ts
    spinEngine.ts
    simulator.ts
frontend/
  app/
  components/
README.md
```

## Configuration Files

All core slot math is config-driven and lives in `backend/config/`:

- `reels.json` - symbol strips for each of the 5 reels plus wild/scatter definitions.
- `paylines.json` - row indices for each payline.
- `paytable.json` - multipliers for 3/4/5 matching symbols.
- `jackpot.json` - contribution percentage and trigger rules.

### Current Defaults

- Jackpot contribution: `2%` of bet.
- Jackpot trigger scatter threshold: `5` scatters.
- Random jackpot chance: `0.001`.
- Max exposure: `bet × 100`.

## Installation

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd slot-Assignment
```

### 2) Install backend dependencies

```bash
cd backend
npm install
```

### 3) Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4) Configure environment variables

Create `backend/.env` from the example file:

```bash
cd ../backend
cp .env.example .env
```

Populate the following values:

```env
ACCESS_TOKEN_SECRET=replace_me
REFRESH_TOKEN_SECRET=replace_me
```

> The backend persists demo users and the jackpot meter in `backend/data.json`, so no external database is required for the assessment.

## How to Run the Engine

### Start backend

From `backend/`:

```bash
npm run dev
```

Backend API runs on:

```text
http://localhost:5000
```

### Start frontend

From `frontend/`:

```bash
npm run dev
```

Frontend UI runs on:

```text
http://localhost:3000
```

## How to Trigger Spins

### Through the UI

1. Open `http://localhost:3000`
2. Sign up / sign in.
3. Add wallet funds.
4. Enter a bet amount.
5. Click **SPIN**.
6. Review:
   - 5x3 reel grid
   - total win
   - winning paylines
   - scatter count / bonus trigger
   - jackpot value
   - exposure cap status

### Through the API

#### Login / signup

```bash
curl -X POST http://localhost:5000/api/login_or_signup \
  -H "Content-Type: application/json" \
  -d '{"account":"demo@example.com","password":"secret123"}'
```

Use the returned `accessToken` as the `Authorization` header.

#### Add wallet funds

```bash
curl -X POST http://localhost:5000/api/add_to_wallet \
  -H "Content-Type: application/json" \
  -H "Authorization: <ACCESS_TOKEN>" \
  -d '{"amount":5000}'
```

#### Spin

```bash
curl -X POST http://localhost:5000/api/spin \
  -H "Content-Type: application/json" \
  -H "Authorization: <ACCESS_TOKEN>" \
  -d '{"bet":100}'
```

## Example Spin Output

```json
{
  "grid": [
    ["A", "K", "W", "Q", "A"],
    ["A", "K", "A", "Q", "A"],
    ["S", "K", "A", "Q", "A"]
  ],
  "totalWin": 800,
  "baseGameWin": 800,
  "jackpotMeter": 42,
  "jackpotWin": 0,
  "jackpotTriggered": false,
  "bonusTriggered": false,
  "scatterCount": 1,
  "lineWins": [
    {
      "lineIndex": 1,
      "symbol": "A",
      "count": 3,
      "win": 800,
      "positions": [
        { "row": 1, "col": 0 },
        { "row": 1, "col": 1 },
        { "row": 1, "col": 2 }
      ]
    }
  ],
  "maxWinCap": 10000,
  "wasCapped": false
}
```

## How to Run Performance Simulation

### In the UI

1. Set a bet amount.
2. Enter `50000` or `100000` in the simulation panel.
3. Click **Run Simulation**.
4. Review the returned summary.

### Through the API

```bash
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -H "Authorization: <ACCESS_TOKEN>" \
  -d '{"bet":100,"spins":50000}'
```

## Example Simulation Output

```json
{
  "spins": 50000,
  "bet": 100,
  "totalWagered": 5000000,
  "totalReturned": 3442100,
  "rtp": 0.68842,
  "averageWin": 68.842,
  "winningSpins": 16270,
  "hitFrequency": 0.3254,
  "bonusSpins": 2840,
  "bonusFrequency": 0.0568,
  "jackpotTriggers": 47,
  "maxWinObserved": 10000,
  "startingJackpot": 0,
  "endingJackpot": 3180,
  "jackpotContributionGrowth": 3180,
  "totalJackpotContributed": 100000,
  "totalJackpotPaidOut": 96820
}
```

## Reporting Coverage

The simulator returns the key summary metrics requested in the assessment:

- RTP percentage
- Average win
- Number of winning spins
- Bonus frequency
- Jackpot contribution growth
- Jackpot trigger count
- Maximum observed win
- Total wagered / total returned

## Notes on Architecture

The MVP is split into clear engine layers:

- `rng.ts` - random stop generation.
- `reels.ts` - builds the visible 5x3 grid from reel strips.
- `evaluator.ts` - paylines, wild substitution, scatter counting.
- `jackpot.ts` - jackpot accrual and trigger logic.
- `spinEngine.ts` - single-spin orchestration and max-win cap.
- `simulator.ts` - batch-run statistics.
- `routes/` + `utils/gameUtils.ts` - HTTP API layer.

## Assumptions / Simplifications

- Bonus mode is represented by a **bonus trigger flag** only, as requested.
- Jackpot can trigger through either configured scatter count or configured random chance.
- Payline wins are evaluated left-to-right only.
- Scatter symbols do not pay on paylines.
- Wild-only paylines are paid according to the wild entry in the paytable.

## Recommended Demo Flow

For assessment review:

1. Start backend.
2. Start frontend.
3. Create a demo user.
4. Add wallet funds.
5. Perform several manual spins.
6. Run a 50,000-spin simulation.
7. Review the reported RTP / hit rate / jackpot growth.
