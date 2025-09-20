# 🚀 Generatore di Template Docker AI

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Docker](https://img.shields.io/badge/Docker-Richiesto-blue.svg)
![Versione](https://img.shields.io/badge/Versione-2.0.0-blue.svg)
![Licenza](https://img.shields.io/badge/Licenza-MIT-yellow.svg)

---

## 📑 Indice

- [Panoramica](#panoramica)
- [Caratteristiche](#caratteristiche)
- [Architettura](#architettura)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Configurazione](#configurazione)
- [Tecnologie Supportate](#tecnologie-supportate)
- [Struttura del Progetto](#struttura-del-progetto)
- [Sistema di Logging](#sistema-di-logging)
- [Contributi](#contributi)
- [Licenza](#licenza)

---

## 🧠 Panoramica

**Generatore di Template Docker AI** è uno strumento CLI intelligente che crea progetti web pronti per la produzione con integrazione Docker. Alimentato da Google Gemini AI, genera strutture di progetto complete, configurazioni e Dockerfile basati sulle tue preferenze tecnologiche.

### Vantaggi Principali:

- 🐳 **Approccio Docker-first** - Tutto containerizzato fin dall'inizio
- 🤖 **Generazione alimentata da AI** - Strutture e configurazioni di progetto intelligenti
- 🎯 **Compatibilità tecnologica** - Raccomandazioni intelligenti per backend
- 📁 **Architettura pulita** - Codebase modulare e manutenibile
- 🔍 **Auto-validazione** - Controlli di qualità e correzioni integrati

---

## ✨ Caratteristiche

### 🎛️ **Esperienza CLI Interattiva**

- Selezione tecnologica intelligente con raccomandazioni di compatibilità
- Interfaccia pulita e user-friendly con rumore minimo
- Supporto per navigazione indietro e modifica configurazione

### 🏗️ **Tipi di Progetto Supportati**

- **Solo Frontend**: Vue, React, Angular con tooling moderno
- **Solo Backend**: Laravel, Express, NestJS con best practices
- **Full Stack**: Combinazioni intelligenti frontend-backend

### 🧠 **Generazione Alimentata da AI**

- Scaffolding completo del progetto seguendo convenzioni ufficiali
- Configurazioni Docker pronte per la produzione
- Auto-correzione di errori comuni
- Validazione e garanzia di qualità

### 📊 **Logging Avanzato**

- Log dettagliati di generazione per debugging
- Interfaccia utente pulita senza rumore tecnico
- Tracciamento e reporting completo degli errori

---

## 🏛️ Architettura

```
ia-docker-template-generator/
├── scripts/
│   ├── cli/                    # Moduli di interazione utente
│   │   ├── userPreferences.js  # Logica di selezione tecnologie
│   │   └── apiKeyManager.js    # Gestione chiavi API
│   ├── generators/             # Moduli di generazione AI
│   │   ├── projectGenerator.js # Orchestratore principale
│   │   └── promptBuilder.js    # Costruzione prompt AI
│   ├── validators/             # Garanzia di qualità
│   │   ├── postGenerationValidator.js
│   │   ├── projectValidator.js
│   │   └── autoCorrector.js
│   └── utils/                  # Moduli utility
│       └── logger.js           # Sistema di logging
├── logs/                       # File di log generati
├── index.js                    # Punto di ingresso principale
└── package.json               # Dipendenze e script
```

### 🔧 **Design Modulare**

- **Separazione dei Concern**: Ogni modulo gestisce una responsabilità specifica
- **Interfacce Pulite**: API ben definite tra componenti
- **Testabilità**: Moduli isolati per test facili
- **Manutenibilità**: Organizzazione e documentazione del codice chiare

---

## 🛠️ Installazione

### Prerequisiti

- **Node.js 18+**
- **Chiave API Google Gemini** ([Ottienila qui](https://ai.google.dev/))

### Setup

```bash
# Clona il repository
git clone https://github.com/filippo-falcone/ia-docker-template-generator.git
cd ia-docker-template-generator

# Installa le dipendenze
npm install

# Configura la chiave API (opzionale - puoi anche inserirla quando richiesto)
cp .env.example .env
# Modifica .env e aggiungi la tua GOOGLE_API_KEY
```

---

## ▶️ Utilizzo

### Utilizzo Base

```bash
npm start
# oppure
node index.js
```

### Flusso Interattivo

1. **Dettagli Progetto**: Inserisci nome e posizione del progetto
2. **Tipo di Progetto**: Scegli Frontend, Backend o Full Stack
3. **Selezione Tecnologie**:
   - Seleziona framework frontend (Vue, React, Angular)
   - Scegli framework CSS (Bootstrap, Tailwind, Material UI, ecc.)
   - Seleziona tecnologia backend (Laravel, Express, NestJS) con raccomandazioni intelligenti
4. **Conferma**: Rivedi e conferma la tua configurazione
5. **Generazione**: L'AI crea la struttura completa del tuo progetto

### Raccomandazioni Intelligenti

Quando crei progetti full stack, il sistema raccomanda automaticamente tecnologie backend compatibili:

- **Vue + Bootstrap** → Laravel, Express
- **React + Tailwind** → Express, NestJS
- **Vue + Material UI** → Express, NestJS
- **Angular + Material** → NestJS, Express

---

## � Configurazione

### Setup Chiave API

Puoi configurare la tua chiave API Google Gemini in diversi modi:

1. **File Environment** (raccomandato):

   ```bash
   # File .env
   GOOGLE_API_KEY=la_tua_chiave_api_qui
   # oppure
   GEMINI_API_KEY=la_tua_chiave_api_qui
   ```

2. **Variabile d'Ambiente**:

   ```bash
   export GOOGLE_API_KEY=la_tua_chiave_api_qui
   ```

3. **Prompt Interattivo**: Inserisci quando richiesto (con opzione di salvataggio)

---

## 🧩 Tecnologie Supportate

### Framework Frontend

| Tecnologia  | Varianti                            | Framework CSS                    |
| ----------- | ----------------------------------- | -------------------------------- |
| **Vue.js**  | Vue 3, Vue + Vite, Nuxt.js          | Bootstrap, Tailwind, Material UI |
| **React**   | React (Base), React + Vite, Next.js | Bootstrap, Tailwind, Material UI |
| **Angular** | Angular CLI, Componenti Standalone  | Bootstrap, Angular Material      |

### Framework Backend

| Tecnologia  | Framework       | Ideale Per                            |
| ----------- | --------------- | ------------------------------------- |
| **Node.js** | Express, NestJS | API moderne, progetti TypeScript      |
| **PHP**     | Laravel         | App web tradizionali, sviluppo rapido |

### Integrazione Docker

- **Build multi-stage** per ottimizzazione produzione
- **Health check** per affidabilità dei servizi
- **Volume mapping** per workflow di sviluppo
- **Configurazione Nginx** per routing SPA
- **Integrazione database** con docker-compose

---

## 📁 Struttura del Progetto

### Tipi di Progetto Generati

#### Solo Frontend

```
mia-app-vue/
├── src/
├── public/
├── Dockerfile
├── nginx.conf
├── docker-compose.yml
└── README.md
```

#### Full Stack

```
mia-app-fullstack/
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── app/
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
```

---

## 📊 Sistema di Logging

L'applicazione utilizza un sistema di logging sofisticato che separa l'esperienza utente dai dettagli tecnici:

### Interfaccia Utente

- Output pulito e minimale focalizzato sul progresso
- Messaggi chiari di successo/errore
- Indicatori di progresso per operazioni lunghe

### Log Dettagliati

- **Posizione**: `./logs/generation-TIMESTAMP.log`
- **Contenuto**: Chiamate API, dettagli validazione, stato generazione file
- **Retention**: Mantiene automaticamente gli ultimi 10 file di log

### Livelli di Log

- **INFO**: Informazioni generali sulle operazioni
- **WARN**: Problemi e avvisi non critici
- **ERROR**: Fallimenti e problemi critici
- **DEBUG**: Informazioni tecniche dettagliate

---

## 🤝 Contributi

Accogliamo contributi! Segui queste linee guida:

### Setup di Sviluppo

```bash
# Fai fork e clona il repository
git clone https://github.com/TUO_USERNAME/ia-docker-template-generator.git
cd ia-docker-template-generator

# Installa le dipendenze
npm install

# Crea un branch per la feature
git checkout -b feature/nome-tua-feature
```

### Stile del Codice

- **Commenti**: Bilingue (Inglese/Italiano) per documentazione sviluppatori
- **Messaggi CLI**: Solo inglese per interfaccia utente
- **Modularità**: Mantieni componenti focalizzati e testabili
- **Documentazione**: Aggiorna README per modifiche significative

### Processo Pull Request

1. Assicurati che tutti i test passino
2. Aggiorna la documentazione se necessario
3. Aggiungi descrizione dettagliata delle modifiche
4. Riferisci eventuali issue correlate

---

## 📄 Licenza

Licenza MIT - vedi [LICENSE](LICENSE) per dettagli.

---

## 🆘 Supporto

- **Issues**: [GitHub Issues](https://github.com/filippo-falcone/ia-docker-template-generator/issues)
- **Documentazione**: Questo README e [documentazione tecnica](docs/)
- **Changelog**: Vedi [CHANGELOG.md](docs/CHANGELOG.md) per la cronologia delle versioni
- **Riferimenti Tecnici**: [Guida di Riferimento Framework](docs/FRAMEWORK_REFERENCE_GUIDE.md)
- **Log**: Controlla la directory `./logs/` per log dettagliati delle operazioni

---

> 🚀 **Pronto a costruire progetti incredibili?** Inizia con `npm start`!

Creato con ❤️ da [Filippo Falcone](https://github.com/filippo-falcone) | © 2025
