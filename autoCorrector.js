// Automatic Project Correction System
// Utilizza AI per correggere automaticamente i problemi rilevati

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class AutoCorrector {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async correctProject(projectPath, validationResult, projectType, selections) {
        if (!validationResult.hasIssues) {
            console.log('✅ Project validation passed - no corrections needed');
            return { success: true, corrections: [] };
        }

        console.log('🔧 Starting automatic project correction...');
        
        const corrections = [];
        
        try {
            // 1. Correggi file mancanti
            if (validationResult.missingFiles.length > 0) {
                console.log(`📁 Generating ${validationResult.missingFiles.length} missing files...`);
                const missingFileCorrections = await this.generateMissingFiles(
                    projectPath, 
                    validationResult.missingFiles, 
                    projectType, 
                    selections
                );
                corrections.push(...missingFileCorrections);
            }

            // 2. Correggi contenuti incompleti
            if (validationResult.incompleteFiles.length > 0) {
                console.log(`📝 Fixing ${validationResult.incompleteFiles.length} incomplete files...`);
                const contentCorrections = await this.fixIncompleteFiles(
                    projectPath,
                    validationResult.incompleteFiles,
                    projectType,
                    selections
                );
                corrections.push(...contentCorrections);
            }

            console.log(`✅ Applied ${corrections.length} corrections successfully`);
            return { success: true, corrections };

        } catch (error) {
            console.error('❌ Error during automatic correction:', error.message);
            return { success: false, error: error.message, corrections };
        }
    }

    async generateMissingFiles(projectPath, missingFiles, projectType, selections) {
        const corrections = [];
        
        for (const missingFile of missingFiles) {
            try {
                console.log(`   📄 Generating: ${missingFile}`);
                
                const prompt = this.createFileGenerationPrompt(missingFile, projectType, selections);
                const result = await this.model.generateContent(prompt);
                const content = result.response.text();
                
                // Estrai il contenuto del file dalla risposta
                const fileContent = this.extractFileContent(content);
                
                // Crea la directory se non esiste
                const filePath = path.join(projectPath, missingFile);
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                
                // Scrivi il file
                fs.writeFileSync(filePath, fileContent, 'utf8');
                
                corrections.push({
                    type: 'file_created',
                    file: missingFile,
                    success: true
                });
                
            } catch (error) {
                console.error(`   ❌ Failed to generate ${missingFile}:`, error.message);
                corrections.push({
                    type: 'file_created',
                    file: missingFile,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return corrections;
    }

    async fixIncompleteFiles(projectPath, incompleteFiles, projectType, selections) {
        const corrections = [];
        
        for (const incompleteFile of incompleteFiles) {
            try {
                console.log(`   🔧 Fixing: ${incompleteFile.file} (missing: ${incompleteFile.missing})`);
                
                const filePath = path.join(projectPath, incompleteFile.file);
                const currentContent = fs.readFileSync(filePath, 'utf8');
                
                const prompt = this.createContentFixPrompt(
                    incompleteFile.file,
                    currentContent,
                    incompleteFile.missing,
                    projectType,
                    selections
                );
                
                const result = await this.model.generateContent(prompt);
                const response = result.response.text();
                
                // Estrai il contenuto corretto
                const fixedContent = this.extractFileContent(response);
                
                // Scrivi il file corretto
                fs.writeFileSync(filePath, fixedContent, 'utf8');
                
                corrections.push({
                    type: 'content_fixed',
                    file: incompleteFile.file,
                    missing: incompleteFile.missing,
                    success: true
                });
                
            } catch (error) {
                console.error(`   ❌ Failed to fix ${incompleteFile.file}:`, error.message);
                corrections.push({
                    type: 'content_fixed',
                    file: incompleteFile.file,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return corrections;
    }

    createFileGenerationPrompt(fileName, projectType, selections) {
        const { frontend, backend, cssFramework } = selections;
        
        return `
GENERA SOLO IL CONTENUTO del file: ${fileName}

CONTESTO:
- Tipo progetto: ${projectType}
- Frontend: ${frontend || 'N/A'}
- Backend: ${backend || 'N/A'}  
- CSS Framework: ${cssFramework || 'N/A'}

REQUISITI CRITICI:
1. Genera ESATTAMENTE il contenuto che dovrebbe avere ${fileName} in un'installazione ufficiale
2. Usa gli standard più recenti e le best practices
3. NON aggiungere commenti extra o spiegazioni
4. Il contenuto deve essere production-ready
5. Segui le convenzioni ufficiali del framework

${this.getFileSpecificInstructions(fileName, projectType, selections)}

IMPORTANTE: Restituisci SOLO il contenuto del file, senza wrapper di codice o spiegazioni.
`;
    }

    createContentFixPrompt(fileName, currentContent, missingContent, projectType, selections) {
        return `
CORREGGI il file: ${fileName}

CONTENUTO ATTUALE:
\`\`\`
${currentContent}
\`\`\`

MANCA QUESTO CONTENUTO CRITICO:
${missingContent}

ISTRUZIONI:
1. Aggiungi il contenuto mancante nel posto corretto
2. Mantieni tutto il contenuto esistente che è corretto
3. Assicurati che il risultato sia sintatticamente valido
4. Segui gli standard ufficiali per ${projectType}

IMPORTANTE: Restituisci SOLO il contenuto completo e corretto del file.
`;
    }

    getFileSpecificInstructions(fileName, projectType, selections) {
        const instructions = {
            'package.json': `
Per package.json di ${selections.frontend || 'progetto'} con ${selections.cssFramework || 'CSS'}:
- Includi TUTTE le dipendenze necessarie
- Scripts standard: dev, build, preview
- Versioni aggiornate e compatibili
- Nome progetto appropriato`,

            'vite.config.js': `
Per vite.config.js:
- Import e configurazione plugin corretti
- Alias @ per src/
- Configurazione ottimale per ${selections.frontend}`,

            'src/main.js': `
Per main.js Vue.js:
- Import createApp da vue
- Mount su #app
- Se router/pinia richiesti, include setup`,

            'src/main.jsx': `
Per main.jsx React:
- Import React e ReactDOM
- Render del componente App
- StrictMode wrapper`,

            'README.md': `
Per README.md:
- Titolo progetto
- Istruzioni Docker complete
- Commands per development
- Struttura progetto
- Sezione Prerequisites`,

            'docker-compose.yml': `
Per docker-compose.yml:
- Formato moderno (senza version)
- Health checks
- Volumi per hot reload
- Porte corrette
- Dipendenze tra servizi`,

            'nginx.conf': `
Per nginx.conf:
- SPA routing con try_files
- Proxy per API backend  
- Configurazione ottimale`,

            '.gitignore': `
Per .gitignore di ${projectType}:
- node_modules/
- dist/
- .env files
- IDE files
- OS files
- Build artifacts`,

            'Dockerfile': `
Per Dockerfile:
- Multi-stage build
- Node.js alpine base
- COPY ottimizzato
- Health check
- Security best practices`
        };

        return instructions[fileName] || 'Segui gli standard ufficiali del framework.';
    }

    extractFileContent(aiResponse) {
        // Rimuovi wrapper di codice se presenti
        let content = aiResponse.trim();
        
        // Rimuovi ```language e ``` wrapper
        content = content.replace(/^```[\w]*\n?/, '');
        content = content.replace(/\n?```$/, '');
        
        // Rimuovi eventuali spiegazioni iniziali/finali
        const lines = content.split('\n');
        
        // Trova l'inizio del contenuto reale del file
        let startIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('{') || 
                line.startsWith('import ') || 
                line.startsWith('<!DOCTYPE') ||
                line.startsWith('<') ||
                line.startsWith('FROM ') ||
                line.startsWith('version:') ||
                line.startsWith('services:') ||
                line.startsWith('server {') ||
                line.startsWith('#') && lines[i+1]?.trim().startsWith('FROM')) {
                startIndex = i;
                break;
            }
        }
        
        return lines.slice(startIndex).join('\n').trim();
    }

    // Metodo per testare la correzione su un singolo file
    async testCorrection(fileName, projectType, selections) {
        console.log(`🧪 Testing correction for: ${fileName}`);
        try {
            const prompt = this.createFileGenerationPrompt(fileName, projectType, selections);
            const result = await this.model.generateContent(prompt);
            const content = this.extractFileContent(result.response.text());
            
            console.log(`📄 Generated content for ${fileName}:`);
            console.log('---');
            console.log(content.substring(0, 200) + '...');
            console.log('---');
            
            return content;
        } catch (error) {
            console.error(`❌ Test failed for ${fileName}:`, error.message);
            return null;
        }
    }
}

module.exports = AutoCorrector;