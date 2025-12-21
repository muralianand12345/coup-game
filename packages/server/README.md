# Coup Server

Node.js + TypeScript backend for the Coup multiplayer game. Provides WebSocket game logic and room management.

## Setup
1) Install dependencies from repo root:
```bash
yarn install
```
2) Build shared types:
```bash
yarn build:shared
```
3) Start the dev server (from repo root):
```bash
yarn dev:server
```

## Environment
Create `packages/server/.env`:
```
PORT=3001
CLIENT_URL=http://localhost:5173
```

## Scripts (workspace)
- `yarn workspace @coup/server dev` — run `tsx watch` dev server.
- `yarn workspace @coup/server build` — compile to `dist/`.
- `yarn workspace @coup/server start` — run the compiled server (ensure `build` first).

## Notes
- WebSocket handlers live under `src/socket/handlers.ts`.
- Game engine logic is in `src/game/`.
- Adjust CORS/client URL settings to match your deployment.
