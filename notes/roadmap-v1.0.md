# Roadmap Tecnica – Flussi di sviluppo (v0.1)

> Documento operativo ad **alto livello** per orchestrare i flussi di sviluppo. Strutturato per essere rapidamente estendibile quando arrivano micrologiche, requisiti normativi e nuovi template.

---

## 1) Obiettivi

- Calcolo **profilo/score di rischio (0–100)** e **classe**.

- Proposta **strumenti/linee** coerenti con profilo, orizzonte e conoscenza (idoneità/adeguatezza **TBD**).

- Operatività **offline**, nessuna persistenza non esplicita.

- **Report PDF** firmato + **hash** e **PDF domande**.

- Questionario **configurabile da JSON** **pre‑build** (versionato).

---

## 2) Principi & convenzioni

- Determinismo: a parità di input → stesso output (versioni fissate).

- Separation of concerns: **UI** / **Dominio** / **Adapter I/O** / **Shell**.

- Versioning stretto: `questionsSchema`, `templateExcelKYC`, `templateExcelProdotti`, `scoringEngine`.

- Offline by design: nessuna rete; librerie compatibili; no cache disco.

---

## 3) Roadmap per **wave**

### Wave 0 – Bootstrap & fondazioni

**Flussi**

- Repository base (Electron + Vite + React).

- Thema UI provvisorio (Ant Design) + layout stepper.

- Tooling: ESLint/Prettier, Husky, commitlint, CI build.

- Scheletri moduli dominio: `scoring-engine`, `suitability-engine` (stub), `mapping-engine`, `validators`.

- Gestione **JSON questionario pre‑build**: loader + validazione schema (Zod).  
  **Artefatti**: struttura repo, pipeline CI, bozza schema JSON `v1`.  
  **Exit**: app parte, stepper navigabile, validazione base JSON.

### Wave 1 – MVP flussi core

**RF coperti**: ingest (Excel/UI), scoring base, grafici essenziali, export PDF (senza firma).  
**Flussi**

- Ingest **Excel KYC** (Template v1) → parser + validator.

- Stepper UI generato da **JSON** (campi/validazioni base).

- **Scoring base**: calcolo score (0–100) + classe + volatilità (placeholder formule).

- Grafici: gauge score, barre composizione **TBD**.

- Export **PDF Report** + **PDF Domande** (no firma) con metadati versione.  
  **Test**

- Unit parser/validator.

- Unit scoring (test di monotonicità/soglie di esempio).

- Integrazione ingest→report con **mock A/B**.  
  **Exit**: caricando i mock A/B, si ottiene score/classe e PDF.

### Wave 1.1 – Import PDF & hardening

**Flussi**

- Import **PDF questionario** (layout di base) → precompilazione stepper.

- UX errori/rollback step, stati vuoti, edge cases.

- Migliorie performance parsing.  
  **Exit**: percorso PDF→UI funziona sui mock di esempio.

### Wave 2 – Universo prodotti & mappatura

**Flussi**

- Ingest **Excel Prodotti** (Template v1) con categorie/sottocategorie.

- **Mapping engine**: classe rischio → categorie ammesse (tabella regole **TBD**).

- Regole **vincolo orizzonte** e **conoscenza minima** (warning/idoneità **TBD**).

- Anteprima proposta: lista strumenti per classe, motivazioni base.  
  **Test**

- Unit mapping/filtri.

- Integrazione con mock prodotti **A/B** (categorie diverse).  
  **Exit**: proposta coerente per profili conservativo/dinamico (mock).

### Wave 3 – Firma digitale & hash

**Flussi**

- Scelta libreria firma **offline** (compatibilità reader PDF **TBD**).

- Gestione certificato locale (P12, password runtime, no persistenza).

- **Hash** (es. SHA‑256) nel report + file manifest opzionale.  
  **Exit**: export produce **PDF firmato** + **hash** verificabile.

### Wave 4 – Idoneità/adeguatezza (MiFID) & explainability

**Flussi**

- **Suitability engine**: regole (DSL/tabellare **TBD**) per esclusioni/alert.

- Messaggi di **motivazione** (perché incluso/escluso).

- Tracciamento versioni regole nel PDF.  
  **Exit**: proposta con motivazioni e warning normativi di base.

### Wave 5 – Hardening, accessibilità, packaging

**Flussi**

- Accessibilità (focus/labels/contrasto **TBD**).

- Performance UI/scoring; ottimizzazione bundle.

- Packaging (electron‑builder) + firma del codice (OS **TBD**).

- Policy **no‑network** e audit dipendenze.  
  **Exit**: build distributiva firma‑ready.

---

## 4) Flussi trasversali (sempre attivi)

- **Versioning**: bump sincrono di `questionsSchema`, `templateExcelKYC`, `templateExcelProdotti`, `scoringEngine`.

- **Mock & dati di test**: mantenimento mock **A** (conservativo) e **B** (dinamico), + casistica per **categorie**.

- **Quality**: code review, test unit/integration/snapshot, golden files PDF.

- **Security/Privacy**: no egress, scrub temporanei, log redatti.

- **DX**: CLI per validare template/mocks e generare report diagnostici.

---

## 5) Deliverable per flusso (checklist minimale)

**Ingest Excel KYC**

- Schema `v1` definito + validator Zod

- Parser con errori localizzati

- Mapping → modello dominio

**Stepper UI da JSON**

- Loader compile‑time + type‑safe

- Renderer component‑based (input, select, percent, ecc.)

- Validazioni inline + focus errori

**Scoring engine**

- API pura `calcScore(inputs)`

- Pesi/regole **TBD** separati dal codice

- Test proprietà (limiti/monotonicità)

**Prodotti & mappatura**

- Parser Template Prodotti `v1`

- Tabella regole classe→categorie

- Filtri orizzonte/conoscenza

**Export PDF**

- Report + Domande, metadati versioni

- Firma + Hash (Wave 3)

**Import PDF**

- Estrazione campi base

- Precompilazione stepper

---

## 6) Dipendenze & rischi

- **Firma digitale**: compatibilità viewer; gestione certificati.

- **Parsing PDF**: variabilità layout/OCR.

- **Version skew**: disallineamento tra JSON/engine/template.

- **Zero‑persistence**: librerie che creano cache.  
  **Mitigazioni**: validazione bloccante in CI, golden files, controllo dipendenze.

---

## 7) Criteri di accettazione (per wave)

- **Wave 1**: con mock A/B si ottengono score, classe, PDF senza firma. UI navigabile.

- **Wave 2**: proposta strumenti coerente; warning su orizzonte/conoscenza.

- **Wave 3**: PDF firmato + hash verificabile offline.

- **Wave 4**: motivazioni idoneità/adeguatezza visibili in UI e nel PDF.

---

## 8) Backlog **TBD** (micrologiche)

- Pesi e normalizzazioni scoring; bande classe.

- DSL/tabella regole idoneità + priorità conflitti.

- Mappa dettagliata classe→categorie/strumenti.

- Accessibilità target e benchmark performance.

- Linee guida tema proprietario.
