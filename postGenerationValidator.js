// Post-Generation Validation and Correction System
// Verifica e corregge automaticamente i progetti generati

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
            'vue3-vite': {
                requiredFiles: [
                    'package.json',
                    'vite.config.js', 
                    'index.html',
                    'src/main.js',
                    'src/App.vue',
                    'README.md',
                    'Dockerfile',
                    'docker-compose.yml',
                    'nginx.conf',
                    '.gitignore',
                    '.dockerignore'
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
                    'package.json',
                    'vite.config.js',
                    'index.html',
                    'src/main.jsx',
                    'src/App.jsx',
                    'README.md',
                    'Dockerfile',
                    'docker-compose.yml',
                    'nginx.conf',
                    '.gitignore',
                    '.dockerignore'
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
        if (projectType === 'frontend') {
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
        // Valida package.json
        if (standard.packageJsonRequirements) {
            const packageJsonPath = path.join(projectPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                try {
                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                    this.validatePackageJsonDependencies(packageJson, standard.packageJsonRequirements);
                } catch (error) {
                    this.validationErrors.push(`Error parsing package.json: ${error.message}`);
                }
            }
        }

        // Valida composer.json
        if (standard.composerJsonRequirements) {
            const composerJsonPath = path.join(projectPath, 'composer.json');
            if (fs.existsSync(composerJsonPath)) {
                try {
                    const composerJson = JSON.parse(fs.readFileSync(composerJsonPath, 'utf8'));
                    this.validateComposerJsonDependencies(composerJson, standard.composerJsonRequirements);
                } catch (error) {
                    this.validationErrors.push(`Error parsing composer.json: ${error.message}`);
                }
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

    // Genera un prompt per correggere i problemi trovati
    generateFixPrompt(validationResult, projectType, selections) {
        if (!validationResult.hasIssues) {
            return null;
        }

        let fixPrompt = `
## CORREZIONE AUTOMATICA RICHIESTA

I seguenti problemi sono stati rilevati nel progetto generato e devono essere corretti:

### File Mancanti:
${validationResult.missingFiles.map(file => `- ${file}`).join('\n')}

### Contenuti Incompleti:
${validationResult.incompleteFiles.map(item => `- ${item.file}: manca "${item.missing}"`).join('\n')}

### Errori di Validazione:
${validationResult.errors.join('\n')}

## ISTRUZIONI PER LA CORREZIONE:

CREA SOLO I FILE MANCANTI E CORREGGI I CONTENUTI INCOMPLETI.
NON ricreare file che già esistono e funzionano correttamente.

Per ogni file mancante, generalo con il contenuto standard ufficiale per ${projectType} con ${selections.frontend || selections.backend}.

Per ogni contenuto incompleto, aggiungi solo le righe mancanti al file esistente.

ASSICURATI che ogni file generato segua esattamente gli standard ufficiali del framework.
`;

        return fixPrompt;
    }
}

module.exports = PostGenerationValidator;