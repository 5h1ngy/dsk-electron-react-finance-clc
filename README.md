# Offline Risk Suite - Wave 1.1

> Electron + React offline workbench focused on ingesting questionari JSON/Excel/PDF, calcolare il profilo di rischio e preparare i flussi successivi (linee/strumenti, PDF, firma).

## Novità Wave 1.1

- **Import PDF questionario**: upload `.pdf` con parsing testuale (formato `id: valore`) tramite `pdfjs-dist`, precompilazione dello stepper e tracking metadati dell’ultimo import (anche in Diagnostics).
- **Hardening UX**: alert quando mancano campi obbligatori nella sezione corrente, pulsante "Esporta PDF" disabilitato finché ci sono risposte incomplete, storico import/export sempre visibile.
- **Test & domain**: nuovo parser PDF coperto da test (`domain/importers/pdfQuestionnaire.test.ts`) e worker configurato per Vite.

## Baseline Wave 0

- **Main process** invariato: caricamento `.env`, logger strutturato, hardening sicurezza, IPC `system:health`.
- **Preload bridge** minimale e tipizzato (`window.api.health` + `window.api.report`), pronto a ulteriori estensioni.
- **Renderer Ant Design-first**
  - Layout con header + routing (Workbench, Diagnostics) e health tag live.
  - Store Redux Toolkit con slice `questionnaire` + `workspace`.
  - Questionario dinamico generato da JSON pre-build (`packages/renderer/data/requests_schema.json`) validato via Zod.
  - Motore di scoring deterministico (0-100) con classi rischio/volatilità e rationales placeholder.
  - Import manuale (drag&drop `Upload.Dragger`) per questionario `.xlsx`, universo prodotti e PDF questionario.
  - Card riassuntive (schema, punteggio, import) basate esclusivamente su componenti Ant Design.
- **Domain scaffolding**: moduli `questionnaire`, `scoring`, `importers`, `report` pronti per l’estensione (mappatura, idoneità, ecc.).
- **Tooling**: electron-vite dev/build, ESLint 9, Prettier 3, TS strict, Jest (node+jsdom) con test su loader/scoring/report/importer PDF.

## Quick start

```bash
npm install
npm run dev        # starts electron-vite (main + preload + renderer)

npm run lint       # ESLint 9
npm run format     # Prettier 3
npm run typecheck  # TS node+web projects
npm test           # Jest (health IPC + preload + renderer)
```

## Repository map

```
packages/
  main/      # env + logger + security + IPC (health + report export)
  preload/   # espone window.api.{health,report}
  renderer/
    data/                 # schema JSON compile-time (v1)
    domain/{questionnaire,scoring,importers,report}
    components/           # Stepper, Score/Report card, Upload, ecc.
    pages/{Workbench,Diagnostics}
    store/                # slices questionnaire + workspace
resources/   # assets electron-builder
.demo/       # file esempio da caricare via drag and drop (Excel/PDF)
```

## Prossime wave

1. **Wave 2** – Ingest universo prodotti completo + motore mappatura regole.
2. **Wave 3** – Firma digitale + hash.
3. **Wave 4** – Motore idoneità/adeguatezza avanzato, explainability dettagliata.
