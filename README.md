# 🚀 AI Template Generator

![Project Logo](https://via.placeholder.com/150x50?text=AI+Template+Generator)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration-openai-api-key-etc)
- [Technologies Supported](#technologies-supported)
- [Example Output](#example-output)
- [Contribution](#contribution)
- [License](#license)

---

## 🧠 Overview

**AI Template Generator** is a powerful CLI tool that helps you scaffold modern web projects using your favorite frontend and backend technologies. Powered by OpenAI, it generates project structures and Dockerfiles tailored to your choices, making setup effortless and production-ready.

---

## ✨ Features

- Interactive terminal prompts (choose frontend & backend)
- Supports React, Angular, Vue, Node.js, Express, Laravel
- Uses OpenAI API for code and Dockerfile generation
- Automatically creates project folders and files
- Stylish, bilingual documentation (EN/IT)
- Example outputs for quick reference

---

## ⚙️ How It Works

1. Run the CLI tool in your terminal.
2. Select your preferred frontend and backend technologies.
3. Enter your OpenAI API key (if not already configured).
4. The AI generates the project structure and Dockerfile(s).
5. Files are saved to disk, ready for development!

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

Follow the prompts to select technologies and provide your OpenAI API key.

---

## 🔑 Configuration (OpenAI API Key, etc.)

Set your OpenAI API key as an environment variable or enter it when prompted:

```bash
export OPENAI_API_KEY=your-key-here
```

Or, let the CLI prompt you for the key.

---

## 🧩 Technologies Supported

- Frontend: React, Angular, Vue
- Backend: Node.js, Express, Laravel

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

> Made with ❤️ by the AI Template Generator Team
