# Offline Risk Suite - Wave 1

> Electron + React offline workbench focused on ingesting questionari JSON/Excel, calcolare il profilo di rischio e preparare i flussi successivi (linee/strumenti, PDF, firma).

## Novità Wave 1

- **Export PDF**: generazione PDF via `pdf-lib` nel renderer e salvataggio sicuro tramite nuovo IPC `report:export` (dialog di Electron). Pulsante “Esporta PDF” nella card profilo + storico export in Diagnostics.
- **Visualizzazioni**: card “Avanzamento sezioni” con progress di completamento, score card ampliata con stato export e note.
- **Diagnostics potenziata**: mostra anche l’ultimo report prodotto oltre ai file di import.

## Baseline Wave 0

- **Main process** invariato: caricamento `.env`, logger strutturato, hardening sicurezza, IPC `system:health`.
- **Preload bridge** minimale e tipizzato (`window.api.health` + `window.api.report`), pronto a ulteriori estensioni.
- **Renderer Ant Design-first**
  - Layout con header + routing (Workbench, Diagnostics) e health tag live.
  - Store Redux Toolkit con slice `questionnaire` + `workspace`.
  - Questionario dinamico generato da JSON pre-build (`packages/renderer/data/requests_schema.json`) validato via Zod.
  - Motore di scoring deterministico (0-100) con classi rischio/volatilita e rationales placeholder.
  - Import manuale (drag&drop `Upload.Dragger`) per questionario `.xlsx` e universo prodotti.
  - Card riassuntive (schema, punteggio, import) basate esclusivamente su componenti Ant Design (nessun CSS custom).
- **Domain scaffolding**: moduli `questionnaire`, `scoring`, `importers` pronti per essere estesi con motori idoneita/mappatura.
- **Tooling**: electron-vite dev/build, ESLint 9, Prettier 3, TS strict, Jest (node+jsdom) con nuovi test su loader/scoring.

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
  main/      # env + logger + security + IPC (health + report export)
  preload/   # espone window.api.{health,report}
  renderer/
    data/                 # schema JSON compile-time (v1)
    domain/{questionnaire,scoring,importers,report}
    components/           # Stepper, Score/Report card, Upload, ecc.
    pages/{Workbench,Diagnostics}
    store/                # slices questionnaire + workspace
resources/   # assets electron-builder
.demo/       # file esempio da caricare via drag and drop (Excel)
```

## Prossime wave

1. **Wave 2** – Ingest universo prodotti completo + motore mappatura regole.
2. **Wave 3** – Firma digitale + hash.
3. **Wave 4** – Motore idoneita/adeguatezza avanzato, explainability dettagliata.

