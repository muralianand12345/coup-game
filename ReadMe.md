# Coup - Online Multiplayer

A real-time multiplayer implementation of the board game Coup using React, Node.js, and Socket.io.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, TypeScript
- **Shared**: TypeScript types shared between client and server

## Project Structure

```
coup-game/
├── packages/
│   ├── client/          # React frontend (Vercel)
│   ├── server/          # Node.js backend (Render)
│   └── shared/          # Shared TypeScript types
└── package.json         # Yarn workspaces root
```

## Local Development

### Prerequisites

- Node.js 18+
- Yarn

### Setup

1. Clone the repository

2. Install dependencies:
```bash
yarn install
```

3. Build the shared package:
```bash
yarn build:shared
```

4. Create environment files:

**packages/server/.env**
```
PORT=3001
CLIENT_URL=http://localhost:5173
```

**packages/client/.env**
```
VITE_SERVER_URL=http://localhost:3001
```

5. Start development servers:
```bash
yarn dev
```

This runs both the client (port 5173) and server (port 3001) concurrently.

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set the following:
   - **Root Directory**: `packages/server`
   - **Build Command**: `cd ../.. && yarn install && yarn build:shared && yarn build:server`
   - **Start Command**: `node dist/index.js`
   - **Environment Variables**:
     - `CLIENT_URL`: Your Vercel frontend URL

### Frontend (Vercel)

1. Import your repository on Vercel
2. Set the following:
   - **Root Directory**: `packages/client`
   - **Build Command**: `cd ../.. && yarn install && yarn build:shared && cd packages/client && yarn build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_SERVER_URL`: Your Render backend URL

## Game Rules

Coup is a game of bluffing and deception for 2-6 players.

### Cards (3 of each)
- **Duke** - Tax: Take 3 coins | Blocks Foreign Aid
- **Assassin** - Assassinate: Pay 3 coins to eliminate a player's card
- **Captain** - Steal: Take 2 coins from another player | Blocks Stealing
- **Ambassador** - Exchange: Swap cards with the deck | Blocks Stealing
- **Contessa** - Blocks Assassination

### Actions
- **Income** - Take 1 coin (cannot be blocked)
- **Foreign Aid** - Take 2 coins (can be blocked by Duke)
- **Coup** - Pay 7 coins to eliminate a card (cannot be blocked)
- Character abilities can be challenged

### Gameplay
1. Each player starts with 2 cards and 2 coins
2. On your turn, take one action
3. Other players can challenge your claim or block your action
4. If challenged, reveal the required card or lose an influence
5. At 10+ coins, you must Coup
6. Last player with cards wins!

## Features

- [x] Room creation with shareable codes
- [x] Real-time gameplay with WebSocket
- [x] 30-second challenge timers
- [x] Reconnection handling
- [x] In-game chat
- [x] Game log
- [x] Mobile-friendly design

## License

MIT