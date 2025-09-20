# 🚀 AI Docker Template Generator

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Docker](https://img.shields.io/badge/Docker-Required-blue.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Supported Technologies](#supported-technologies)
- [Project Structure](#project-structure)
- [Logging](#logging)
- [Contributing](#contributing)
- [License](#license)

---

## 🧠 Overview

**AI Docker Template Generator** is an intelligent CLI tool that creates production-ready web projects with Docker integration. Powered by Google Gemini AI, it generates complete project structures, configurations, and Dockerfiles based on your technology preferences.

### Key Benefits:

- 🐳 **Docker-first approach** - Everything containerized out of the box
- 🤖 **AI-powered generation** - Smart project structures and configurations
- 🎯 **Technology compatibility** - Intelligent backend recommendations
- 📁 **Clean architecture** - Modular, maintainable codebase
- 🔍 **Auto-validation** - Built-in quality checks and corrections

---

## ✨ Features

### 🎛️ **Interactive CLI Experience**

- Smart technology selection with compatibility recommendations
- Clean, user-friendly interface with minimal noise
- Back navigation and configuration modification support

### 🏗️ **Supported Project Types**

- **Frontend Only**: Vue, React, Angular with modern tooling
- **Backend Only**: Laravel, Express, NestJS with best practices
- **Full Stack**: Intelligent frontend-backend combinations

### 🧠 **AI-Powered Generation**

- Complete project scaffolding following official conventions
- Production-ready Docker configurations
- Auto-correction of common errors
- Validation and quality assurance

### 📊 **Advanced Logging**

- Detailed generation logs for debugging
- Clean user interface without technical noise
- Comprehensive error tracking and reporting

---

## 🏛️ Architecture

```
ia-docker-template-generator/
├── scripts/
│   ├── cli/                    # User interaction modules
│   │   ├── userPreferences.js  # Technology selection logic
│   │   └── apiKeyManager.js    # API key management
│   ├── generators/             # AI generation modules
│   │   ├── projectGenerator.js # Main orchestrator
│   │   └── promptBuilder.js    # AI prompt construction
│   ├── validators/             # Quality assurance
│   │   ├── postGenerationValidator.js
│   │   ├── projectValidator.js
│   │   └── autoCorrector.js
│   └── utils/                  # Utility modules
│       └── logger.js           # Logging system
├── logs/                       # Generated log files
├── index.js                    # Main entry point
└── package.json               # Dependencies and scripts
```

### 🔧 **Modular Design**

- **Separation of Concerns**: Each module handles a specific responsibility
- **Clean Interfaces**: Well-defined APIs between components
- **Testability**: Isolated modules for easy testing
- **Maintainability**: Clear code organization and documentation

---

## 🛠️ Installation

### Prerequisites

- **Node.js 18+**
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Setup

```bash
# Clone the repository
git clone https://github.com/filippo-falcone/ia-docker-template-generator.git
cd ia-docker-template-generator

# Install dependencies
npm install

# Configure API key (optional - you can also enter it when prompted)
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

---

## ▶️ Usage

### Basic Usage

```bash
npm start
# or
node index.js
```

### Interactive Flow

1. **Project Details**: Enter project name and location
2. **Project Type**: Choose Frontend, Backend, or Full Stack
3. **Technology Selection**:
   - Select frontend framework (Vue, React, Angular)
   - Choose CSS framework (Bootstrap, Tailwind, Material UI, etc.)
   - Pick backend technology (Laravel, Express, NestJS) with smart recommendations
4. **Confirmation**: Review and confirm your configuration
5. **Generation**: AI creates your complete project structure

### Smart Recommendations

When creating full stack projects, the system automatically recommends compatible backend technologies:

- **Vue + Bootstrap** → Laravel, Express
- **React + Tailwind** → Express, NestJS
- **Vue + Material UI** → Express, NestJS
- **Angular + Material** → NestJS, Express

---

## 🔑 Configuration

### API Key Setup

You can configure your Google Gemini API key in multiple ways:

1. **Environment File** (recommended):

   ```bash
   # .env file
   GOOGLE_API_KEY=your_api_key_here
   # or
   GEMINI_API_KEY=your_api_key_here
   ```

2. **Environment Variable**:

   ```bash
   export GOOGLE_API_KEY=your_api_key_here
   ```

3. **Interactive Prompt**: Enter when prompted (with option to save)

---

## 🧩 Supported Technologies

### Frontend Frameworks

| Technology  | Variants                             | CSS Frameworks                   |
| ----------- | ------------------------------------ | -------------------------------- |
| **Vue.js**  | Vue 3, Vue + Vite, Nuxt.js           | Bootstrap, Tailwind, Material UI |
| **React**   | React (Basic), React + Vite, Next.js | Bootstrap, Tailwind, Material UI |
| **Angular** | Angular CLI, Standalone Components   | Bootstrap, Angular Material      |

### Backend Frameworks

| Technology  | Frameworks      | Best For                                |
| ----------- | --------------- | --------------------------------------- |
| **Node.js** | Express, NestJS | Modern APIs, TypeScript projects        |
| **PHP**     | Laravel         | Traditional web apps, rapid development |

### Docker Integration

- **Multi-stage builds** for production optimization
- **Health checks** for service reliability
- **Volume mapping** for development workflow
- **Nginx configuration** for SPA routing
- **Database integration** with docker-compose

---

## � Project Structure

### Generated Project Types

#### Frontend Only

```
my-vue-app/
├── src/
├── public/
├── Dockerfile
├── nginx.conf
├── docker-compose.yml
└── README.md
```

#### Full Stack

```
my-fullstack-app/
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

## 📊 Logging

The application uses a sophisticated logging system that separates user experience from technical details:

### User Interface

- Clean, minimal output focused on progress
- Clear success/error messages
- Progress indicators for long operations

### Detailed Logs

- **Location**: `./logs/generation-TIMESTAMP.log`
- **Content**: API calls, validation details, file generation status
- **Retention**: Automatically keeps last 10 log files

### Log Levels

- **INFO**: General operation information
- **WARN**: Non-critical issues and warnings
- **ERROR**: Failures and critical problems
- **DEBUG**: Detailed technical information

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/ia-docker-template-generator.git
cd ia-docker-template-generator

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Code Style

- **Comments**: Bilingual (English/Italian) for developer documentation
- **CLI Messages**: English only for user interface
- **Modularity**: Keep components focused and testable
- **Documentation**: Update README for significant changes

### Pull Request Process

1. Ensure all tests pass
2. Update documentation as needed
3. Add detailed description of changes
4. Reference any related issues

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/filippo-falcone/ia-docker-template-generator/issues)
- **Documentation**: This README and [technical documentation](docs/)
- **Changelog**: See [CHANGELOG.md](docs/CHANGELOG.md) for version history
- **Technical Reference**: [Framework Reference Guide](docs/FRAMEWORK_REFERENCE_GUIDE.md)
- **Logs**: Check `./logs/` directory for detailed operation logs

---

> 🚀 **Ready to build amazing projects?** Get started with `npm start`!

Made with ❤️ by [Filippo Falcone](https://github.com/filippo-falcone) | © 2025
