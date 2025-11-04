# Analisi – Suite offline per **profilazione rischio** e **proposta strumenti d’investimento** (bozza strutturale v0.2)

> **Scopo di questa bozza**: fornire una struttura chiara, estendibile e leggera per un software **finanziario** offline che calcola il **profilo di rischio** del cliente e propone **strumenti/linee d’investimento** coerenti. Le micrologiche e i dettagli normativi verranno inseriti quando disponibili. Segnaposto: **TBD/WIP**.

---

## 1) Visione e scopo (black box)

Il software gira **offline** su desktop (**Windows** fase 1). L’utente:

- **Inserisce dati**: da **Excel** (template proprietario), da **stepper UI**, oppure da **PDF** (import domande già compilate).

- **Configura il questionario**: domande **da JSON versionato** **incluso pre‑build** (nessuna modifica runtime in produzione).

- **Ottiene calcoli**: **punteggio rischio 0–100** (float), **classe di rischio**, **volatilità** e indicatori **TBD** (es. orizzonte, capacità di perdita, conoscenza/esperienza).

- **Riceve suggerimenti**: **mappatura** verso **linee/strumenti** coerenti (idoneità/adeguatezza **TBD**).

- **Esporta**: **PDF firmato digitalmente** + **hash** di verifica; **PDF domande**.

> Black‑box: input cliente → calcolo profilo → proposta strumenti → PDF. Nessun dato inviato a server e nessuna persistenza non esplicita.

---

## 2) Principi guida (finanza)

- **Conformità**: allineamento a requisiti **MiFID II/IDD** e policy interne (**TBD** ambito/interpretazioni).

- **Trasparenza**: motivazioni di idoneità/criticità spiegabili all’utente (**explainability** **TBD**).

- **Determinismo**: a parità di input, stesso output (versione motore fissata).

- **Minimo privilegio**: dati in RAM, nessuna rete, firma locale.

---

## 3) Ambito e non‑ambito

**In scope (MVP):**

- Raccolta KYC/questionario (Excel/UI/PDF) + **questionario da JSON pre‑build**.

- Calcolo **score** e **classe di rischio** + **volatilità**.

- Import **Excel linee/strumenti** e **mappatura** per classe di rischio.

- Reportistica: **PDF report** + **PDF domande**, firma+hash.

**Out of scope (MVP):**

- Acquisizione **dati di mercato** in tempo reale; pricing; ottimizzazioni mean‑variance.

- Account multiutente, autenticazione, sync cloud.

- Storage locale non esplicito.

---

## 4) Requisiti funzionali (alto livello)

### RF1 – Ingest dati

- RF1.1 **Excel KYC/Questionario** conforme a **Template v1** (**TBD** schema/versione).

- RF1.2 **Stepper UI** equivalente semantico al template Excel.

- RF1.3 **Import da PDF** → precompilazione stepper (**TBD** layout/OCR).

- RF1.4 **Questionario da JSON** (**versionato, incluso pre‑build**): genera dinamicamente campi, testi, vincoli (**TBD** schema e compatibilità).

### RF2 – Calcolo profilo

- RF2.1 **Parsing/validazione** (Excel/PDF/UI/JSON) con feedback.

- RF2.2 **Score rischio (0–100)** non intero, **classe** e **volatilità associata**; componenti **TBD** (tolleranza al rischio, orizzonte, capacità di perdita, esperienza, obiettivi).

- RF2.3 **Consistenze MiFID** (es. warning adeguatezza/appropriatezza) **TBD**.

- RF2.4 **Visualizzazioni** intermedie (gauge, barre, alert).

### RF3 – Strumenti e idoneità

- RF3.1 Import **Excel linee/strumenti** (universo prodotti) **v1**: metadati (ISIN/codice, categoria, banda rischio, vincoli) **TBD**.

- RF3.2 **Mappatura** strumenti ↔ **classe di rischio** (regole **TBD**, tabella configurabile).

- RF3.3 **Regole di esclusione** (es. orizzonte insufficiente, conoscenza/esperienza) + messaggi di **motivo**.

### RF4 – Proposta e output

- RF4.1 **Portafoglio consigliato**: combinazione linee/strumenti per classe **TBD** (pesi, minimi, arrotondamenti).

- RF4.2 **Anteprima**: riepilogo dati cliente, score/classe, warning, proposta.

- RF4.3 **Export**: **PDF firmato+hash** e **PDF domande**; inclusi motivi di idoneità/alert.

---

## 5) Requisiti non funzionali

- **Piattaforma**: Desktop **Windows** (fase 1). Estensioni cross‑platform **TBD**.

- **Offline by design**: nessuna rete; dipendenze librerie compatibili.

- **Zero‑persistence**: dati solo in RAM; salvataggio solo dei PDF scelti dall’utente.

- **Performance**: tempi target **TBD**; dimensione file massime **TBD**.

- **Usabilità**: stepper chiaro, annulla/torna, errori leggibili.

- **Accessibilità**: requisiti **TBD**.

- **Sicurezza locale**: nessuna cache; gestione sicura del certificato di firma.

- **Tracciabilità**: numeri di versione (motore/scoring/questionario JSON) nel PDF.

---

## 6) Flusso utente (bozza)

1. **Start**: scelta modalità (Excel / Manuale / Import PDF).

2. **Anagrafica & KYC**.

3. **Questionario**: generato dal **JSON pre‑build** (validazioni inline).

4. **Calcolo**: score 0–100, classe, volatilità; eventuali **warning**.

5. **Linee/Strumenti**: upload Excel universo prodotti; **mappatura** per classe e vincoli.

6. **Anteprima report**: motivazioni, eventuali esclusioni, portafoglio consigliato.

7. **Esporta**: PDF **Report** (firmato+hash) + PDF **Domande**.

---

## 7) Dati, formati e versioning

- **JSON Questionario (compile‑time)**: versione (es. `questionsSchema: v1`), sezione/i, campi, tipi, regole, pesi **TBD**. Incluso nel **bundle**; modifiche → **nuova build**.

- **Excel KYC/Questionario (Template v1)**: fogli/colonne **TBD**; campo versione obbligatorio.

- **Excel Universo Prodotti (v1)**: colonne **TBD** (ID/ISIN, categoria, banda rischio, vincoli, minimi, costi opzionali).

- **PDF Import**: layout/OCR **TBD**.

- **Output PDF**: report + domande; **firma digitale locale** (certificato utente **TBD**); **hash** (es. SHA‑256 **TBD**) riportato nel documento.

---

## 8) Visualizzazioni

- **Gauge score rischio** (0–100) + **classe**.

- **Volatilità** (valore + banda **TBD**).

- **Allocazione proposta** (torta/barre) per categoria.

- **Alert** (es. orizzonte vs strumento, conoscenza insufficiente).

---

## 9) Architettura logica

- **UI (React + Ant Design → tema proprietario)**: stepper, form, validazioni.

- **Core dominio**:
  
  - **Motore scoring** (funzioni pure; pesi/regole **TBD**).
  
  - **Motore idoneità** (regole, esclusioni, motivazioni **TBD**).
  
  - **Motore mappatura** classe→strumenti/linee (tabella regole **TBD**).
  
  - **Parser/validator** Excel/PDF/JSON (Zod o eq.).

- **Adapter I/O**: import Excel/PDF, export PDF + **firma/hash**.

- **Shell Electron**: process main/renderer, IPC minimo, policy no‑network.

> Separazione presentazione/dominio; dipendenze incapsulate; funzioni deterministiche.

---

## 10) Sicurezza & privacy (offline‑first)

- **No egress**: blocco esplicito rete (policy **TBD**).

- **Credenziali firma** richieste solo all’export; non memorizzate.

- **Log tecnici** senza dati personali; livello/rotazione **TBD**.

---

## 11) Mocking & testing

- **Fixture**: Excel validi/errati, PDF esempio, **JSON questionario** varianti.

- **Unit**: parser, scoring, regole idoneità, mappatura.

- **Integrazione**: pipeline ingest→report; **golden files** PDF.

- **Proprietà**: test di **monotonicità**/**limiti** sullo score.

- **CI**: lint e **validazione schema JSON**; version pin.

---

## 12) Stack tecnologico (attuale + placeholder)

- **Node.js**, **Electron**, **Vite**.

- **React**, **Ant‑Design** (temporaneo → tema proprietario), **React‑Hook‑Form**, **Zod**.

- **Chart.js (React)** per grafici.

- **Excel/PDF**: librerie **TBD** (es. `xlsx`, `pdf-lib`/`PDFKit`, OCR opz. **TBD**).

- **Firma/Hash**: librerie **TBD** (es. `node‑forge`/integrazione OS); packaging/firma codice **TBD**.

- **Bootstrap**: fork `dsk-electron-react-project-manager`.

---

## 13) Roadmap (MVP → estensioni)

1. **v0 – MVP**: ingest Excel/UI, scoring base, grafici essenziali, export PDF (senza firma) **WIP**.

2. **v1**: firma digitale + hash; import PDF; mappatura strumenti completa; tema UI proprietario; tooling CI per JSON questionario.

3. **v2**: regole idoneità avanzate (orizzonte/capacità perdita/esperienza), accessibilità, performance; estensioni piattaforma.

4. **v3**: scenari **what‑if** (TBD, sempre offline), cifratura opzionale dei PDF.

---

## 14) Rischi e dipendenze

- **Firma digitale**: requisiti legali/locali; compatibilità reader PDF **TBD**.

- **Parsing PDF/OCR**: variabilità layout.

- **Zero‑persistence**: librerie che creano cache.

- **Version skew**: JSON questionario / motore / template Excel non allineati.

- **Mappatura strumenti**: qualità/completezza universo prodotti.

---

## 15) Criteri di accettazione (esempi)

- A parità di input (Excel/UI/JSON), **stesso score/classe** e **stessi suggerimenti**.

- Caricando Excel KYC **v1**, lo stepper mostra dati equivalenti.

- Upload universo prodotti genera **proposta coerente** con la classe; esclusioni motivate.

- Export genera **2 PDF** nella cartella scelta: **Report firmato+hash** e **Domande**; riportati versione motore e hash.

- Nessuna traccia residua sul disco oltre ai PDF esplicitamente salvati.

---

## 16) Glossario

- **KYC**: conoscenza del cliente.

- **Score/Classe di rischio**: indicatore continuo 0–100 + classe discreta.

- **Capacità di perdita**: sopportazione perdite senza impatti critici.

- **Idoneità/Adeguatezza**: coerenza strumento ↔ profilo/obiettivi/conoscenza.

- **Universo prodotti**: insieme linee/strumenti importati da Excel.

---

### Aree aperte (TBD)

- Micrologiche scoring: formule/pesi/normalizzazioni/edge cases.

- Regole idoneità: DSL/forma tabellare, priorità, motivazioni.

- Schemi dettagliati: **JSON questionario**, **Excel KYC**, **Excel prodotti**.

- Specifiche firma digitale/hash e requisiti di conservazione.

- Limiti prestazionali e UX/accessibilità definitive.
