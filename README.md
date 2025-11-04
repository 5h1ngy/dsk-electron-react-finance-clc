# Offline Risk Suite - Scaffolding

> Minimal, opinionated Electron + React shell ready to host the offline suite for client risk profiling and investment proposals. All business features have been removed so we can restart Wave 0 on a clean, lightweight base.

## What stays

- **Main process essentials** - typed `.env` loader (`LOG_LEVEL`), structured logger with renderer console proxying, hardened BrowserWindow factory, CSP + network blocker, and a single health IPC endpoint.
- **Preload bridge** - `window.api.health.check()` validates IPC payloads and keeps context isolation enabled.
- **Renderer hello world** - React 19 + Ant Design 5 screen that pings the main process and shows uptime, proving IPC and styling work while leaving plenty of room for the new flow (Excel ingest, scoring, proposal, PDF export).
- **Tooling** - electron-vite dev server/build, ESLint + Prettier, strict TypeScript configs, Jest (Node + jsdom) with example coverage over the health IPC registrar.

Everything else (Sequelize, auth/projects/tasks, Redux store, routing, i18n, PDF mocks, seeding, etc.) has been removed.

## Quick start

```bash
npm install
npm run dev        # starts electron-vite (main + preload + renderer)

npm run lint       # ESLint 9
npm run format     # Prettier 3
npm run typecheck  # TS node+web projects
npm test           # Jest (health IPC + preload smoke)
```

## Repository map

```
packages/
  main/      # env + logger + security + window manager + health IPC
  preload/   # exposes window.api.health
  renderer/  # React hello world diagnostics card
resources/   # icons/assets for packaging
test/__mocks__
```

## Next steps (Wave 0 prep)

1. Model the offline data flows (questionari JSON, Excel/PDF ingest) in the main process without reintroducing persistence.
2. Expand preload types + renderer store/layout to host the KYC stepper and scoring widgets.
3. Wire PDF export + deterministic hashing once the domain logic is ready.

Until then, this scaffold keeps logging, env loading, IPC, and UI theming operational with the smallest possible footprint.
