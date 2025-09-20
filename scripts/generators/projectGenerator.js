// Project Generator - Main orchestrator for project creation
// Generatore Progetto - Orchestratore principale per la creazione del progetto

const { GoogleGenerativeAI } = require('@google/generative-ai');
/**
 * @fileoverview Main AI-powered project generator module
 * Orchestrates the complete project generation workflow using Google Gemini AI
 * 
 * @author Filippo Falcone
 * @created 2025
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

// Import modular components / Importa componenti modulari
const PromptBuilder = require('./promptBuilder');
const PostGenerationValidator = require('../validators/postGenerationValidator');
const AutoCorrector = require('../validators/autoCorrector');
const Logger = require('../utils/logger');

class ProjectGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    this.promptBuilder = new PromptBuilder();
    this.logger = new Logger();
  }

  // Main project generation flow / Flusso principale di generazione del progetto
  async generateProject(preferences) {
    this.logger.info('Starting project generation', preferences);
    this.logger.userInfo('Generating your project...');
    
    try {
      // 1. Generate file structure / Genera struttura file
      const fileList = await this.generateFileStructure(preferences);
      this.logger.info(`Generated file structure with ${fileList.length} files`, { files: fileList });
      
      if (!fileList || fileList.length === 0) {
        throw new Error('Could not generate project structure');
      }

      // 2. Create project directory / Crea directory del progetto
      this.ensureProjectDirectory(preferences.projectPath);

      // 3. Generate content for each file / Genera contenuto per ogni file
      const filesCreated = await this.generateProjectFiles(preferences, fileList);
      this.logger.userSuccess(`Created ${filesCreated} project files`);

      // 4. Validate and auto-correct (silent) / Valida e correggi automaticamente (silenzioso)
      const validationSuccess = await this.validateAndCorrect(preferences);
      
      // 5. Log generation summary / Registra riassunto generazione
      this.logger.logGenerationSummary(preferences, filesCreated, validationSuccess);

      this.logger.userSuccess(`Project "${preferences.projectName}" created successfully!`);
      console.log(chalk.blue(`📁 Location: ${preferences.projectPath}`));
      console.log(chalk.gray(`� Detailed logs: ${this.logger.getLogPath()}`));
      
      return true;
      
    } catch (error) {
      this.logger.error('Project generation failed', { error: error.message, stack: error.stack });
      this.logger.userError('Project generation failed: ' + error.message);
      return false;
    }
  }

  // Generate project file structure using AI / Genera struttura file del progetto usando AI
  async generateFileStructure(preferences) {
    const promptText = this.buildFileStructurePrompt(preferences);
    this.logger.debug('Built file structure prompt', { promptLength: promptText.length });
    
    const spinner = ora('Designing project architecture...').start();
    
    try {
      const result = await this.model.generateContent(promptText);
      const response = await result.response;
      const text = response.text().trim();
      this.logger.logApiCall('file structure generation', true);

      // Parse JSON array from AI response / Analizza array JSON dalla risposta AI
      const fileList = JSON.parse(text);
      
      if (!Array.isArray(fileList)) {
        throw new Error('AI response is not a valid file list array');
      }

      spinner.succeed(chalk.green(`Architecture designed`));
      this.logger.debug('AI response parsed successfully', { fileCount: fileList.length });
      return fileList;
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to design architecture'));
      this.logger.logApiCall('file structure generation', false, error);
      throw error;
    }
  }

  // Build prompt for file structure generation / Costruisce prompt per generazione struttura file
  buildFileStructurePrompt(preferences) {
    let promptText = this.promptBuilder.buildPrompt({
      frontend: preferences.frontend || preferences.frontendFramework,
      backend: preferences.backend || preferences.backendFramework,
      cssFramework: preferences.cssFramework,
      includeDocker: true,
      includeAuth: false,
      isFullStack: preferences.projectType === 'fullstack'
    });

    promptText += `

**CURRENT TASK: Generate complete file structure as JSON array**

User selections:
- Project Type: ${preferences.projectType}
- Frontend: ${preferences.frontend || 'N/A'} (${preferences.frontendFramework || 'N/A'})
- CSS Framework: ${preferences.cssFramework || 'N/A'}
- Backend: ${preferences.backend || 'N/A'} (${preferences.backendFramework || 'N/A'})

**CRITICAL OUTPUT REQUIREMENTS:**
1. Your response MUST be a single, raw, valid JSON array
2. Do not include any other text, explanations, or markdown
3. Generate COMPLETE framework structure (not minimal files)
4. Include ALL configuration files mentioned in the rules above
5. NO auto-generated files (package-lock.json, composer.lock, etc.)

Example JSON output:
[
  "docker-compose.yml",
  "README.md",
  "frontend/package.json",
  "frontend/Dockerfile",
  "frontend/src/App.vue",
  "backend/composer.json",
  "backend/Dockerfile",
  "backend/bootstrap/app.php"
]`;

    return promptText;
  }

  // Generate content for all project files / Genera contenuto per tutti i file del progetto
  async generateProjectFiles(preferences, fileList) {
    const spinner = ora(`Generating project files...`).start();
    let filesCreated = 0;

    for (const filePath of fileList) {
      try {
        const content = await this.generateSingleFileContent(preferences, filePath, fileList);
        
        if (content) {
          this.writeFileToProject(preferences.projectPath, filePath, content);
          filesCreated++;
          this.logger.logFileGeneration(filePath, true);
        } else {
          this.logger.logFileGeneration(filePath, false, new Error('No content generated'));
        }
      } catch (error) {
        this.logger.logFileGeneration(filePath, false, error);
      }
    }

    spinner.succeed(chalk.green(`Generated ${filesCreated}/${fileList.length} files`));
    return filesCreated;
  }

  // Generate content for a single file / Genera contenuto per un singolo file
  async generateSingleFileContent(preferences, filePath, fileList) {
    let promptText = this.promptBuilder.buildPrompt({
      frontend: preferences.frontend || preferences.frontendFramework,
      backend: preferences.backend || preferences.backendFramework,
      cssFramework: preferences.cssFramework,
      includeDocker: true,
      includeAuth: false,
      isFullStack: preferences.projectType === 'fullstack'
    });

    promptText += `

**CURRENT TASK: Generate content for specific file**

**Project Stack:**
- Project Type: ${preferences.projectType}
- Frontend: ${preferences.frontend || 'N/A'} (${preferences.frontendFramework || 'N/A'})
- CSS Framework: ${preferences.cssFramework || 'N/A'}
- Backend: ${preferences.backend || 'N/A'} (${preferences.backendFramework || 'N/A'})
- Project Name: ${preferences.projectName}

**Full Project Structure for Context:**
\`\`\`json
${JSON.stringify(fileList, null, 2)}
\`\`\`

**File to Generate:** \`${filePath}\`

**CRITICAL OUTPUT REQUIREMENTS:**
1. Generate ONLY the raw code/text for the requested file
2. NO explanations, comments, or markdown wrappers
3. Content must be directly writable to disk
4. Follow all technology-specific rules mentioned above

**Output must be ONLY raw file content for \`${filePath}\`. No markdown, no explanations.**
`;

    try {
      const result = await this.model.generateContent(promptText);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(chalk.red(`Error generating content for ${filePath}:`), error.message);
      return `// Error: Failed to generate content for ${filePath}`;
    }
  }

  // Write file content to project directory / Scrivi contenuto file nella directory del progetto
  writeFileToProject(projectPath, filePath, content) {
    const fullPath = path.join(projectPath, filePath);
    const dirname = path.dirname(fullPath);

    // Create directory if it doesn't exist / Crea directory se non esiste
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    // Write file content / Scrivi contenuto file
    fs.writeFileSync(fullPath, content, 'utf8');
  }

  // Ensure project directory exists / Assicura che la directory del progetto esista
  ensureProjectDirectory(projectPath) {
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }
  }

  // Validate generated project and auto-correct issues (silent) / Valida progetto generato e correggi automaticamente i problemi (silenzioso)
  async validateAndCorrect(preferences) {
    this.logger.info('Starting project validation');
    
    const validator = new PostGenerationValidator();
    const autoCorrector = new AutoCorrector(this.apiKey);
    
    let validationAttempts = 0;
    const maxAttempts = 3;
    let finalSuccess = false;
    
    while (validationAttempts < maxAttempts) {
      validationAttempts++;
      
      // Validate generated project / Valida progetto generato
      const validationResult = await validator.validateGeneratedProject(
        preferences.projectPath,
        preferences.projectType,
        preferences
      );
      
      this.logger.logValidation(validationAttempts, validationResult);
      
      if (validationResult.isValid) {
        this.logger.info('Project validation PASSED');
        finalSuccess = true;
        break;
      } else {
        this.logger.warn(`Validation found ${validationResult.errors.length} issues`, {
          errors: validationResult.errors,
          missingFiles: validationResult.missingFiles,
          incompleteFiles: validationResult.incompleteFiles
        });
        
        if (validationAttempts >= maxAttempts) {
          this.logger.warn('Max correction attempts reached');
          break;
        }
        
        // Auto-correction / Correzione automatica
        this.logger.info('Attempting automatic correction');
        const correctionResult = await autoCorrector.correctProject(
          preferences.projectPath,
          validationResult,
          preferences.projectType,
          preferences
        );
        
        if (correctionResult.success) {
          this.logger.info(`Applied ${correctionResult.corrections.length} corrections`);
        } else {
          this.logger.error(`Auto-correction failed: ${correctionResult.error}`);
          break;
        }
      }
    }
    
    return finalSuccess;
  }
}

module.exports = ProjectGenerator;