# Coup Shared

Shared TypeScript types and utilities used by both client and server packages.

## Setup
From repo root:
```bash
yarn install
yarn build:shared
```

## Scripts (workspace)
- `yarn workspace @coup/shared build` — compile shared code to `dist/`.

## Usage
- Import types from `@coup/shared` in client and server to keep payloads consistent.
- Rebuild (`yarn build:shared`) after changing shared interfaces so other packages pick up the latest dist output.
