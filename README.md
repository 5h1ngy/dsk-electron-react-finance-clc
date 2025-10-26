# DSK Finance CLC ⚡️🏦

> Workbench offline per team finance/consulenti: importa questionari Excel/PDF, calcola il profilo di rischio, genera proposte strumenti e firma digitalmente i PDF direttamente sul dispositivo.

![Workbench preview](assets/screen-1.png)

## ✨ Feature Highlights

- **Profilazione dinamica** – questionario generato via schema JSON validato con Zod, stepper con validazione e calcolo rischio deterministico (classe + banda di volatilità + rationales localizzate).
- **Motore import** – parser Excel per richieste e universo prodotti, estrazione PDF (pattern `id: valore`), sincronizzazione immediata con Redux Toolkit.
- **Firma digitale end-to-end** – upload certificati `.p12/.pfx`, verifica password, estrazione metadati, firma PDF via `node-signpdf` e generazione automatica di hash SHA‑256 e manifest JSON.
- **Suggerimenti strumenti** – mapping risk-class → categorie/bande consentite, deduplicazione per categoria e testo motivazionale localizzato.
- **Diagnostica integrata** – pagina dedicata con stato health IPC, cronologia import/export, certificato attuale e percorsi hash/manifest.
- **Hardening Electron** – CSP dinamica, blocco request in packaging, bridge preload tipizzato (`window.api.health/report`), logging strutturato e suppress dei warning Autofill DevTools.

## 🧩 Architecture Overview

```
packages/
  main/       # logger, sicurezza, IPC health/report, firma + export
  preload/    # bridge contextIsolation con API tipizzate
  renderer/   # React 19 + Ant Design 5, Redux Toolkit store e pagine Workbench/Diagnostics
engines/
  questionnaire, scoring, mapping, importers, report, signature
assets/       # screenshot & risorse builder
resources/    # icon & extra per electron-builder
```

## 🛠️ Quick Start

```bash
npm install
npm run dev          # avvia electron-vite (main + preload + renderer)
npm run lint         # ESLint 9
npm run format       # Prettier 3
npm run typecheck    # TS node + web projects
npm test             # Jest (node + jsdom)
```

## 📦 Packaging & Release

- `npm run build` – compila main/preload/renderer con electron-vite (senza installer).
- `npm run build:win` – build + `electron-builder --win` (NSIS).
- `npm run build:unpack` – produce la cartella portabile (`--dir`).
- Configurazione `electron-builder.yml` aggiornata con `productName` **DSK Finance CLC**, `appId` `com.dsk.finance.clc` e feed generico `https://updates.dsk-finance-clc.local`.

## 🧪 Testing & Quality

- Suite Jest end-to-end per engines, IPC main, preload bridge, hooks React e Redux slices (`packages/**/__tests__`).
- Testing Library per UI (componenti card, stepper, layout, App router).
- ESLint 9 + TypeScript strict, React Hooks lint, Prettier 3.
- `npm run lint` e `npm run typecheck` sono già parte del workflow `build`.

## 🤝 Workflow consigliato

1. `npm run dev` per lavorare sul Workbench/Diagnostics.
2. Aggiungi nuovi import/engine in `packages/engines/*` e connettili tramite Redux slices.
3. Aggiorna gli hook/componenti e coprili con test (`*.test.ts(x)`).
4. Esegui `npm run lint && npm run typecheck && npm test`.
5. Esegui `npm run build:win` (o target OS preferito) per generare l’installer condivisibile.

Buon lavoro con **DSK Finance CLC**! 💼📈 Se hai bisogno di nuove wave (es. explainability adeguatezza, packaging firmato), continua a iterare partendo da questa base.
