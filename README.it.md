# 🚀 Generatore di Template AI

![Logo del Progetto](https://via.placeholder.com/150x50?text=AI+Template+Generator)

---

## 📑 Indice

- [Panoramica](#panoramica)
- [Caratteristiche](#caratteristiche)
- [Come Funziona](#come-funziona)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Configurazione](#configurazione-token-hugging-face)
- [Tecnologie Supportate](#tecnologie-supportate)
- [Esempio di Output](#esempio-di-output)
- [Contributi](#contributi)
- [Licenza](#licenza)

---

## 🧠 Panoramica

**Generatore di Template AI** è uno strumento CLI avanzato che ti aiuta a creare progetti web moderni utilizzando le tue tecnologie frontend e backend preferite. Grazie a OpenAI, genera strutture di progetto e Dockerfile su misura, rendendo la configurazione semplice e pronta per la produzione.

---

## ✨ Caratteristiche

- Prompt interattivi nel terminale con opzioni flessibili:
  - Seleziona solo frontend, solo backend o full-stack
  - Ampia scelta di framework frontend: React, Vue, Angular con versioni specifiche
  - Ampia scelta di framework backend: Node.js, PHP, Python con implementazioni specifiche
  - Integrazione con framework CSS come Bootstrap, Tailwind e altri
- Utilizza l'API di Hugging Face per generare codice e Dockerfile
- Crea automaticamente cartelle e file di progetto
- Documentazione elegante e bilingue (EN/IT)
- Esempi di output per riferimento rapido

---

## ⚙️ Come Funziona

1. Avvia lo strumento CLI nel terminale.
2. Scegli il tipo di progetto: frontend, backend o full-stack.
3. Seleziona le tecnologie specifiche (framework frontend/backend, versioni, CSS).
4. Inserisci il percorso di destinazione per il tuo progetto.
5. Conferma le tue scelte.
6. Inserisci il tuo token Hugging Face (se non già configurato).
7. L'AI genera la struttura del progetto, Dockerfile e tutte le configurazioni.
8. I file vengono salvati nel percorso specificato, pronti per lo sviluppo!

---

## 🛠️ Installazione

```bash
# Clona il repository
git clone https://github.com/yourusername/ai-template-generator.git
cd ai-template-generator

# Genera automaticamente il file package.json (se non presente)
npm init -y

# Installa le dipendenze necessarie
npm install inquirer axios
```

---

## ▶️ Utilizzo

```bash
node index.js
```

Segui i prompt per:

- Selezionare le tecnologie
- Scegliere un percorso di destinazione per il tuo progetto
- Fornire il tuo token Hugging Face

Il tuo progetto sarà generato nel percorso che specifichi, mantenendo pulita la repository del generatore.

---

## 🔑 Configurazione (Token Hugging Face)

Puoi configurare il tuo token Hugging Face in tre modi:

1. **Usando un file .env** (consigliato):

   ```
   # Crea un file .env nella cartella principale
   HF_TOKEN=il-tuo-token-qui
   ```

   Lo script caricherà automaticamente questo token all'avvio.

2. **Come variabile d'ambiente**:

   ```bash
   export HF_TOKEN=il-tuo-token-qui
   ```

3. **Inserendolo quando richiesto dalla CLI**:

   Quando inserisci il tuo token tramite la CLI, ti verrà chiesto se desideri salvarlo nel file `.env` per utilizzi futuri. Se scegli di farlo, il token sarà salvato automaticamente e caricato per le successive esecuzioni.

---

## 🧩 Tecnologie Supportate

- **Frontend**:
  - React: Base, React + Vite, Next.js, Create React App
  - Vue: Vue 3, Vue 2, Vue + Vite, Nuxt.js
  - Angular: Angular CLI, Angular + Standalone Components
- **Backend**:
  - Node.js: Express, Koa, Fastify, NestJS
  - PHP: Laravel, PHP Base, Symfony, Slim
  - Python: Django, Flask, FastAPI
- **Framework CSS**:
  - Bootstrap
  - Tailwind CSS
  - Material UI
  - Bulma

---

## 📦 Esempio di Output

```
/ai-template-project
├── frontend/
│   └── file [React|Angular|Vue]
├── backend/
│   └── file [Node.js|Express|Laravel]
├── docker/
│   └── Dockerfile
└── README.md
```

---

## 🤝 Contributi

Contributi benvenuti! Apri una issue o invia una pull request per miglioramenti, traduzioni o nuove funzionalità.

---

## 📄 Licenza

Licenza MIT. Vedi [LICENSE](LICENSE) per dettagli.

---

> Creato con ❤️ da Filippo Falcone
