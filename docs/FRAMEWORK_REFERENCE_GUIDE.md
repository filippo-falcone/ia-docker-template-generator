# 📋 Framework Reference Guide

**AI Docker Template Generator v2.0.0 - Technical Specifications**

---

## 🎯 Purpose

This document serves as the **authoritative technical reference** for AI-powered project generation. It ensures accurate, consistent, and error-free project scaffolding by documenting:

- ✅ **Official installation procedures** for all supported frameworks
- ✅ **Critical file requirements** for each technology stack
- ✅ **Common error patterns** and prevention strategies
- ✅ **Docker configuration templates** for production deployment
- ✅ **Validation standards** for quality assurance

---

## 🛠️ Supported Technologies Matrix (v2.0.0)

### Frontend Frameworks

| Framework   | Variants             | Primary Tools           | CSS Support                 |
| ----------- | -------------------- | ----------------------- | --------------------------- |
| **React**   | Basic, Vite, Next.js | CRA, Vite, Next CLI     | All CSS frameworks          |
| **Vue**     | Vue 3, Vite, Nuxt.js | Vue CLI, Vite, Nuxt CLI | All CSS frameworks          |
| **Angular** | CLI, Standalone      | Angular CLI             | Bootstrap, Angular Material |

### Backend Frameworks

| Framework   | Implementation       | Primary Use Case                       |
| ----------- | -------------------- | -------------------------------------- |
| **Express** | Node.js              | Lightweight APIs, rapid prototyping    |
| **NestJS**  | Node.js + TypeScript | Enterprise applications, microservices |
| **Laravel** | PHP                  | Full-stack web applications, APIs      |

### CSS Frameworks

| Framework        | Best Paired With                                | Installation Method         |
| ---------------- | ----------------------------------------------- | --------------------------- |
| **Bootstrap**    | React, Vue, Angular                             | npm package                 |
| **Tailwind CSS** | React, Vue                                      | PostCSS integration         |
| **Material UI**  | React (@mui), Vue (Vuetify), Angular (Material) | Framework-specific packages |
| **Bulma**        | Universal                                       | CSS-only framework          |

---

## 📦 Frontend Specifications

### 🔵 React Family

#### React (Basic) - Create React App

```bash
# Official command
npx create-react-app my-app
cd my-app
```

**Critical Files (Always Required):**

- `package.json` - Scripts: "start", "build", "test", "eject"
- `public/index.html` - Root HTML with `<div id="root">`
- `src/index.js` - Entry point with `ReactDOM.render()`
- `src/App.js` - Root component
- `src/App.css` - Base styles
- `.gitignore` - Excludes: build/, node_modules/

**Core Dependencies:**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}
```

**Common Errors to Prevent:**

- ❌ Missing ReactDOM import in index.js
- ❌ Incorrect root element selector
- ❌ Missing public/index.html template

#### React + Vite

```bash
# Official command
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
```

**Critical Files:**

- `vite.config.js` - Must include `@vitejs/plugin-react`
- `index.html` - Located in **root directory** (not public/)
- `src/main.jsx` - Entry point (note .jsx extension)
- `src/App.jsx` - Root component

**Core Dependencies:**

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

#### Next.js

```bash
# Official command
npx create-next-app@latest my-next-app
cd my-next-app
```

**Critical Files:**

- `next.config.js` - Next.js configuration
- `pages/index.js` (Pages Router) OR `app/page.js` (App Router)
- `package.json` - Scripts: "dev", "build", "start", "lint"

### 🟢 Vue Family

#### Vue 3 + Vite

```bash
# Official command
npm create vue@latest my-vue-app
cd my-vue-app
npm install
```

**Critical Files:**

- `index.html` - Located in **root directory**
- `vite.config.js` - Must include `@vitejs/plugin-vue`
- `src/main.js` - Entry point with `createApp()`
- `src/App.vue` - Root single-file component
- `.gitignore` - Excludes: node_modules/, dist/, .env.local

**Core Dependencies:**

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

**Optional Features (when selected):**

- **Router**: `src/router/index.js` + `vue-router@4`
- **State Management**: `src/stores/` + `pinia@2`
- **TypeScript**: `.ts/.vue` files + TypeScript configs

#### Nuxt.js

```bash
# Official command
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app
npm install
```

**Critical Files:**

- `nuxt.config.ts` - Nuxt configuration
- `app.vue` - Application entry component
- `pages/index.vue` - Homepage (enables auto-routing)

### 🔴 Angular Family

#### Angular CLI

```bash
# Official commands
npm install -g @angular/cli
ng new my-angular-app
cd my-angular-app
```

**Critical Files:**

- `angular.json` - Workspace configuration
- `src/main.ts` - Application bootstrap
- `src/app/app.module.ts` - Root module (traditional)
- `src/app/app.component.ts` - Root component
- `package.json` - Scripts: "ng", "start", "build", "test"

**Core Dependencies:**

```json
{
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/platform-browser": "^17.0.0"
  }
}
```

---

## 🔧 Backend Specifications

### 🟡 Node.js Family

#### Express.js

```bash
# Manual setup (most common)
mkdir my-express-app
cd my-express-app
npm init -y
npm install express
```

**Critical Files:**

- `package.json` - Must include start script
- `app.js` OR `server.js` - Main application file
- `routes/` - Directory for route modules (recommended)
- `middleware/` - Custom middleware (if used)

**Basic Structure:**

```javascript
// app.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### NestJS

```bash
# Official commands
npm i -g @nestjs/cli
nest new my-nest-app
cd my-nest-app
```

**Critical Files:**

- `nest-cli.json` - Nest CLI configuration
- `src/main.ts` - Application entry point
- `src/app.module.ts` - Root application module
- `src/app.controller.ts` - Main controller
- `src/app.service.ts` - Main service

**Core Dependencies:**

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0"
  }
}
```

### 🟠 PHP Family

#### Laravel

```bash
# Official command
composer create-project laravel/laravel my-laravel-app
cd my-laravel-app
```

**Critical Files:**

- `composer.json` - PHP dependencies
- `artisan` - Laravel CLI tool
- `app/Http/Kernel.php` - HTTP kernel
- `config/app.php` - Application configuration
- `routes/web.php` - Web routes
- `routes/api.php` - API routes
- `.env.example` - Environment template

**Critical Directories:**

- `app/` - Application logic
- `config/` - Configuration files
- `database/` - Migrations and seeders
- `public/` - Web-accessible files
- `resources/` - Views and assets
- `storage/` - Application storage

---

## 🎨 CSS Framework Integration

### Bootstrap Integration

#### With React:

```bash
npm install bootstrap
```

```javascript
// src/index.js or src/main.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
```

#### With Vue:

```bash
npm install bootstrap
```

```javascript
// src/main.js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
```

#### With Angular:

```bash
npm install bootstrap
```

```json
// angular.json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
]
```

### Tailwind CSS Integration

#### With React + Vite:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Required Files:**

- `tailwind.config.js` - Must include React file paths
- `postcss.config.js` - PostCSS configuration
- `src/index.css` - Tailwind directives

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### With Vue + Vite:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js:**

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Material UI Integration

#### With React (@mui):

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material  # Optional
```

#### With Vue (Vuetify):

```bash
npm install vuetify
```

#### With Angular (Angular Material):

```bash
ng add @angular/material
```

---

## 🐳 Docker Configuration Templates

### Frontend-Only Docker Setup

#### Vue/React + Vite Dockerfile:

```dockerfile
# Multi-stage build for production optimization
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration for SPA:

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optimize static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Backend-Only Docker Setup

#### Express.js Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
```

#### Laravel Dockerfile:

```dockerfile
FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql gd xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy dependency files
COPY composer*.json ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy application code
COPY . .

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
```

### Full-Stack Docker Compose

#### Vue + Laravel Stack:

```yaml
# docker-compose.yml
version: "3.8"

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=database
      - DB_DATABASE=app
      - DB_USERNAME=user
      - DB_PASSWORD=password
    depends_on:
      - database

  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: app
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---

## ⚠️ Common Error Prevention

### Dependency Conflicts

- ❌ **Vue 2 packages with Vue 3**: Always check Vue version compatibility
- ❌ **React Router v5 with React 18**: Use React Router v6+
- ❌ **Missing peer dependencies**: Angular Material requires @angular/cdk

### Configuration Errors

- ❌ **Wrong entry points**: Vite uses main.js/jsx, CRA uses index.js
- ❌ **Missing config files**: Tailwind requires both tailwind.config.js and postcss.config.js
- ❌ **Incorrect import paths**: Use relative imports for local files

### Docker-Specific Errors

- ❌ **Wrong COPY paths**: Build context matters for file copying
- ❌ **Missing health checks**: Production containers should include health endpoints
- ❌ **Port conflicts**: Ensure unique port mappings in docker-compose

### CSS Framework Errors

- ❌ **Bootstrap JS not imported**: Interactive components require JavaScript
- ❌ **Tailwind purge misconfiguration**: Content paths must match project structure
- ❌ **Material UI theme not configured**: May cause styling inconsistencies

---

## 🔍 Validation Checklist

### Project Structure Validation

- [ ] All critical files present for selected framework
- [ ] Correct entry point configuration
- [ ] Proper directory structure
- [ ] Required configuration files exist

### Dependency Validation

- [ ] All core dependencies installed
- [ ] Peer dependencies resolved
- [ ] Version compatibility verified
- [ ] No conflicting packages

### Docker Validation

- [ ] Multi-stage builds for frontend optimization
- [ ] Health checks implemented
- [ ] Proper port exposure
- [ ] Security best practices (non-root user)

### CSS Framework Validation

- [ ] Correct installation method used
- [ ] Proper import statements
- [ ] Configuration files present
- [ ] Framework-specific setup completed

---

_This document serves as the authoritative reference for AI prompt generation and project validation in the AI Docker Template Generator v2.0.0_

**Last Updated:** September 2025 | **Version:** 2.0.0

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
