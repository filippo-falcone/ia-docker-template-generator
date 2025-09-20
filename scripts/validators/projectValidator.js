// Pre-build Validation System
// Prevents common errors before Docker build starts

class ProjectValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  // Validate complete project structure
  validateProject(fileList, preferences) {
    this.errors = [];
    this.warnings = [];

    // Core validations
    this.validateCoreFiles(fileList, preferences);
    this.validateDependencies(fileList, preferences);
    this.validateDockerSetup(fileList, preferences);
    this.validateFrameworkSpecific(fileList, preferences);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  validateCoreFiles(fileList, preferences) {
    // README.md should always be present
    if (!fileList.includes('README.md')) {
      this.errors.push('Missing README.md - Every project needs documentation');
    }

    // .gitignore should always be present
    if (!fileList.includes('.gitignore')) {
      this.errors.push('Missing .gitignore - Version control hygiene required');
    }

    // Environment example files
    if (preferences.backend === 'Laravel') {
      if (!fileList.some(f => f.includes('.env.example'))) {
        this.errors.push('Missing .env.example - Laravel requires environment template');
      }
    }
  }

  validateDependencies(fileList, preferences) {
    // Frontend dependencies
    if (preferences.frontend === 'Vue') {
      const frontendPackageJson = fileList.find(f => f.endsWith('package.json') && f.includes('frontend'));
      if (!frontendPackageJson) {
        this.errors.push('Missing frontend/package.json - Vue.js requires dependency management');
      }

      // Check for vite.config.js
      if (!fileList.some(f => f.includes('vite.config.js'))) {
        this.errors.push('Missing vite.config.js - Vue.js requires Vite configuration');
      }
    }

    // Backend dependencies
    if (preferences.backend === 'Laravel') {
      const backendComposerJson = fileList.find(f => f.endsWith('composer.json') && f.includes('backend'));
      if (!backendComposerJson) {
        this.errors.push('Missing backend/composer.json - Laravel requires dependency management');
      }

      // Check for artisan
      if (!fileList.some(f => f.includes('artisan'))) {
        this.errors.push('Missing artisan file - Laravel requires artisan CLI tool');
      }
    }
  }

  validateDockerSetup(fileList, preferences) {
    const isFullStack = preferences.projectType === 'fullstack' || preferences.projectType === 'Full Stack';
    
    if (isFullStack) {
      // Docker Compose is mandatory for fullstack
      if (!fileList.includes('docker-compose.yml')) {
        this.errors.push('Missing docker-compose.yml - Fullstack projects require container orchestration');
      }

      // Frontend Dockerfile
      if (preferences.frontend && !fileList.some(f => f.includes('frontend') && f.includes('Dockerfile'))) {
        this.errors.push('Missing frontend/Dockerfile - Frontend requires containerization');
      }

      // Backend Dockerfile
      if (preferences.backend && !fileList.some(f => f.includes('backend') && f.includes('Dockerfile'))) {
        this.errors.push('Missing backend/Dockerfile - Backend requires containerization');
      }

      // Nginx config for Vue.js
      if (preferences.frontend === 'Vue' && !fileList.some(f => f.includes('nginx.conf'))) {
        this.errors.push('Missing nginx.conf - Vue.js SPA requires nginx configuration for routing');
      }

      // Supervisor config for Laravel
      if (preferences.backend === 'Laravel' && !fileList.some(f => f.includes('supervisord.conf'))) {
        this.warnings.push('Consider adding supervisord.conf for Laravel multi-process management');
      }
    }
  }

  validateFrameworkSpecific(fileList, preferences) {
    // Vue.js specific validations
    if (preferences.frontend === 'Vue') {
      // Index.html must be in root, not public/
      if (fileList.some(f => f.includes('public/index.html'))) {
        this.errors.push('index.html should be in root directory, not public/ (Vue 3 + Vite pattern)');
      }

      if (!fileList.some(f => f.includes('index.html') && !f.includes('public/'))) {
        this.errors.push('Missing index.html in root - Vue.js requires HTML entry point');
      }

      // App.vue must exist
      if (!fileList.some(f => f.includes('App.vue'))) {
        this.errors.push('Missing App.vue - Vue.js requires root component');
      }

      // main.js must exist
      if (!fileList.some(f => f.includes('main.js'))) {
        this.errors.push('Missing main.js - Vue.js requires JavaScript entry point');
      }

      // Router validation
      if (preferences.frontendOptions && preferences.frontendOptions.includes('router')) {
        if (!fileList.some(f => f.includes('router/index.js'))) {
          this.errors.push('Missing router/index.js - Vue Router requires router configuration');
        }
      }

      // Pinia validation
      if (preferences.frontendOptions && preferences.frontendOptions.includes('pinia')) {
        if (!fileList.some(f => f.includes('stores/') || f.includes('store/'))) {
          this.errors.push('Missing store files - Pinia requires store configuration');
        }
      }
    }

    // Laravel specific validations
    if (preferences.backend === 'Laravel') {
      // Bootstrap/app.php must exist
      if (!fileList.some(f => f.includes('bootstrap/app.php'))) {
        this.errors.push('Missing bootstrap/app.php - Laravel requires application bootstrap');
      }

      // Routes must exist
      if (!fileList.some(f => f.includes('routes/web.php'))) {
        this.errors.push('Missing routes/web.php - Laravel requires web routes');
      }

      if (!fileList.some(f => f.includes('routes/api.php'))) {
        this.warnings.push('Missing routes/api.php - Consider adding API routes for frontend communication');
      }

      // Models directory
      if (!fileList.some(f => f.includes('app/Models/'))) {
        this.errors.push('Missing app/Models/ - Laravel requires models directory');
      }

      // Controllers directory
      if (!fileList.some(f => f.includes('app/Http/Controllers/'))) {
        this.errors.push('Missing app/Http/Controllers/ - Laravel requires controllers');
      }

      // Database migrations
      if (!fileList.some(f => f.includes('database/migrations/'))) {
        this.errors.push('Missing database/migrations/ - Laravel requires database migrations');
      }

      // Welcome view
      if (!fileList.some(f => f.includes('resources/views/welcome.blade.php'))) {
        this.errors.push('Missing welcome.blade.php - Laravel should include welcome page');
      }
    }

    // CSS Framework validations
    if (preferences.cssFramework === 'Bootstrap') {
      // Should be imported in main entry file
      this.warnings.push('Ensure Bootstrap is imported in main.js/app.js for proper styling');
    }
  }

  // Generate validation rules for AI prompt
  getValidationRules(preferences) {
    const rules = [];

    rules.push(`
**VALIDATION REQUIREMENTS - PREVENT COMMON ERRORS:**

V1. **Mandatory Files Check:**
- README.md (project documentation)
- .gitignore (version control hygiene)
${preferences.projectType === 'fullstack' ? '- docker-compose.yml (container orchestration)' : ''}
${preferences.backend === 'Laravel' ? '- backend/.env.example (environment template)' : ''}
    `);

    if (preferences.frontend === 'Vue') {
      rules.push(`
V2. **Vue.js Critical Files:**
- index.html in ROOT directory (NOT public/)
- src/main.js (JavaScript entry point)
- src/App.vue (root component)
- vite.config.js (build configuration)
- frontend/package.json (dependency management)
${preferences.projectType === 'fullstack' ? '- frontend/Dockerfile (containerization)' : ''}
${preferences.projectType === 'fullstack' ? '- frontend/nginx.conf (SPA routing configuration)' : ''}
      `);
    }

    if (preferences.backend === 'Laravel') {
      rules.push(`
V3. **Laravel Critical Files:**
- artisan (CLI tool)
- bootstrap/app.php (application bootstrap)
- routes/web.php (web routes)
- routes/api.php (API routes)
- app/Models/User.php (base model)
- app/Http/Controllers/Controller.php (base controller)
- database/migrations/[timestamp]_create_users_table.php
- resources/views/welcome.blade.php (welcome page)
- backend/composer.json (dependency management)
${preferences.projectType === 'fullstack' ? '- backend/Dockerfile (containerization)' : ''}
      `);
    }

    return rules.join('\n');
  }
}

module.exports = { ProjectValidator };