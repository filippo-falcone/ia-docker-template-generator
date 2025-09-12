# 🚀 Generatore di Template AI

![Logo del Progetto](https://via.placeholder.com/150x50?text=AI+Template+Generator)

---

## 📑 Indice

- [Panoramica](#panoramica)
- [Caratteristiche](#caratteristiche)
- [Come Funziona](#come-funziona)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Configurazione](#configurazione-chiave-api-openai-etc)
- [Tecnologie Supportate](#tecnologie-supportate)
- [Esempio di Output](#esempio-di-output)
- [Contributi](#contributi)
- [Licenza](#licenza)

---

## 🧠 Panoramica

**Generatore di Template AI** è uno strumento CLI avanzato che ti aiuta a creare progetti web moderni utilizzando le tue tecnologie frontend e backend preferite. Grazie a OpenAI, genera strutture di progetto e Dockerfile su misura, rendendo la configurazione semplice e pronta per la produzione.

---

## ✨ Caratteristiche

- Prompt interattivi nel terminale (scegli frontend & backend)
- Supporta React, Angular, Vue, Node.js, Express, Laravel
- Utilizza l'API di OpenAI per generare codice e Dockerfile
- Crea automaticamente cartelle e file di progetto
- Documentazione elegante e bilingue (EN/IT)
- Esempi di output per riferimento rapido

---

## ⚙️ Come Funziona

1. Avvia lo strumento CLI nel terminale.
2. Seleziona le tecnologie frontend e backend preferite.
3. Inserisci la tua chiave API OpenAI (se non già configurata).
4. L'AI genera la struttura del progetto e i Dockerfile.
5. I file vengono salvati su disco, pronti per lo sviluppo!

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

Segui i prompt per selezionare le tecnologie e fornire la chiave API OpenAI.

---

## 🔑 Configurazione (Chiave API OpenAI, ecc.)

Imposta la tua chiave API OpenAI come variabile d'ambiente o inseriscila quando richiesto:

```bash
export OPENAI_API_KEY=la-tua-chiave-qui
```

Oppure lascia che la CLI ti chieda la chiave.

---

## 🧩 Tecnologie Supportate

- Frontend: React, Angular, Vue
- Backend: Node.js, Express, Laravel

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

> Creato con ❤️ dal Team AI Template Generator
