# Slot Engine MVP Practical Assessment

A **config-driven server-side slot engine MVP** built for a retail gaming platform.
The project separates **RNG generation, reel logic, win evaluation, jackpot handling, API delivery, and a lightweight Next.js UI**.

---

# Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/Maagztech/slot-Assignment.git
cd slot-Assignment
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

---

# Running the Project

## Start Backend Server

```bash
cd backend
npm run dev
```

Backend will start on:

```
http://localhost:5000
```

---

## Start Frontend

Open a new terminal.

```bash
cd frontend
npm run dev
```

Frontend UI will start on:

```
http://localhost:3000
```

---

# Project Overview

This repository contains a **complete MVP slot game engine** with:

- Backend slot engine API
- Config-driven game math
- Next.js operator/player UI
- Simulation engine for RTP testing

The engine integrates the following components:

- RNG system
- Reel generator
- Payline evaluator
- Scatter logic
- Jackpot engine
- Simulation reporting

---

# Tech Stack

## Backend

- Node.js
- TypeScript
- Express
- MySQL (via mysql2)
- Config-driven JSON game math

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

---

# Features Implemented

### Core Slot Engine

- 5 reels with configurable symbol strips
- RNG stop position per reel
- 5×3 visible result grid
- Configurable paylines
- Payline evaluation left → right
- Minimum **3 matching symbols to win**
- Wild symbol substitution
- Scatter symbols counted anywhere

### Bonus System

- 3+ scatters trigger bonus flag

### Bet Handling

- Bet input from UI/API
- Payout calculated from paytable multipliers

### Progressive Jackpot

- Each spin contributes **2% of bet**
- Jackpot meter increases continuously
- Jackpot trigger conditions:
  - 5 scatter symbols
  - Random weighted trigger

### Exposure Control

Maximum payout protection:

```
max_win = bet × 100
```

Any win above this value is capped.

---

# Repository Structure

```
backend/
  config/
    reels.json
    paylines.json
    paytable.json
    jackpot.json
    ui.json

  engine/
    rng.ts
    reels.ts
    evaluator.ts
    jackpot.ts
    spinEngine.ts
    simulator.ts

  routes/
  utils/

frontend/
  app/
  components/

README.md
```

---

# Configuration Files

All slot math is **config-driven**.

Location:

```
backend/config/
```

### reels.json

Defines symbol strips for each reel.

### paylines.json

Defines row positions for paylines.

Example:

```
[0,0,0,0,0] → top row
[1,1,1,1,1] → middle row
[2,2,2,2,2] → bottom row
[0,1,2,1,0] → V shape
[2,1,0,1,2] → inverted V
```

### paytable.json

Defines multipliers for 3, 4, or 5 matching symbols.

### jackpot.json

Controls:

- jackpot contribution percentage
- jackpot trigger chance

### ui.json

Contains UI presets:

- default bet
- quick bet buttons
- simulation presets

---

# How to Trigger Spins

## Using the Web UI

1. Open

```
http://localhost:3000
```

2. Create an account or login
3. Add wallet funds
4. Enter bet amount
5. Click **SPIN**

You will see:

- 5×3 reel grid
- total win
- winning paylines
- scatter count
- jackpot value

---

# API Usage

## Login / Signup

```bash
curl -X POST http://localhost:5000/api/login_or_signup \
-H "Content-Type: application/json" \
-d '{"account":"demo@example.com","password":"secret123"}'
```

Use returned **accessToken** in Authorization header.

---

## Add Funds

```bash
curl -X POST http://localhost:5000/api/add_to_wallet \
-H "Content-Type: application/json" \
-H "Authorization: <ACCESS_TOKEN>" \
-d '{"amount":5000}'
```

---

## Spin

```bash
curl -X POST http://localhost:5000/api/spin \
-H "Content-Type: application/json" \
-H "Authorization: <ACCESS_TOKEN>" \
-d '{"bet":100}'
```

---

# Example Spin Output

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
  "maxWinCap": 10000,
  "wasCapped": false
}
```

---

# Running Performance Simulation

Simulation runs **large batches of RNG spins** to measure game statistics.

## Through UI

1. Enter bet amount
2. Choose spins (50,000 or 100,000)
3. Click **Run Simulation**

---

## Through API

```bash
curl -X POST http://localhost:5000/api/simulate \
-H "Content-Type: application/json" \
-H "Authorization: <ACCESS_TOKEN>" \
-d '{"bet":100,"spins":50000}'
```

---

# Example Simulation Output

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
  "bonusFrequency": 0.0568,
  "jackpotTriggers": 47,
  "maxWinObserved": 10000
}
```

---

# Simulation Metrics Explained

| Metric           | Meaning                          |
| ---------------- | -------------------------------- |
| RTP              | Return-to-player percentage      |
| Hit Frequency    | How often any win occurs         |
| Bonus Frequency  | How often scatter bonus triggers |
| Jackpot Triggers | Number of jackpot wins           |
| Max Win Observed | Largest win in simulation        |

---

# Architecture Design

The engine is modular with clear separation:

### RNG Layer

Handles random reel stopping positions.

### Reel Engine

Generates visible **5×3 grid**.

### Evaluation Engine

Processes paylines, wild substitution, and scatter counts.

### Jackpot Engine

Tracks jackpot contributions and triggers.

### Spin Engine

Coordinates the full spin lifecycle.

### Simulator

Runs large spin batches and generates reports.

---

# Assumptions / Simplifications

For MVP purposes:

- Bonus mode returns **trigger flag only**
- Scatter symbols do **not pay on paylines**
- Paylines evaluated **left → right only**
- Jackpot trigger uses simple model

---

# Demo Flow (Recommended for Reviewers)

1. Configure `.env`
2. Start backend
3. Start frontend
4. Create demo user
5. Add wallet funds
6. Run several manual spins
7. Run **50,000 spin simulation**
8. Review RTP / jackpot growth metrics

---

# Author

**Asutosh Pradhan**

GitHub
https://github.com/Maagztech
