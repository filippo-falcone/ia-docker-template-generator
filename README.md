# 🚀 AI Template Generator [![Italian Version](https://img.shields.io/badge/Italian-🇮🇹-green.svg)](README.it.md)

![Project Logo](https://via.placeholder.com/150x50?text=AI+Template+Generator)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration-google-gemini-api-key)
- [Technologies Supported](#technologies-supported)
- [Example Output](#example-output)
- [Contribution](#contribution)
- [License](#license)

---

## 🧠 Overview

**AI Template Generator** is a powerful CLI tool that helps you scaffold modern web projects using your favorite frontend and backend technologies. Powered by OpenAI, it generates project structures and Dockerfiles tailored to your choices, making setup effortless and production-ready.

---

## ✨ Features

- Interactive terminal prompts with flexible options:
  - Choose frontend-only, backend-only, or full-stack
  - Wide selection of frontend frameworks: React, Vue, Angular with specific versions
  - Wide selection of backend frameworks: Node.js, PHP, Python with specific implementations
  - Integration with CSS frameworks like Bootstrap, Tailwind, and more
- Uses Google Gemini API for code and Dockerfile generation
- Automatically creates project folders and files
- Stylish, bilingual documentation (EN/IT)
- Example outputs for quick reference

---

## ⚙️ How It Works

1. Run the CLI tool in your terminal.
2. Choose the project type: frontend, backend, or full-stack.
3. Select specific technologies (frontend/backend frameworks, versions, CSS).
4. Enter a destination path for your project.
5. Confirm your selections.
6. Enter your Google Gemini API key (if not already configured).
7. The AI generates the project structure, Dockerfile(s), and all configurations.
8. Files are saved to your specified location, ready for development!

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-template-generator.git
cd ai-template-generator

# Automatically generate package.json (if not present)
npm init -y

# Install required dependencies
npm install inquirer axios
```

---

## ▶️ Usage

```bash
node index.js
```

Follow the prompts to:

- Select technologies
- Choose a destination path for your project
- Provide your Google Gemini API key

Your project will be generated at the location you specify, keeping the generator repository clean.

---

## 🔑 Configuration (Google Gemini API Key)

You can configure your Google Gemini API key in two ways:

1. **Using a .env file** (recommended):

   ```
   # Create a .env file in the root folder
   GEMINI_API_KEY=your-key-here
   ```

   The script will automatically load this key at startup.

2. **As an environment variable**:

   ```bash
   export GEMINI_API_KEY=your-key-here
   ```

---

## 🧩 Technologies Supported

- **Frontend**:
  - React: Base, React + Vite, Next.js, Create React App
  - Vue: Vue 3, Vue 2, Vue + Vite, Nuxt.js
  - Angular: Angular CLI, Angular + Standalone Components
- **Backend**:
  - Node.js: Express, Koa, Fastify, NestJS
  - PHP: Laravel, PHP Base, Symfony, Slim
  - Python: Django, Flask, FastAPI
- **CSS Frameworks**:
  - Bootstrap
  - Tailwind CSS
  - Material UI
  - Bulma

---

## 📦 Example Output

```
/ai-template-project
├── frontend/
│   └── [React|Angular|Vue] files
├── backend/
│   └── [Node.js|Express|Laravel] files
├── docker/
│   └── Dockerfile
└── README.md
```

---

## 🤝 Contribution

Contributions are welcome! Please open issues or submit pull requests for improvements, translations, or new features.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

> Made with ❤️ by Filippo Falcone
