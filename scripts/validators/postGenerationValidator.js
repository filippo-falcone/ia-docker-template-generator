// Post-Generation Validation and Correction System
// Verifica e corregge automaticamente i progetti generati

/**
 * @fileoverview Post-generation project validation module
 * Validates generated projects against framework standards and best practices
 * 
 * @author Filippo Falcone
 * @created 2025
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');

class PostGenerationValidator {
    constructor() {
        this.validationErrors = [];
        this.missingFiles = [];
        this.incompleteFiles = [];
        this.standardDefinitions = this.loadStandardDefinitions();
    }

    // Definizioni degli standard ufficiali per ogni framework
    loadStandardDefinitions() {
        return {
            // Frontend-only Vue project / Progetto Vue solo frontend
            'vue3-vite': {
                requiredFiles: [
                    'frontend/package.json',
                    'frontend/package-lock.json',
                    'frontend/vite.config.js',
                    'frontend/index.html',
                    'frontend/src/main.js',
                    'frontend/src/App.vue',
                    'frontend/README.md',
                    'frontend/Dockerfile',
                    'docker-compose.yml',
                    'frontend/nginx.conf',
                    'frontend/.gitignore',
                    'frontend/.dockerignore'
                ],
                packageJsonRequirements: {
                    dependencies: ['vue'],
                    devDependencies: ['@vitejs/plugin-vue', 'vite'],
                    scripts: ['dev', 'build', 'preview']
                },
                fileContentRequirements: {
                    'vite.config.js': [
                        'import { defineConfig }',
                        'import vue from',
                        'plugins: [vue()]'
                    ],
                    'src/main.js': [
                        'import { createApp }',
                        'import App from',
                        '.mount(\'#app\')'
                    ],
                    'index.html': [
                        '<div id="app">',
                        'src="/src/main.js"'
                    ]
                }
            },
            
            // Fullstack Vue + Laravel project / Progetto fullstack Vue + Laravel
            'vue3-vite-fullstack': {
                requiredFiles: [
                    'docker-compose.yml',
                    'README.md',
                    'frontend/package.json',
                    'frontend/package-lock.json',
                    'frontend/vite.config.js', 
                    'frontend/index.html',
                    'frontend/src/main.js',
                    'frontend/src/App.vue',
                    'frontend/Dockerfile',
                    'frontend/nginx.conf',
                    'frontend/.gitignore',
                    'backend/composer.json',
                    'backend/composer.lock',
                    'backend/artisan',
                    'backend/bootstrap/app.php',
                    'backend/app/Http/Controllers/Controller.php',
                    'backend/app/Models/User.php',
                    'backend/routes/web.php',
                    'backend/routes/api.php',
                    'backend/.env.example',
                    'backend/Dockerfile',
                    'backend/.gitignore'
                ],
                packageJsonRequirements: {
                    dependencies: ['vue'],
                    devDependencies: ['@vitejs/plugin-vue', 'vite'],
                    scripts: ['dev', 'build', 'preview']
                },
                composerJsonRequirements: {
                    require: ['php', 'laravel/framework'],
                    'require-dev': ['phpunit/phpunit']
                },
                fileContentRequirements: {
                    'frontend/vite.config.js': [
                        'import { defineConfig }',
                        'import vue from',
                        'plugins: [vue()]'
                    ],
                    'frontend/src/main.js': [
                        'import { createApp }',
                        'import App from',
                        '.mount(\'#app\')'
                    ],
                    'frontend/index.html': [
                        '<div id="app">',
                        'src="/src/main.js"'
                    ]
                }
            },

            'vue3-vite-full': {
                requiredFiles: [
                    'package.json',
                    'vite.config.js', 
                    'index.html',
                    'src/main.js',
                    'src/App.vue',
                    'src/router/index.js',
                    'src/stores/counter.js',
                    'README.md',
                    'Dockerfile',
                    'docker-compose.yml',
                    'nginx.conf',
                    '.gitignore',
                    '.dockerignore'
                ],
                packageJsonRequirements: {
                    dependencies: ['vue', 'vue-router', 'pinia'],
                    devDependencies: ['@vitejs/plugin-vue', 'vite'],
                    scripts: ['dev', 'build', 'preview']
                }
            },
            
            'laravel': {
                requiredFiles: [
                    'composer.json',
                    'artisan',
                    'app/Http/Kernel.php',
                    'app/Models/User.php',
                    'routes/web.php',
                    'routes/api.php',
                    '.env.example',
                    'README.md',
                    'Dockerfile',
                    'docker-compose.yml',
                    '.gitignore',
                    '.dockerignore'
                ],
                composerJsonRequirements: {
                    require: ['php', 'laravel/framework'],
                    'require-dev': ['phpunit/phpunit']
                }
            },
            
            'react-vite': {
                requiredFiles: [
                    'frontend/package.json',
                    'frontend/package-lock.json',
                    'frontend/vite.config.js',
                    'frontend/index.html',
                    'frontend/src/main.jsx',
                    'frontend/src/App.jsx',
                    'frontend/README.md',
                    'frontend/Dockerfile',
                    'docker-compose.yml',
                    'frontend/nginx.conf',
                    'frontend/.gitignore',
                    'frontend/.dockerignore'
                ],
                packageJsonRequirements: {
                    dependencies: ['react', 'react-dom'],
                    devDependencies: ['@vitejs/plugin-react', 'vite'],
                    scripts: ['dev', 'build', 'preview']
                }
            }
        };
    }

    // Validazione principale post-generazione
    async validateGeneratedProject(projectPath, projectType, selections) {
        console.log(`🔍 Validating generated project at: ${projectPath}`);
        
        this.validationErrors = [];
        this.missingFiles = [];
        this.incompleteFiles = [];

        // Determina lo standard da utilizzare
        const standardKey = this.getStandardKey(projectType, selections);
        const standard = this.standardDefinitions[standardKey];
        
        if (!standard) {
            this.validationErrors.push(`No validation standard found for: ${standardKey}`);
            return this.getValidationResult();
        }

        // 1. Verifica file richiesti
        await this.validateRequiredFiles(projectPath, standard.requiredFiles);
        
        // 2. Verifica contenuto dei file
        await this.validateFileContents(projectPath, standard);
        
        // 3. Verifica dipendenze
        await this.validateDependencies(projectPath, standard);

        // 4. Validazioni specifiche per framework
        await this.validateFrameworkSpecific(projectPath, standardKey, selections);

        return this.getValidationResult();
    }

    getStandardKey(projectType, selections) {
        if (projectType === 'fullstack') {
            // Fullstack project standards / Standard per progetti fullstack
            if (selections.frontend?.includes('Vue') && selections.backend?.includes('Laravel')) {
                return 'vue3-vite-fullstack';
            } else if (selections.frontend?.includes('React') && selections.backend?.includes('Laravel')) {
                return 'react-laravel-fullstack';
            } else if (selections.frontend?.includes('Vue')) {
                return 'vue3-vite-fullstack'; // Default fullstack Vue
            }
        } else if (projectType === 'frontend') {
            if (selections.frontend?.includes('Vue')) {
                return selections.cssFramework && selections.cssFramework !== 'None' ? 'vue3-vite-full' : 'vue3-vite';
            } else if (selections.frontend?.includes('React')) {
                return 'react-vite';
            }
        } else if (projectType === 'backend') {
            if (selections.backend?.includes('Laravel')) {
                return 'laravel';
            }
        }
        return 'vue3-vite'; // default
    }

    async validateRequiredFiles(projectPath, requiredFiles) {
        for (const filePath of requiredFiles) {
            const fullPath = path.join(projectPath, filePath);
            if (!fs.existsSync(fullPath)) {
                this.missingFiles.push(filePath);
                this.validationErrors.push(`Missing required file: ${filePath}`);
            }
        }
    }

    async validateFileContents(projectPath, standard) {
        if (!standard.fileContentRequirements) return;

        for (const [filePath, requiredContents] of Object.entries(standard.fileContentRequirements)) {
            const fullPath = path.join(projectPath, filePath);
            if (!fs.existsSync(fullPath)) continue;

            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                for (const requiredContent of requiredContents) {
                    if (!content.includes(requiredContent)) {
                        this.incompleteFiles.push({
                            file: filePath,
                            missing: requiredContent
                        });
                        this.validationErrors.push(`File ${filePath} missing required content: ${requiredContent}`);
                    }
                }
            } catch (error) {
                this.validationErrors.push(`Error reading file ${filePath}: ${error.message}`);
            }
        }
    }

    async validateDependencies(projectPath, standard) {
        // Validate package.json / Valida package.json
        if (standard.packageJsonRequirements) {
            // Check for package.json in root or frontend/ for fullstack projects
            // Controlla package.json nella root o in frontend/ per progetti fullstack
            const possiblePaths = ['package.json', 'frontend/package.json'];
            let packageJsonFound = false;
            
            for (const pkgPath of possiblePaths) {
                const packageJsonPath = path.join(projectPath, pkgPath);
                if (fs.existsSync(packageJsonPath)) {
                    try {
                        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                        this.validatePackageJsonDependencies(packageJson, standard.packageJsonRequirements);
                        packageJsonFound = true;
                        break;
                    } catch (error) {
                        this.validationErrors.push(`Error parsing ${pkgPath}: ${error.message}`);
                    }
                }
            }
            
            if (!packageJsonFound) {
                this.validationErrors.push('No package.json found in expected locations');
            }
        }

        // Validate composer.json / Valida composer.json
        if (standard.composerJsonRequirements) {
            // Check for composer.json in root or backend/ for fullstack projects
            // Controlla composer.json nella root o in backend/ per progetti fullstack
            const possiblePaths = ['composer.json', 'backend/composer.json'];
            let composerJsonFound = false;
            
            for (const composerPath of possiblePaths) {
                const composerJsonPath = path.join(projectPath, composerPath);
                if (fs.existsSync(composerJsonPath)) {
                    try {
                        const composerJson = JSON.parse(fs.readFileSync(composerJsonPath, 'utf8'));
                        this.validateComposerJsonDependencies(composerJson, standard.composerJsonRequirements);
                        composerJsonFound = true;
                        break;
                    } catch (error) {
                        this.validationErrors.push(`Error parsing ${composerPath}: ${error.message}`);
                    }
                }
            }
            
            if (!composerJsonFound && standard.composerJsonRequirements) {
                this.validationErrors.push('No composer.json found in expected locations');
            }
        }
    }

    validatePackageJsonDependencies(packageJson, requirements) {
        // Verifica dependencies
        if (requirements.dependencies) {
            const deps = packageJson.dependencies || {};
            for (const dep of requirements.dependencies) {
                if (!deps[dep]) {
                    this.validationErrors.push(`Missing dependency in package.json: ${dep}`);
                }
            }
        }

        // Verifica devDependencies  
        if (requirements.devDependencies) {
            const devDeps = packageJson.devDependencies || {};
            for (const dep of requirements.devDependencies) {
                if (!devDeps[dep]) {
                    this.validationErrors.push(`Missing devDependency in package.json: ${dep}`);
                }
            }
        }

        // Verifica scripts
        if (requirements.scripts) {
            const scripts = packageJson.scripts || {};
            for (const script of requirements.scripts) {
                if (!scripts[script]) {
                    this.validationErrors.push(`Missing script in package.json: ${script}`);
                }
            }
        }
    }

    validateComposerJsonDependencies(composerJson, requirements) {
        if (requirements.require) {
            const require = composerJson.require || {};
            for (const dep of requirements.require) {
                if (!require[dep]) {
                    this.validationErrors.push(`Missing requirement in composer.json: ${dep}`);
                }
            }
        }
    }

    async validateFrameworkSpecific(projectPath, standardKey, selections) {
        // Validazioni specifiche per framework
        if (standardKey.includes('vue')) {
            await this.validateVueSpecific(projectPath, selections);
        } else if (standardKey.includes('react')) {
            await this.validateReactSpecific(projectPath, selections);
        } else if (standardKey.includes('laravel')) {
            await this.validateLaravelSpecific(projectPath, selections);
        }
    }

    async validateVueSpecific(projectPath, selections) {
        // Verifica che vite.config.js abbia il plugin Vue
        const viteConfigPath = path.join(projectPath, 'vite.config.js');
        if (fs.existsSync(viteConfigPath)) {
            const content = fs.readFileSync(viteConfigPath, 'utf8');
            if (!content.includes('plugin-vue')) {
                this.validationErrors.push('vite.config.js missing Vue plugin import');
            }
        }

        // Se include Bootstrap, verifica l'integrazione
        if (selections.cssFramework === 'Bootstrap') {
            const packageJsonPath = path.join(projectPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                const content = fs.readFileSync(packageJsonPath, 'utf8');
                if (!content.includes('bootstrap')) {
                    this.validationErrors.push('Bootstrap dependency missing in package.json');
                }
            }
        }
    }

    async validateReactSpecific(projectPath, selections) {
        // Validazioni specifiche per React
        const viteConfigPath = path.join(projectPath, 'vite.config.js');
        if (fs.existsSync(viteConfigPath)) {
            const content = fs.readFileSync(viteConfigPath, 'utf8');
            if (!content.includes('plugin-react')) {
                this.validationErrors.push('vite.config.js missing React plugin import');
            }
        }
    }

    async validateLaravelSpecific(projectPath, selections) {
        // Validazioni specifiche per Laravel
        const envExamplePath = path.join(projectPath, '.env.example');
        if (!fs.existsSync(envExamplePath)) {
            this.validationErrors.push('Laravel project missing .env.example file');
        }
    }

    getValidationResult() {
        return {
            isValid: this.validationErrors.length === 0,
            errors: this.validationErrors,
            missingFiles: this.missingFiles,
            incompleteFiles: this.incompleteFiles,
            hasIssues: this.validationErrors.length > 0 || this.missingFiles.length > 0 || this.incompleteFiles.length > 0
        };
    }

    // Generate prompt to fix detected issues / Genera un prompt per correggere i problemi rilevati
    generateFixPrompt(validationResult, projectType, selections) {
        if (!validationResult.hasIssues) {
            return null;
        }

        let fixPrompt = `
## AUTOMATIC CORRECTION REQUIRED

The following issues have been detected in the generated project and must be corrected:

### Missing Files:
${validationResult.missingFiles.map(file => `- ${file}`).join('\n')}

### Incomplete Content:
${validationResult.incompleteFiles.map(item => `- ${item.file}: missing "${item.missing}"`).join('\n')}

### Validation Errors:
${validationResult.errors.join('\n')}

## CORRECTION INSTRUCTIONS:

CREATE ONLY THE MISSING FILES AND FIX THE INCOMPLETE CONTENT.
DO NOT recreate files that already exist and work correctly.

For each missing file, generate it with the official standard content for ${projectType} with ${selections.frontend || selections.backend}.

For each incomplete content, add only the missing lines to the existing file.

ENSURE that each generated file follows exactly the official framework standards.
`;

        return fixPrompt;
    }
}

module.exports = PostGenerationValidator;