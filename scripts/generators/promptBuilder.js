/**
 * @fileoverview AI prompt builder for project generation
 * Constructs optimized prompts for Google Gemini AI model in English
 * 
 * @author Filippo Falcone
 * @created 2025
 * @version 2.0.0
 */

const { ProjectValidator } = require('../validators/projectValidator');

class PromptBuilder {
    constructor() {
        this.technologyModules = {
            // === FRONTEND MODULES ===
            'react-basic': new ReactBasicModule(),
            'react-vite': new ReactViteModule(),
            'nextjs': new NextJSModule(),
            'vue3-basic': new Vue3BasicModule(),
            'vue3-vite': new Vue3ViteModule(),
            'nuxtjs': new NuxtJSModule(),
            'angular-cli': new AngularCLIModule(),
            'angular-standalone': new AngularStandaloneModule(),
            
            // === BACKEND MODULES ===
            'express': new ExpressModule(),
            'nestjs': new NestJSModule(),
            'fastify': new FastifyModule(),
            'django': new DjangoModule(),
            'flask': new FlaskModule(),
            'fastapi': new FastAPIModule(),
            'laravel': new LaravelModule(),
            'symfony': new SymfonyModule(),
            'slim': new SlimModule(),
            
            // === CSS FRAMEWORK MODULES ===
            'tailwind': new TailwindModule(),
            'bootstrap': new BootstrapModule(),
            'material-ui': new MaterialUIModule(),
            'vuetify': new VuetifyModule(),
            'bulma': new BulmaModule(),
            
            // === INTEGRATION MODULES ===
            'docker': new DockerModule(),
            'typescript': new TypeScriptModule(),
            'cors': new CORSModule(),
            'auth': new AuthModule()
        };
        
        this.validator = new ProjectValidator();
    }

    buildPrompt(selections) {
        // Salva le opzioni per uso nei metodi successivi
        this.options = selections;
        
        const { 
            frontend, 
            backend, 
            cssFramework, 
            includeDocker = true,
            includeAuth = false,
            isFullStack = false 
        } = selections;

        // Determina i moduli necessari
        const requiredModules = this.determineRequiredModules(selections);
        
        // Costruisci il prompt modulare
        const promptSections = {
            header: this.buildHeader(selections),
            projectStructure: this.buildProjectStructure(requiredModules),
            dependencies: this.buildDependencies(requiredModules),
            configurations: this.buildConfigurations(requiredModules),
            dockerization: this.buildDockerConfig(requiredModules), // SEMPRE incluso
            validation: this.buildValidationRules(requiredModules),
            commonErrors: this.buildErrorPrevention(requiredModules)
        };

        return this.assemblePrompt(promptSections);
    }

    determineRequiredModules(selections) {
        const modules = [];
        
        // Frontend module
        if (selections.frontend) {
            const frontendKey = this.mapFrontendToModule(selections.frontend);
            modules.push(frontendKey);
        }
        
        // Backend module
        if (selections.backend) {
            const backendKey = this.mapBackendToModule(selections.backend);
            modules.push(backendKey);
        }
        
        // CSS Framework module
        if (selections.cssFramework && selections.cssFramework !== 'None') {
            const cssKey = this.mapCSSToModule(selections.cssFramework, selections.frontend);
            modules.push(cssKey);
        }
        
        // SEMPRE includi Docker - è l'obiettivo principale del tool!
        modules.push('docker');
        
        // Altri integration modules
        if (selections.includeAuth) modules.push('auth');
        if (selections.includeTypeScript) modules.push('typescript');
        if (selections.isFullStack) modules.push('cors');
        
        return modules;
    }

    mapFrontendToModule(frontend) {
        const mapping = {
            'React (Basic)': 'react-basic',
            'React + Vite': 'react-vite',
            'Next.js': 'nextjs',
            'Vue (Vue 3)': 'vue3-basic',
            'Vue 3': 'vue3-basic',
            'Vue + Vite': 'vue3-vite',
            'Nuxt.js': 'nuxtjs',
            'Angular (CLI)': 'angular-cli',
            'Angular + Standalone': 'angular-standalone'
        };
        return mapping[frontend] || 'vue3-basic';
    }

    mapBackendToModule(backend) {
        const mapping = {
            'Express': 'express',
            'NestJS': 'nestjs',
            'Fastify': 'fastify',
            'Django': 'django',
            'Flask': 'flask',
            'FastAPI': 'fastapi',
            'Laravel': 'laravel',
            'Symfony': 'symfony',
            'Slim': 'slim'
        };
        return mapping[backend] || 'express';
    }

    mapCSSToModule(cssFramework, frontend) {
        const mapping = {
            'Tailwind CSS': 'tailwind',
            'Bootstrap': 'bootstrap',
            'Material UI': frontend?.includes('React') ? 'material-ui' : 'vuetify',
            'Bulma': 'bulma'
        };
        return mapping[cssFramework] || 'bootstrap';
    }

    buildHeader(selections) {
        const isFullStack = selections.frontend && selections.backend;
        const stackType = isFullStack ? 'Full Stack' : (selections.frontend ? 'Frontend' : 'Backend');
        
        return `
# ${stackType} Application Generator with Docker

Generate a ${stackType.toLowerCase()} containerized application following EXACT official conventions:

${selections.frontend ? `- **Frontend**: ${selections.frontend}` : ''}
${selections.backend ? `- **Backend**: ${selections.backend}` : ''}
${selections.cssFramework && selections.cssFramework !== 'None' ? `- **CSS Framework**: ${selections.cssFramework}` : ''}
- **Containerization**: Docker + Docker Compose (ALWAYS INCLUDED)

## PRIMARY OBJECTIVE:
🐳 **COMPLETE DOCKERIZED ENVIRONMENT** - No local installations required!

## CRITICAL REQUIREMENTS:
1. **USE OFFICIAL COMMANDS**: Replicate EXACTLY the official installation commands
2. **AUTHENTIC STRUCTURE**: Create structure identical to official scaffolding
3. **CORRECT DEPENDENCIES**: Use exact versions and dependencies from official tools
4. **ZERO ERRORS**: Prevent all documented common errors
5. **PRODUCTION READY**: Configure for immediate deployment
6. **DOCKER FIRST**: Everything must work via Docker without local installations
        `;
    }

    buildProjectStructure(modules) {
        let structure = '\n## PROJECT STRUCTURE\n\n';
        
        modules.forEach(moduleKey => {
            const module = this.technologyModules[moduleKey];
            if (module && module.getProjectStructure) {
                structure += module.getProjectStructure();
            }
        });
        
        return structure;
    }

    buildDependencies(modules) {
        let dependencies = '\n## DEPENDENCIES AND INSTALLATION\n\n';
        
        modules.forEach(moduleKey => {
            const module = this.technologyModules[moduleKey];
            if (module && module.getDependencies) {
                dependencies += module.getDependencies();
            }
        });
        
        return dependencies;
    }

    buildConfigurations(modules) {
        let configs = '\n## CONFIGURATION FILES\n\n';
        
        modules.forEach(moduleKey => {
            const module = this.technologyModules[moduleKey];
            if (module && module.getConfigurations) {
                configs += module.getConfigurations();
            }
        });
        
        return configs;
    }

    buildDockerConfig(modules) {
        const dockerModule = this.technologyModules['docker'];
        if (dockerModule) {
            return dockerModule.getDockerConfiguration(modules);
        }
        return '';
    }

    buildValidationRules(modules) {
        let validation = '\n## VALIDATION RULES\n\n';
        
        modules.forEach(moduleKey => {
            const module = this.technologyModules[moduleKey];
            if (module && module.getValidationRules) {
                validation += module.getValidationRules();
            }
        });
        
        return validation;
    }

    buildErrorPrevention(modules) {
        let errors = '\n## COMMON ERROR PREVENTION\n\n';
        
        modules.forEach(moduleKey => {
            const module = this.technologyModules[moduleKey];
            if (module && module.getCommonErrors) {
                errors += module.getCommonErrors();
            }
        });
        
        return errors;
    }

    assemblePrompt(sections) {
        const prompt = Object.values(sections).join('\n');
        
        // Aggiungi sempre le istruzioni README
        const readmeInstructions = this.buildReadmeInstructions();
        
        return prompt + readmeInstructions;
    }

    buildReadmeInstructions() {
        const { projectName, projectType, frontend, backend, cssFramework } = this.options || {};
        
        return `

## FILE README.md (CREA SEMPRE QUESTO FILE)

\`\`\`markdown
# ${projectName || 'My Project'}

${this.getProjectDescription(projectType, frontend, backend, cssFramework)}

## 🚀 Quick Start con Docker

### Prerequisites
- Docker 20.10+
- Docker Compose v2+

### Installation

1. **Preparazione del progetto**
\`\`\`bash
# Assicurati di essere nella cartella del progetto
cd ${projectName || 'my-project'}
\`\`\`

2. **Build e Start con Docker**
\`\`\`bash
# Build delle immagini
docker compose build

# Start dei servizi
docker compose up -d

# Verifica che tutto funzioni
docker compose ps
\`\`\`

3. **Accesso all'applicazione**
${this.getAccessInstructions(projectType)}

### 🛠️ Development Commands

\`\`\`bash
# Vedere i logs
docker compose logs -f

# Restart dei servizi
docker compose restart

# Stop dei servizi
docker compose down

# Rebuild completo
docker compose down
docker compose build --no-cache
docker compose up -d
\`\`\`

${this.getSpecificInstructions(projectType, frontend, backend)}

## 📁 Project Structure

\`\`\`
./
${this.getProjectStructureTree(projectType, frontend, backend)}
\`\`\`

## 🔧 Configuration

${this.getConfigurationNotes(projectType, frontend, backend)}

---

> 🐳 **Tutto è containerizzato!** Non serve installare Node.js, PHP, Python o altre dipendenze localmente.
\`\`\`

`;
    }

    getProjectDescription(projectType, frontend, backend, cssFramework) {
        if (projectType === 'frontend') {
            return `Un'applicazione frontend moderna con ${frontend || 'tecnologie web'} e ${cssFramework || 'CSS'}, completamente containerizzata con Docker.`;
        } else if (projectType === 'backend') {
            return `Un'API backend robusta con ${backend || 'tecnologie server'}, containerizzata e pronta per la produzione.`;
        } else {
            return `Un'applicazione full-stack con ${frontend || 'frontend'} + ${backend || 'backend'}, completamente containerizzata.`;
        }
    }

    getAccessInstructions(projectType) {
        if (projectType === 'frontend') {
            return `- **Frontend**: http://localhost:8080`;
        } else if (projectType === 'backend') {
            return `- **API Backend**: http://localhost:8000`;
        } else {
            return `- **Frontend**: http://localhost:8080
- **API Backend**: http://localhost:8000`;
        }
    }

    getSpecificInstructions(projectType, frontend, backend) {
        let instructions = '';
        
        if (frontend?.includes('Vue')) {
            instructions += `
### 🖖 Vue.js Specific

\`\`\`bash
# Hot reload attivo - modifica i file e vedi i cambiamenti istantanei
# I file sono in ./src/

# Per aggiungere nuove dipendenze:
docker compose exec frontend npm install <package-name>
docker compose restart frontend
\`\`\`
`;
        }
        
        if (frontend?.includes('React')) {
            instructions += `
### ⚛️ React Specific

\`\`\`bash
# Hot reload attivo - modifica i file e vedi i cambiamenti istantanei
# I file sono in ./src/

# Per aggiungere nuove dipendenze:
docker compose exec frontend npm install <package-name>
docker compose restart frontend
\`\`\`
`;
        }
        
        if (backend?.includes('Laravel')) {
            instructions += `
### 🐘 Laravel Specific

\`\`\`bash
# Comandi Artisan
docker compose exec backend php artisan migrate
docker compose exec backend php artisan make:controller UserController
docker compose exec backend php artisan make:model User

# Composer packages
docker compose exec backend composer require <package-name>
docker compose restart backend
\`\`\`
`;
        }
        
        return instructions;
    }

    getProjectStructureTree(projectType, frontend, backend) {
        if (projectType === 'frontend') {
            return `├── src/                 # Source code
├── public/              # Static assets  
├── Dockerfile          # Container configuration
├── docker-compose.yml  # Services orchestration
├── nginx.conf          # Web server config
└── package.json        # Dependencies`;
        } else if (projectType === 'backend') {
            return `├── app/                 # Application code
├── config/              # Configuration files
├── database/            # Database files
├── Dockerfile          # Container configuration
├── docker-compose.yml  # Services orchestration
└── composer.json       # Dependencies (se PHP)`;
        } else {
            return `├── frontend/            # Vue/React app
├── backend/             # API server
├── docker-compose.yml  # Services orchestration
└── README.md           # This file`;
        }
    }

    getConfigurationNotes(projectType, frontend, backend) {
        let notes = '- Tutte le porte sono esposte tramite Docker Compose\n';
        notes += '- I volumi sono configurati per il hot reload durante development\n';
        notes += '- Le immagini sono ottimizzate con multi-stage builds per produzione\n';
        
        if (frontend?.includes('Vue') || frontend?.includes('React')) {
            notes += '- Nginx configurato per SPA routing (tutte le route puntano a index.html)\n';
        }
        
        if (backend?.includes('Laravel')) {
            notes += '- Database MySQL incluso con configurazione automatica\n';
        }
        
        return notes;
    }

    getSingleTechPrompt(technology, options = {}) {
        const module = this.technologyModules[technology];
        if (!module) {
            throw new Error(`Tecnologia '${technology}' non supportata`);
        }
        
        return module.generateStandalonePrompt(options);
    }
}

// === FRONTEND MODULES ===

class ReactBasicModule {
    getProjectStructure() {
        return `
### React (Create React App) Structure:
\`\`\`
my-app/
├── public/
│   ├── index.html          # HTML template con div#root
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── index.js           # Entry point con ReactDOM.render
│   ├── App.js             # Root component
│   ├── App.css            # App styles
│   ├── index.css          # Global styles
│   └── reportWebVitals.js
├── package.json           # Con react-scripts
└── README.md
\`\`\`
        `;
    }

    getDependencies() {
        return `
### React Basic Dependencies:
\`\`\`bash
# Comando ufficiale
npx create-react-app my-app
cd my-app
\`\`\`

**package.json essenziale:**
\`\`\`json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
\`\`\`
        `;
    }

    getConfigurations() {
        return `
### React Basic Configurations:
- **public/index.html**: DEVE contenere \`<div id="root"></div>\`
- **src/index.js**: Entry point con \`ReactDOM.render(<App />, document.getElementById('root'))\`
- **.gitignore**: Con build/, node_modules/, .env.local
        `;
    }

    getValidationRules() {
        return `
### React Basic Validation:
- ✅ package.json contiene react, react-dom, react-scripts
- ✅ public/index.html ha div#root
- ✅ src/index.js importa ReactDOM
- ✅ src/App.js esporta componente default
        `;
    }

    getCommonErrors() {
        return `
### React Basic - Errori da evitare:
❌ **index.html senza div#root** → App non si monta
❌ **react-scripts mancanti** → Build fallisce
❌ **Importi ES6 in versioni vecchie** → Syntax error
❌ **Public folder nell'src** → Assets non caricati
        `;
    }

    generateStandalonePrompt(options = {}) {
        return `
# React (Create React App) Project Generator

${this.getProjectStructure()}
${this.getDependencies()}
${this.getConfigurations()}
${options.cssFramework ? `\n## CSS Framework Integration\n${options.cssFramework}` : ''}
${this.getValidationRules()}
${this.getCommonErrors()}

## CRITICAL REQUIREMENTS:
1. **Use EXACT command: npx create-react-app my-app**
2. **public/index.html MUST have div with id="root"**
3. **src/index.js MUST use ReactDOM.render**
4. **All official CRA patterns and structure**
        `;
    }
}

class ReactViteModule {
    getProjectStructure() {
        return `
### React + Vite Structure:
\`\`\`
my-react-app/
├── index.html             # Nella ROOT, non in public/!
├── src/
│   ├── main.jsx          # Entry point (non .js!)
│   ├── App.jsx           # Root component
│   ├── App.css
│   └── index.css
├── vite.config.js        # Configurazione Vite
├── package.json
└── .gitignore
\`\`\`
        `;
    }

    getDependencies() {
        return `
### React + Vite Dependencies:
\`\`\`bash
# Comando ufficiale
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
\`\`\`

**package.json essenziale:**
\`\`\`json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
\`\`\`
        `;
    }

    getConfigurations() {
        return `
### React + Vite Configurations:

**vite.config.js:**
\`\`\`javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
\`\`\`

**index.html** (nella root):
\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
\`\`\`
        `;
    }

    getValidationRules() {
        return `
### React + Vite Validation:
- ✅ index.html nella root (non in public/)
- ✅ package.json contiene react, react-dom, @vitejs/plugin-react, vite
- ✅ vite.config.js presente con plugin react
- ✅ src/main.jsx entry point
        `;
    }

    getCommonErrors() {
        return `
### React + Vite - Errori da evitare:
❌ **index.html in public/** invece che nella root
❌ **main.js invece di main.jsx** → JSX non supportato
❌ **vite.config.js senza plugin react**
❌ **ReactDOM.render deprecato** → Usa createRoot in React 18
        `;
    }

    generateStandalonePrompt(options = {}) {
        return `
# React + Vite Project Generator

${this.getProjectStructure()}
${this.getDependencies()}
${this.getConfigurations()}
${options.cssFramework ? `\n## CSS Framework Integration\n${options.cssFramework}` : ''}
${this.getValidationRules()}
${this.getCommonErrors()}

## CRITICAL REQUIREMENTS:
1. **Use command: npm create vite@latest -- --template react**
2. **index.html MUST be in project ROOT**
3. **Entry point MUST be main.jsx (not main.js)**
4. **Use React 18 createRoot API**
        `;
    }
}

class Vue3BasicModule {
    getProjectStructure() {
        return `
### Vue 3 Structure:
\`\`\`
./
├── index.html             # Nella ROOT!
├── src/
│   ├── main.js           # Entry point
│   ├── App.vue           # Root component
│   ├── components/
│   │   └── HelloWorld.vue
│   └── assets/
│       └── vue.svg
├── vite.config.js        # Con @vitejs/plugin-vue
├── package.json
├── README.md
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── .gitignore
\`\`\`
        `;
    }

    getDependencies() {
        return `
### Vue 3 Dependencies:
\`\`\`bash
# Comando ufficiale (se creato da zero)
npm create vue@latest .
# Oppure per progetto esistente:
npm install vue@latest
npm install -D @vitejs/plugin-vue vite
\`\`\`

**package.json essenziale:**
\`\`\`json
{
  "name": "vue-project",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.21"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4",
    "vite": "^5.2.0"
  }
}
\`\`\`
        `;
    }

    getValidationRules() {
        return `
### Vue 3 Basic Validation:
- ✅ index.html nella ROOT (non in public/)
- ✅ package.json contiene vue, @vitejs/plugin-vue, vite
- ✅ vite.config.js presente con plugin vue e alias @
- ✅ src/main.js importa createApp da 'vue'
- ✅ Script tag in index.html: "/src/main.js"
        `;
    }

    getCommonErrors() {
        return `
### Vue 3 Basic - Errori da evitare:
❌ **index.html in public/** invece che nella root
❌ **Script src="./src/main.js"** invece di "/src/main.js"
❌ **Vite config senza @ alias**
❌ **Import { createApp } mancante**
❌ **Router senza history mode**
        `;
    }

    generateStandalonePrompt(options = {}) {
        return `
# Vue 3 Basic Project Generator

${this.getProjectStructure()}
${this.getDependencies()}
${this.getConfigurations()}
${options.cssFramework ? `\n## CSS Framework Integration\n${options.cssFramework}` : ''}
${this.getValidationRules()}
${this.getCommonErrors()}

## CRITICAL REQUIREMENTS:
1. **index.html MUST be in project ROOT**
2. **Use command: npm create vue@latest**
3. **vite.config.js with @ alias**
4. **All official Vue 3 patterns**
        `;
    }
}

// === BACKEND MODULES ===

class LaravelModule {
    getProjectStructure() {
        return `
### Laravel Structure:
\`\`\`
laravel-app/
├── app/
│   ├── Http/Controllers/
│   │   └── Controller.php
│   ├── Models/
│   │   └── User.php
│   └── Providers/
├── bootstrap/
│   └── app.php            # CRITICO: configurazione app
├── config/
├── database/
│   └── migrations/
├── routes/
│   ├── web.php           # Web routes
│   └── api.php           # API routes
├── resources/
│   └── views/
├── composer.json         # CRITICO: dipendenze
├── artisan              # CRITICO: CLI tool
└── .env.example
\`\`\`
        `;
    }

    getDependencies() {
        return `
### Laravel Dependencies:
\`\`\`bash
# Comando ufficiale
composer create-project laravel/laravel .
# Oppure se cartella non vuota:
composer install
\`\`\`

**composer.json essenziale:**
\`\`\`json
{
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0",
        "laravel/sanctum": "^4.0",
        "laravel/tinker": "^2.9"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "app/",
            "Database\\\\Factories\\\\": "database/factories/",
            "Database\\\\Seeders\\\\": "database/seeders/"
        }
    }
}
\`\`\`
        `;
    }

    getConfigurations() {
        return `
### Laravel Configurations:

**bootstrap/app.php** (Laravel 11):
\`\`\`php
<?php

use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Exceptions;
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
\`\`\`

**.env setup:**
\`\`\`bash
cp .env.example .env
php artisan key:generate
\`\`\`
        `;
    }

    getValidationRules() {
        return `
### Laravel Validation:
- ✅ composer.json contiene laravel/framework
- ✅ bootstrap/app.php con Application::configure()
- ✅ artisan file presente ed eseguibile
- ✅ .env.example presente
- ✅ Route /up configurata per health check
        `;
    }

    getCommonErrors() {
        return `
### Laravel - Errori da evitare:
❌ **Lumen invece di Laravel** per progetti full-stack
❌ **bootstrap/app.php vecchio formato** (pre Laravel 11)
❌ **Route /up mancante** per health check
❌ **.env senza APP_KEY** generata
❌ **Storage permissions** non corrette (775)
        `;
    }
}

class ExpressModule {
    getProjectStructure() {
        return `
### Express.js Structure:
\`\`\`
express-app/
├── src/
│   ├── routes/
│   │   └── index.js
│   ├── middleware/
│   ├── models/
│   └── controllers/
├── server.js             # Entry point
├── package.json
└── .env
\`\`\`
        `;
    }

    getDependencies() {
        return `
### Express Dependencies:
\`\`\`bash
npm init -y
npm install express cors helmet morgan dotenv
npm install -D nodemon
\`\`\`

**package.json essenziale:**
\`\`\`json
{
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.4.5"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
\`\`\`
        `;
    }

    getConfigurations() {
        return `
### Express Configurations:

**server.js:**
\`\`\`javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Express server is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`
        `;
    }

    getValidationRules() {
        return `
### Express Validation:
- ✅ package.json contiene express
- ✅ server.js entry point presente
- ✅ cors middleware configurato
- ✅ health endpoint /health presente
        `;
    }

    getCommonErrors() {
        return `
### Express - Errori da evitare:
❌ **Missing cors** → CORS errors in browser
❌ **No helmet** → Security vulnerabilities
❌ **Missing health endpoint** → Docker health checks fail
❌ **app.js vs server.js confusion** → Entry point unclear
        `;
    }
}

// === CSS FRAMEWORK MODULES ===

class TailwindModule {
    getDependencies() {
        return `
### Tailwind CSS Dependencies:
\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`
        `;
    }

    getConfigurations() {
        return `
### Tailwind Configurations:

**tailwind.config.js** (Vue):
\`\`\`javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

**tailwind.config.js** (React):
\`\`\`javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

**src/index.css** (in tutti i progetti):
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`
        `;
    }

    getValidationRules() {
        return `
### Tailwind CSS Validation:
- ✅ tailwindcss in devDependencies
- ✅ tailwind.config.js presente
- ✅ postcss.config.js presente
- ✅ @tailwind directives in CSS
        `;
    }

    getCommonErrors() {
        return `
### Tailwind CSS - Errori da evitare:
❌ **Wrong content paths** → Classes non purgate correttamente
❌ **Missing @tailwind directives** → Styles non caricati
❌ **postcss.config.js mancante** → Build fallisce
❌ **tailwindcss in dependencies** → Dovrebbe essere in devDependencies
        `;
    }
}

class BootstrapModule {
    getProjectStructure() {
        return `
### Bootstrap Integration (CSS Framework):
- Bootstrap CSS viene integrato tramite import nei file di entry
- Non richiede strutture specifiche di progetto
- Compatibile con tutti i framework frontend
        `;
    }

    getDependencies() {
        return `
### Bootstrap Dependencies:
\`\`\`bash
npm install bootstrap
\`\`\`
        `;
    }

    getConfigurations() {
        return `
### Bootstrap Integration:

**Vue (main.js):**
\`\`\`javascript
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
\`\`\`

**React (index.js/main.jsx):**
\`\`\`javascript
import 'bootstrap/dist/css/bootstrap.min.css'
\`\`\`
        `;
    }

    getValidationRules() {
        return `
### Bootstrap Validation:
- ✅ bootstrap package in dependencies
- ✅ CSS import in main entry file
- ✅ JS bundle imported for interactive components
        `;
    }

    getCommonErrors() {
        return `
### Bootstrap - Errori da evitare:
❌ **Missing bootstrap.bundle.min.js** → Interactive components non funzionano
❌ **CSS non importato** → Styling assente
❌ **Conflitti con CSS custom** → Ordine import sbagliato
        `;
    }
}

// === DOCKER MODULE ===

class DockerModule {
    // Metodi richiesti dal sistema di debug
    getProjectStructure() {
        return `
### Docker Project Structure:
\`\`\`
project/
├── Dockerfile            # Multi-stage build
├── docker-compose.yml    # Orchestrazione servizi
├── .dockerignore        # File da escludere
└── nginx.conf           # Configurazione Nginx (per frontend)
\`\`\`
        `;
    }

    getDependencies() {
        return `
### Docker Requirements:
- Docker Engine 20.10+
- Docker Compose v2+
        `;
    }

    getConfigurations() {
        return this.getDockerConfiguration([]);
    }

    getValidationRules() {
        return `
### Docker Validation:
- ✅ Dockerfile presente
- ✅ .dockerignore configurato
- ✅ Health checks implementati
- ✅ Multi-stage build per frontend
        `;
    }

    getCommonErrors() {
        return `
### Docker Common Errors:
- ❌ Missing .dockerignore
- ❌ No health checks
- ❌ Single-stage builds
- ❌ Missing nginx.conf for SPA
        `;
    }

    getDockerConfiguration(modules) {
        const hasFrontend = modules.some(m => ['react-basic', 'react-vite', 'vue3-basic', 'vue3-vite', 'angular-cli'].includes(m));
        const hasBackend = modules.some(m => ['express', 'nestjs', 'laravel', 'django'].includes(m));
        
        let config = '\n## CONFIGURAZIONE DOCKER\n\n';
        
        if (hasFrontend) {
            config += this.getFrontendDockerfile(modules);
        }
        
        if (hasBackend) {
            config += this.getBackendDockerfile(modules);
        }
        
        if (hasFrontend && hasBackend) {
            config += this.getDockerCompose();
        }
        
        return config;
    }

    getFrontendDockerfile(modules) {
        const isVueVite = modules.includes('vue3-vite') || modules.includes('vue3-basic');
        const isReactVite = modules.includes('react-vite');
        
        return `
### Frontend Dockerfile:
\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/${isVueVite ? 'dist' : 'build'} /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

### nginx.conf (per SPA routing):
\`\`\`nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`
        `;
    }

    getBackendDockerfile(modules) {
        if (modules.includes('laravel')) {
            return `
### Laravel Dockerfile:
\`\`\`dockerfile
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    libzip-dev zip unzip git curl \\
    libonig-dev supervisor nginx \\
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl \\
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY composer.json composer.lock* ./
RUN composer install --no-dev --optimize-autoloader

COPY . .
RUN chown -R www-data:www-data /var/www/html \\
    && chmod -R 775 /var/www/html/storage

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8000/up || exit 1
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
\`\`\`
            `;
        }
        
        return `
### Node.js Dockerfile:
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
\`\`\`
        `;
    }

    getDockerCompose() {
        return `
### docker-compose.yml:
\`\`\`yaml
services:
  frontend:
    build:
      context: ./frontend
    ports:
      - "8080:80"
    depends_on:
      backend:
        condition: service_healthy

  backend:
    build:
      context: ./backend
    ports:
      - "8000:8000"
    depends_on:
      database:
        condition: service_healthy
    environment:
      - DB_HOST=database
      - DB_DATABASE=app
      - DB_USERNAME=app
      - DB_PASSWORD=secret

  database:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: app
      MYSQL_USER: app
      MYSQL_PASSWORD: secret
    volumes:
      - database_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  database_data:
\`\`\`
        `;
    }
}

// Placeholder classes per i moduli non ancora implementati
class NextJSModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class Vue3ViteModule {
    getProjectStructure() {
        return `
### Vue 3 + Vite Structure:
\`\`\`
./
├── index.html             # Nella ROOT!
├── src/
│   ├── main.js           # Entry point
│   ├── App.vue           # Root component
│   ├── router/
│   │   └── index.js      # Router configuration (se abilitato)
│   ├── stores/
│   │   └── counter.js    # Pinia store (se abilitato)
│   ├── components/
│   │   └── HelloWorld.vue
│   └── assets/
│       └── vue.svg
├── vite.config.js        # Con @vitejs/plugin-vue
├── package.json
├── README.md
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── .gitignore
\`\`\`
        `;
    }

    getDependencies() {
        return `
### Vue 3 + Vite Dependencies:
\`\`\`bash
# Comando ufficiale
npm create vue@latest .
# Seleziona: Router=Yes, Pinia=Yes per full featured
npm install
\`\`\`

**package.json con Router + Pinia:**
\`\`\`json
{
  "name": "vue-project",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.21",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.7"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4",
    "vite": "^5.2.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
\`\`\`
        `;
    }

    getConfigurations() {
        return `
### Vue 3 + Vite Configurations:

**vite.config.js:**
\`\`\`javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
\`\`\`

**src/main.js con Router + Pinia:**
\`\`\`javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
\`\`\`

**index.html nella ROOT:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
\`\`\`
        `;
    }

    getValidationRules() {
        return `
### Vue 3 + Vite Validation:
- ✅ index.html nella ROOT (non in public/)
- ✅ package.json contiene vue, @vitejs/plugin-vue, vite
- ✅ vite.config.js presente con plugin vue e alias @
- ✅ src/main.js importa createApp da 'vue'
- ✅ Script tag in index.html: "/src/main.js" (path assoluto)
        `;
    }

    getCommonErrors() {
        return `
### Vue 3 + Vite - Errori da evitare:
❌ **index.html in public/** invece che nella root
❌ **Script src="./src/main.js"** invece di "/src/main.js" 
❌ **Vite config senza @ alias**
❌ **Import { createApp } mancante**
❌ **Router senza createWebHistory()**
❌ **Pinia senza createPinia()**
        `;
    }

    generateStandalonePrompt(options = {}) {
        return `
# Vue 3 + Vite Project Generator

${this.getProjectStructure()}
${this.getDependencies()}
${this.getConfigurations()}
${options.cssFramework ? `\n## CSS Framework Integration\n${options.cssFramework}` : ''}
${this.getValidationRules()}
${this.getCommonErrors()}

## CRITICAL REQUIREMENTS:
1. **index.html MUST be in project ROOT, NOT in public/ folder**
2. **Use EXACT official command: npm create vue@latest**
3. **Script src="/src/main.js" with absolute path**
4. **vite.config.js MUST include @ alias configuration**
5. **All paths must use forward slashes (/)**
        `;
    }
}
class NuxtJSModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class AngularCLIModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class AngularStandaloneModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class NestJSModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class FastifyModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class DjangoModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class FlaskModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class FastAPIModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class SymfonyModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class SlimModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class MaterialUIModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class VuetifyModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class BulmaModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class TypeScriptModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class CORSModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}
class AuthModule {
    getProjectStructure() { return ''; }
    getDependencies() { return ''; }
    getConfigurations() { return ''; }
    getValidationRules() { return ''; }
    getCommonErrors() { return ''; }
}

module.exports = PromptBuilder;