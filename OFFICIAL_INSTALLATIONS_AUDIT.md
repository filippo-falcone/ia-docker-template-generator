# ANALISI INSTALLAZIONI UFFICIALI COMPLETE

# Per creare prompt che prevengono TUTTI gli errori per OGNI combinazione

## 1. FRONTEND - TUTTE LE OPZIONI

### A. REACT FAMILY

#### 1.1 React (Basic) - npx create-react-app

```bash
# Comando ufficiale
npx create-react-app my-app
```

**File CRITICI sempre presenti:**

- `package.json` con scripts: "start", "build", "test", "eject"
- `public/index.html` con div id="root"
- `src/index.js` entry point con ReactDOM.render
- `src/App.js` componente root
- `src/App.css` stili base
- `.gitignore` con build/, node_modules/

**Dipendenze CORE:**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}
```

#### 1.2 React + Vite - npm create vite@latest

```bash
# Comando ufficiale
npm create vite@latest my-react-app -- --template react
```

**File CRITICI sempre presenti:**

- `vite.config.js` con @vitejs/plugin-react
- `index.html` nella root (non public/)
- `src/main.jsx` entry point
- `src/App.jsx` componente root

**Dipendenze CORE:**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```

#### 1.3 Next.js - npx create-next-app@latest

```bash
# Comando ufficiale
npx create-next-app@latest my-next-app
```

**File CRITICI sempre presenti:**

- `next.config.js` configurazione Next.js
- `pages/index.js` o `app/page.js` (App Router)
- `package.json` con scripts: "dev", "build", "start", "lint"

### B. VUE FAMILY

#### 2.1 Vue 3 - npm create vue@latest (basic)

```bash
# Comando ufficiale
npm create vue@latest my-vue-app
```

**File CRITICI sempre presenti:**

- `index.html` nella ROOT (non public/)
- `vite.config.js` con @vitejs/plugin-vue
- `src/main.js` entry point
- `src/App.vue` componente root
- `.gitignore` con node_modules/, dist/, .env.local

**Dipendenze CORE:**

```json
{
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

#### 2.2 Vue + Vite (con opzioni)

**Se Router = YES:**

- `src/router/index.js` configurazione router
- "vue-router": "^4.2.5" in dependencies
- `src/views/HomeView.vue`, `src/views/AboutView.vue`

**Se Pinia = YES:**

- `src/stores/counter.js` store di esempio
- "pinia": "^2.1.0" in dependencies

**Se TypeScript = YES:**

- `.ts` e `.vue` files con `<script setup lang="ts">`
- "typescript": "~5.0.0" in devDependencies
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

#### 2.3 Nuxt.js - npx nuxi@latest init

```bash
# Comando ufficiale
npx nuxi@latest init my-nuxt-app
```

**File CRITICI sempre presenti:**

- `nuxt.config.ts` configurazione Nuxt
- `app.vue` entry component
- `pages/index.vue` per routing automatico

### C. ANGULAR FAMILY

#### 3.1 Angular CLI - ng new

```bash
# Comando ufficiale
ng new my-angular-app
```

**File CRITICI sempre presenti:**

- `angular.json` configurazione workspace
- `src/main.ts` entry point
- `src/app/app.component.ts` root component
- `tsconfig.json` configurazione TypeScript

## 2. CSS FRAMEWORKS - INTEGRAZIONI UFFICIALI

### A. TAILWIND CSS

#### Con Vue.js:

```bash
# Installazione ufficiale
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**File richiesti:**

- `tailwind.config.js` con paths configuration
- `postcss.config.js` con tailwindcss plugin
- CSS con @tailwind directives

#### Con React:

```bash
# Installazione ufficiale
npm install -D tailwindcss
npx tailwindcss init
```

### B. BOOTSTRAP

#### Con Vue.js:

```bash
# Installazione ufficiale
npm install bootstrap
```

**Integrazione in main.js:**

```javascript
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
```

#### Con React:

```bash
# Installazione ufficiale
npm install bootstrap
```

### C. MATERIAL UI

#### Con React:

```bash
# Installazione ufficiale MUI
npm install @mui/material @emotion/react @emotion/styled
```

#### Con Vue (Vuetify):

```bash
# Installazione ufficiale Vuetify
npm install vuetify
```

### D. BULMA

```bash
# Installazione semplice
npm install bulma
```

## 3. BACKEND - TUTTE LE OPZIONI

### A. NODE.JS FAMILY

#### 3.1 Express.js

```bash
# Setup manuale tipico
npm init -y
npm install express
```

**Struttura tipica:**

- `app.js` o `server.js` entry point
- `routes/` directory per routes
- `middleware/` per middleware custom
- `models/` per data models

#### 3.2 NestJS

```bash
# Comando ufficiale
npm i -g @nestjs/cli
nest new my-nest-app
```

**File CRITICI:**

- `nest-cli.json` configurazione CLI
- `src/main.ts` entry point
- `src/app.module.ts` root module

#### 3.3 Fastify

```bash
# Setup manuale
npm install fastify
```

### B. PYTHON FAMILY

#### 3.1 Django

```bash
# Comando ufficiale
django-admin startproject myproject
```

**File CRITICI:**

- `manage.py` CLI tool
- `settings.py` configurazione
- `urls.py` routing

#### 3.2 Flask

```bash
# Setup tipico
pip install Flask
```

**File tipici:**

- `app.py` main application
- `requirements.txt` dependencies

#### 3.3 FastAPI

```bash
# Setup tipico
pip install fastapi uvicorn
```

### C. PHP FAMILY

#### 3.1 Laravel - composer create-project laravel/laravel

**[Già documentato sopra]**

#### 3.2 Symfony

```bash
# Comando ufficiale
composer create-project symfony/skeleton my-symfony-app
```

#### 3.3 Slim Framework

```bash
# Setup con Composer
composer require slim/slim
```

## 4. COMBINAZIONI SPECIFICHE E LORO ERRORI

### A. Vue + Vite + Bootstrap

**File richiesti:**

- `package.json` con vue, vite, bootstrap
- `src/main.js` con import Bootstrap CSS e JS
- `vite.config.js` con plugin vue
- `index.html` in root

**Errori comuni:**
❌ Bootstrap importato in index.html invece che main.js
❌ Missing popper.js dependency
❌ CSS non caricato correttamente

### B. React + Vite + Tailwind

**File richiesti:**

- `tailwind.config.js` con React paths
- `src/index.css` con @tailwind directives
- `postcss.config.js` se utilizzato

### C. Vue + Router + Pinia + TypeScript

**File richiesti:**

- `tsconfig.json` configs (app, node)
- Router con typed routes
- Pinia stores con TypeScript interfaces

### D. Laravel + Vue (Fullstack)

**Integrazione specifica:**

- Laravel Mix o Vite per asset compilation
- API routes in Laravel
- CORS configuration
- Sanctum per authentication

## 5. DOCKER CONFIGURATIONS PER OGNI STACK

### A. Frontend-Only Configurations

#### Vue + Vite Dockerfile:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### React + Vite Dockerfile:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### B. Backend-Only Configurations

#### Express.js Dockerfile:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Django Dockerfile:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## 6. VALIDAZIONE ERRORI PER OGNI COMBINAZIONE

### A. Errori di Dipendenze

- **Missing peer dependencies** (React + routing)
- **Version conflicts** (Vue 2 vs Vue 3 packages)
- **Missing dev dependencies** (TypeScript without @types)

### B. Errori di Configurazione

- **Wrong entry points** (main.js vs main.ts)
- **Missing config files** (tailwind.config.js missing)
- **Wrong import paths** (relative vs absolute)

### C. Errori Docker

- **Wrong COPY paths** per ogni build context
- **Missing nginx configs** per SPA routing
- **Port conflicts** tra servizi

### D. Errori CSS Framework

- **Bootstrap JS non importato** per componenti interattivi
- **Tailwind purge config** non configurato correttamente
- **Material UI theme** non configurato
