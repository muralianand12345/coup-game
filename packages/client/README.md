# Coup Client

React 18 + TypeScript + Vite frontend for the Coup multiplayer game.

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
yarn dev:client
```

## Environment
Create `packages/client/.env`:
```
VITE_SERVER_URL=http://localhost:3001
```

## Scripts (workspace)
- `yarn workspace @coup/client dev` — run Vite dev server.
- `yarn workspace @coup/client build` — production build to `dist/`.
- `yarn workspace @coup/client preview` — preview the build.

## Notes
- Tailwind CSS is configured via `tailwind.config.js` and `postcss.config.js`.
- The frontend expects the backend server on the URL above; adjust for deployments.
