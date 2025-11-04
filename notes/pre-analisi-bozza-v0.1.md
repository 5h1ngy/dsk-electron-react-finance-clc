## Descrizione generica black box

Il seguente software deve occuparsi di raccogliere una serie di dati, o partendo da un file oppure inserendoli manualmente attraverso un apposita interfaccia, elaborarli per fornire dei grafici e successivamente scariscarli in un apposito formato

## Features

Dunque qui di sotto troviamo le features suddivise per blocchi

`Architettura`

- L'applicativo deve essere desktop. Nella fase iniziale deve essere supportato per windows.

- L'applicativo deve essere totalmente offline.

- L'applicativo non deve inviare alcun dato a nessun server, e non deve salvare internamente nessuna informzione.

- L'applicativo non deve avere alcun tipo di funzionalita' di autenticazione o gestione degli account.

`Formati, strutture input e output`

- L'applicativo deve accettare in input un file excel formattato secondo un formato custom ben definito, oppure e' possibile selezionare la modalita' di inserimento tramite apposito ui, dove sara' presente uno stepper di input form che andra' a sostituire la fase di caricamento dell'excel.

- L'applicativo puo accettare in input un pdf con le domande inserite precedentemente e andare direttament allo stepper form con i dati caricati e inseriti nello step form dal pdf.

- L'applicativo genera in output un pdf firmato digitalmente con anche un apposito hashing per verificare la validita'. Inoltre vi e' la generazione di un secondo pdf con la copia di tutte le domande inserite.

`Elaborazione dati e visualizzazione intermedia`

- casi iniziali:
  
  - abbiamo un excel con delle domande che vengono parsate
  
  - abbiamo un inserimento manuale tramite step form delle stesso domande presenti sull'excel.

- successivamente vi e' uno step intermedio dove viene calcolata la classe di rischio con un numero da 0 a 100. Numero non intero. Tale classe ha una volatilita' associata.

- Successivamente viene visualizzato il tutto lato ui con appositi grafici.

- Dopo vi e' un altro step dove viene preso in input un altro excel con le linee di investimento, la quale viene associata alla classe di rischio precedentemente calcolata.

- Nell'ultimo step viene interpolato il tutto:
  
  - dati del cliente
  
  - classe di rischio
  
  - portafoglio consigliato

- Nella fase finale viene generato il pdf con i dati interpolati correttamente. In piu viene generato un secondo pdf con la copia di tutte le domande compilate dall'utente.

## Mocking

[...]

## Stack Tecnologico

Di seguito le tecnologie adottate per tale prodotto:

- NodeJs per la comunicazione low-level con le API del Kernel

- Electron: sviluppo cross-platform senza riscrivere il codice

- Vitejs: bundler da interpolare con electron. 

*Eseguire un fork dal progetto: dsk-electron-react-project-manager, per velocizzare le tempistiche di bootstrap*

- React: libreria pe virtualizzare il DOM e costruire la UI

- Ant-Design: libreria grafica (*da cambiare con quella proprietaria nella fase di estensione del prodotto*)

- React-Hook-Form: Creazione delle form interattive

- Zod: schema validator per semplificare

- ChartJs (react): per visualizzare i grafici
