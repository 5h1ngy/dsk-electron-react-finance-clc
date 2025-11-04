# DSK Finance CLC ⚡️🏦  
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=nodedotjs&logoColor=white)](#prerequisiti) [![Electron](https://img.shields.io/badge/electron-38.3.0-47848f?logo=electron&logoColor=white)](#stack-tecnico) [![React](https://img.shields.io/badge/react-19-61dafb?logo=react&logoColor=20232a)](#stack-tecnico) [![License](https://img.shields.io/badge/license-proprietary-red)](#licenza)  

> Workbench offline per team finance/consulenti: importa questionari Excel/PDF, calcola il profilo di rischio, genera proposte strumenti e firma digitalmente i PDF direttamente sul dispositivo.

![Workbench preview](assets/screen-1.png)

---

## 📚 Indice

1. [Panoramica](#panoramica)
2. [Caratteristiche principali](#caratteristiche-principali)
3. [Stack tecnico](#stack-tecnico)
4. [Architettura e directory](#architettura-e-directory)
5. [Prerequisiti](#prerequisiti)
6. [Setup & Comandi](#setup--comandi)
7. [Packaging & Distribuzione](#packaging--distribuzione)
8. [Testing & Qualità](#testing--qualità)
9. [Configurazioni chiave](#configurazioni-chiave)
10. [Sicurezza & Hardening](#sicurezza--hardening)
11. [Troubleshooting](#troubleshooting)
12. [Roadmap & Wave future](#roadmap--wave-future)
13. [Team & Credits](#team--credits)
14. [Licenza](#licenza)

---

## 🧭 Panoramica

**DSK Finance CLC** (Client Lifecycle Companion) è un’app Electron pensata per funzionare *interamente offline* su workstation di filiale. Permette di:

- Precompilare questionari da Excel o PDF.
- Eseguire il calcolo del profilo rischio con motore deterministico.
- Suggerire strumenti coerenti con il profilo.
- Generare e firmare digitalmente report PDF con certificati P12/PFX caricati runtime.
- Ottenere diagnostica locale (stato health, import recenti, hash firma, metadati certificato).

---

## ✨ Caratteristiche principali

- **Questionnaire Engine dinamico** – schema JSON validato via Zod, React Hook Form + Zod Resolver, calcolo progress e blocking sugli step incompleti.
- **Import multipli** – Excel (Richieste + Universo prodotti) e PDF (pattern `id: valore`). Parser dedicati negli *engines* con suite di test.
- **Firma digitale integrata** – `node-signpdf`, generazione hash SHA-256 e manifest JSON; prompt password certificato e salvataggio file ausiliari vicino al PDF.
- **Consistenza UX** – Ant Design 5, layout responsive, card informative (schema summary, sezione completamento, certificate card, score card, suggested products).
- **Redux Toolkit** – slices per questionnaire, workspace e productUniverse, selectors ottimizzati, type-safe hooks.
- **Electron Hardening** – CSP dinamica, blocco richieste in packaging, contextual logging, preload bridge tipizzato e suppression delle noisy DevTools Autofill logs.
- **Testing completo** – Jest + Testing Library su engines, servizi main, IPC, hooks, componenti e slices. Oltre 100 test per garantire affidabilità offline.

---

## 🧱 Stack tecnico

| Layer        | Tecnologie principali |
|--------------|-----------------------|
| Main process | Electron 38, TypeScript strict, custom logger, IPC health/report, `node-signpdf` |
| Preload      | ContextBridge isolato, API tipizzate (`window.api.health/report`) |
| Renderer     | React 19, Ant Design 5, Redux Toolkit, React Hook Form + Zod, React Router 6 |
| Engines      | Moduli standalone per questionnaire, scoring, importers, mapping, signature, report |
| Tooling      | electron-vite, ESLint 9, Prettier 3, Jest 29 (node + jsdom), TS 5.7 |

---

## 🗂 Architettura e directory

```
├── assets/                  # Screenshot & risorse marketing
├── build/                   # Icon/entitlements per electron-builder
├── engines/
│   ├── importers/           # Excel/PDF parser dedicati
│   ├── mapping/             # Matching prodotti ↔ classi rischio
│   ├── questionnaire/       # Schema + normalizzazione
│   ├── report/              # Generazione PDF + metadata
│   └── signature/           # Helpers certificati/byte utils
├── packages/
│   ├── main/                # Bootstrap Electron, logger, security, IPC
│   ├── preload/             # Bridge tipizzato
│   └── renderer/            # App React/Ant Design, store, pagine
└── resources/               # Risorse extra per packaging
```

---

## 🔧 Prerequisiti

- Node.js ≥ 18
- npm ≥ 10
- Windows 10/11 (per build/test finale); dev funzionante anche su macOS/Linux.
- Certificato P12/PFX per provare la firma (facoltativo ma consigliato).

---

## 🚀 Setup & Comandi

```bash
npm install                # installa dipendenze
npm run dev                # avvia electron-vite (main + preload + renderer)
npm run lint               # ESLint 9
npm run format             # Prettier 3
npm run typecheck          # TS node + web
npm test                   # Jest (node + jsdom)
```

Scripts utili:

| Script             | Descrizione                                                |
|--------------------|------------------------------------------------------------|
| `npm run start`    | Preview electron-vite (renderer bundlato)                  |
| `npm run build`    | Compila main/preload/renderer senza creare installer       |
| `npm run build:win`| Build completa + `electron-builder` target Windows portable|
| `npm run build:unpack` | Genera cartella portabile (`--dir`)                    |
| `npm run test:watch`  | Jest watch mode                                          |

---

## 📦 Packaging & Distribuzione

- **Portable EXE** (default): `npm run build:win` produce `dist/dsk-finance-clc-<version>-portable.exe`, unico file pronto all’uso senza installazione.
- Config builder (`electron-builder.yml`):
  - `productName`: **DSK Finance CLC**
  - `appId`: `com.dsk.finance.clc`
  - Feed `publish`: `https://updates.dsk-finance-clc.local` (placeholder per update offline).
  - Target extra (AppImage/Snap/Deb/DMG) già predisposti per rollout futuri.

---

## ✅ Testing & Qualità

- **Jest + Testing Library** per componenti React, hooks, slices Redux, engines e servizi node.
- **100+ test** (rendering, import, mapping, security hooks, IPC).
- **ESLint 9** (React + Hooks + Refresh rules) e **Prettier 3** integrati nello script `build`.
- **TypeScript strict** su tutti i package (node/web), inclusi path alias condivisi.

---

## ⚙️ Configurazioni chiave

- `packages/renderer/src/config/questionnaire.json` – schema questionario ingestito e normalizzato.
- `packages/renderer/src/config/versions.ts` – versione motore scoring/report esposta nei PDF.
- `packages/main/src/config/logger.ts` – logger centralizzato con formattazione colori, suppress warning DevTools.
- `electron-builder.yml` – personalizzazione packaging (icona, target, update feed, portable).

---

## 🛡 Sicurezza & Hardening

- CSP dinamica per dev/prod (`buildContentSecurityPolicy`).
- Network blocker su `webRequest` (consenti solo `file://` e dev server in sviluppo).
- `contextIsolation` + Preload ridotto all’essenziale, API tipizzate con `health` e `report`.
- Sanitizzazione certificati e password in memoria (mai salvate su disco).
- Modalità offline completa: nessuna dipendenza runtime da servizi esterni.

---

## 🆘 Troubleshooting

| Problema | Possibile soluzione |
|----------|---------------------|
| `Autofill.enable failed` in console DevTools | Già soppresso dal logger; nessun impatto. |
| Build Windows fallisce per file mancanti | Assicurati che `dist/` sia pulita; `npm run build:win` rigenera tutto. |
| PDF non firmato | Verifica password certificato e che il file `.p12` sia caricato (Card certificato). |
| Import Excel fallisce | Gli header devono contenere gli ID domanda (questionario) o chiavi categoria/prodotto coerenti. |

---

## 🗺 Roadmap & Wave future

1. **Wave 4** – Motore adeguatezza/idoneità avanzato + explainability.
2. **Wave 5** – Hardening enterprise: code signing ufficiale, auto-update in DMZ, accessibility AA.
3. **Wave 6** – Supporto multi-utenza locale, audit trail e cifratura storage temporaneo.

---

## 👥 Team & Credits

- **DSK Digital Lab** – Product ownership & UX.
- **Engineering** – Contributors multipli su main/preload/renderer/engines.
- Tooling open-source: Electron, React, Ant Design, Redux Toolkit, Zod, Jest.

---

## 📄 Licenza

Progetto proprietario – tutti i diritti riservati a DSK Digital Lab. Contattare il team per accordi di utilizzo o distribuzione.

---

Buon lavoro con **DSK Finance CLC**! 💼📈 Per richieste evolutive o supporto, apri una issue o contatta direttamente il team. 
