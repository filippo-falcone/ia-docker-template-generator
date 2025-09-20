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

const { writeFileClean } = require('./fileWriter');
const FileStructureGenerator = require('./fileStructureGenerator');
const FileContentGenerator = require('./fileContentGenerator');
const { ensureProjectDirectory, deleteProjectDirectory } = require('./projectDirectoryManager');

// Import modular components / Importa componenti modulari
const PromptBuilder = require('./promptBuilder');
const PostGenerationValidator = require('../validators/postGenerationValidator');
const AutoCorrector = require('../validators/autoCorrector');
const Logger = require('../utils/logger');
const { resolveStackName, getOfficialFilesDir, loadOfficialFiles } = require('./stackResolver');
const { validateAgainstOfficial } = require('../validators/officialFilesValidator');

class ProjectGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  this.promptBuilder = new PromptBuilder();
  this.logger = new Logger();
  this.fileStructureGenerator = new FileStructureGenerator(this.model, this.promptBuilder, this.logger);
  this.fileContentGenerator = new FileContentGenerator(this.model, this.promptBuilder, this.logger);
  }

  // Main project generation flow / Flusso principale di generazione del progetto
  async generateProject(preferences) {
    this.logger.info('Starting project generation', preferences);
    this.logger.userInfo('Generating your project...');

    // Risolvi stack e carica file ufficiali
    const stackName = resolveStackName(preferences);
    const officialFilesDir = getOfficialFilesDir(stackName);
    const officialFiles = loadOfficialFiles(stackName);
    this.logger.debug('Stack risolto', { stackName, officialFilesDir, officialFilesCount: Object.keys(officialFiles).length });


  // 1. Assicura che la directory progetto esista
  ensureProjectDirectory(preferences.projectPath);

  // 2. Genera la struttura file
  const fileList = await this.fileStructureGenerator.generateFileStructure(preferences);

  // 3. Genera i contenuti dei file e scrivili su disco
  await this.generateProjectFiles(preferences, fileList);

    // Validazione: confronta i file generati con quelli ufficiali
    const validationResult = validateAgainstOfficial(preferences.projectPath, officialFiles);
    if (validationResult.isValid) {
      this.logger.info('Validazione superata: tutti i file corrispondono agli ufficiali!');
    } else {
      this.logger.warn('Validazione fallita:', validationResult);
      // Cancella la cartella progetto se la validazione fallisce
      try {
        const fsPromises = require('fs').promises;
        if (fs.existsSync(preferences.projectPath)) {
          await fsPromises.rm(preferences.projectPath, { recursive: true, force: true });
          this.logger.info(`Cartella progetto eliminata: ${preferences.projectPath}`);
        }
      } catch (err) {
        this.logger.error(`Errore durante la cancellazione della cartella progetto: ${err.message}`);
      }
    }

    return validationResult.isValid;
  }


  // (RIMOSSO: la logica è ora in fileStructureGenerator.js)


  // Genera contenuto per tutti i file del progetto con indicazione progresso (ora usa fileContentGenerator)
  async generateProjectFiles(preferences, fileList) {
  console.log(`📁 Creating ${fileList.length} project files...`);
    let filesCreated = 0;
    for (let i = 0; i < fileList.length; i++) {
      const filePath = fileList[i];
      const progress = Math.round(((i + 1) / fileList.length) * 100);
  const fileName = filePath.length > 45 ? '...' + filePath.slice(-42) : filePath;
  process.stdout.write(`\r⚡ Generating... ${i + 1}/${fileList.length} (${progress}%) ${fileName}`);
      try {
        const content = await this.fileContentGenerator.generateSingleFileContent(preferences, filePath, fileList);
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
  process.stdout.write('\r' + ' '.repeat(120) + '\r');
  console.log(`✔ Generated ${filesCreated}/${fileList.length} files`);
    return filesCreated;
  }


  // (RIMOSSO: la logica è ora in fileContentGenerator.js)


  // Write file content to project directory / Scrivi contenuto file nella directory del progetto
  writeFileToProject(projectPath, filePath, content) {
    const fullPath = path.join(projectPath, filePath);
    writeFileClean(fullPath, content);
  }


  // (RIMOSSO: ora usa ensureProjectDirectory da projectDirectoryManager.js)

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


  // Cleanup failed project - remove all generated files / Pulisci progetto fallito - rimuovi tutti i file generati
  async cleanupFailedProject(projectPath) {
    await deleteProjectDirectory(projectPath, this.logger);
  }
}

module.exports = ProjectGenerator;