// User Preferences Manager - Handles CLI interactions for technology selection
// Gestore Preferenze Utente - Gestisce le interazioni CLI per la selezione delle tecnologie

/**
 * @fileoverview CLI user preferences management module
 * Handles all user interactions for technology selection with intelligent recommendations
 * 
 * @author Filippo Falcone
 * @created 2025
 * @version 2.0.0
 */

const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * Navigation constants for CLI interface
 * Costanti di navigazione per l'interfaccia CLI
 */
const BACK_OPTION = '← Go Back';
const BACK_VALUE = 'back';

/**
 * Simplified technology options focusing on popular stacks
 * Opzioni tecnologiche semplificate focalizzate su stack popolari
 * 
 * @type {Array.<{name: string, frameworks: string[]}>}
 */
const frontendOptions = [
  { name: 'React', frameworks: ['React (Basic)', 'React + Vite', 'Next.js'] },
  { name: 'Vue', frameworks: ['Vue 3', 'Vue + Vite', 'Nuxt.js'] },
  { name: 'Angular', frameworks: ['Angular CLI', 'Angular + Standalone Components'] }
];

/**
 * Backend technology options with popular frameworks
 * Opzioni tecnologiche backend con framework popolari
 * 
 * @type {Array.<{name: string, frameworks: string[]}>}
 */
const backendOptions = [
  { name: 'Node.js', frameworks: ['Express', 'NestJS'] },
  { name: 'PHP', frameworks: ['Laravel'] }
];

/**
 * Available CSS frameworks for styling
 * Framework CSS disponibili per lo styling
 * 
 * @type {string[]}
 */
const cssFrameworks = ['None', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Bulma'];

/**
 * Backend compatibility mapping based on frontend + CSS choices
 * Maps specific frontend-CSS combinations to recommended backend technologies
 * Mappatura di compatibilità backend basata su scelte frontend + CSS
 * 
 * @type {Object.<string, Object.<string, string[]>>}
 */
const backendCompatibility = {
  'Vue': {
    'Bootstrap': ['Laravel', 'Express'],
    'Tailwind CSS': ['Express', 'NestJS'], 
    'Material UI': ['Express', 'NestJS'],
    'None': ['Laravel', 'Express', 'NestJS']
  },
  'React': {
    'Bootstrap': ['Express', 'Laravel'], 
    'Tailwind CSS': ['Express', 'NestJS'],
    'Material UI': ['Express', 'NestJS'],
    'None': ['Express', 'NestJS', 'Laravel']
  },
  'Angular': {
    'Bootstrap': ['Express', 'Laravel'],
    'Material UI': ['NestJS', 'Express'],
    'Tailwind CSS': ['NestJS', 'Express'],
    'None': ['NestJS', 'Express', 'Laravel']
  }
};

/**
 * UserPreferences class for managing CLI user interactions
 * Manages the complete flow of technology selection with intelligent recommendations
 * 
 * @class UserPreferences
 */
class UserPreferences {
  /**
   * Initialize UserPreferences with empty preference structure
   * @constructor
   */
  constructor() {
    this.preferences = {
      projectName: null,
      projectPath: null,
      projectType: null,
      frontend: null,
      frontendFramework: null,
      cssFramework: null,
      backend: null,
      backendFramework: null
    };
  }

  /**
   * Main flow orchestrator for collecting all user preferences
   * Orchestratore del flusso principale per raccogliere tutte le preferenze utente
   * 
   * @async
   * @method collectPreferences
   * @returns {Promise<Object>} Complete user preferences object
   */
  async collectPreferences() {
    // Project basic info / Informazioni base del progetto
    await this.askProjectBasics();
    
    // Project type selection / Selezione tipo progetto
    await this.askProjectType();
    
    // Technology selection based on project type / Selezione tecnologie basata sul tipo progetto
    await this.askTechnologies();
    
    return this.preferences;
  }

  // Collect project name and path / Raccoglie nome e percorso del progetto
  async askProjectBasics() {
    const { projectName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter a name for your project:',
        validate: (input) => input.trim() !== '' ? true : 'Project name is required',
      }
    ]);
    
    this.preferences.projectName = projectName;

    const homeDir = require('os').homedir();
    const path = require('path');
    const defaultPath = path.join(homeDir, 'Projects', projectName);
    
    const { projectPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: 'Enter project path:',
        default: defaultPath,
        validate: (input) => input.trim() !== '' ? true : 'Project path is required',
      }
    ]);
    
    this.preferences.projectPath = projectPath;
  }

  // Ask for project type / Chiede il tipo di progetto
  async askProjectType() {
    const { projectType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectType',
        message: 'Select the project type:',
        choices: [
          { name: 'Frontend Only', value: 'frontend' },
          { name: 'Backend Only', value: 'backend' },
          { name: 'Full Stack', value: 'fullstack' }
        ]
      }
    ]);
    
    this.preferences.projectType = projectType;
  }

  // Technology selection orchestrator / Orchestratore selezione tecnologie
  async askTechnologies() {
    if (['frontend', 'fullstack'].includes(this.preferences.projectType)) {
      await this.askFrontendPreferences();
    }
    
    if (['backend', 'fullstack'].includes(this.preferences.projectType)) {
      await this.askBackendPreferences();
    }
  }

  // Frontend technology selection / Selezione tecnologie frontend
  async askFrontendPreferences() {
    // Frontend technology / Tecnologia frontend
    const { frontend } = await inquirer.prompt([
      {
        type: 'list',
        name: 'frontend',
        message: 'Select a frontend technology:',
        choices: frontendOptions.map(opt => ({ name: opt.name, value: opt.name }))
      }
    ]);
    
    this.preferences.frontend = frontend;

    // Frontend framework / Framework frontend
    const frameworks = frontendOptions.find(opt => opt.name === frontend)?.frameworks || [];
    const { frontendFramework } = await inquirer.prompt([
      {
        type: 'list',
        name: 'frontendFramework',
        message: `Select a ${frontend} framework:`,
        choices: frameworks.map(fw => ({ name: fw, value: fw }))
      }
    ]);
    
    this.preferences.frontendFramework = frontendFramework;

    // CSS framework / Framework CSS
    const { cssFramework } = await inquirer.prompt([
      {
        type: 'list',
        name: 'cssFramework',
        message: 'Select a CSS framework:',
        choices: cssFrameworks.map(css => ({ name: css, value: css }))
      }
    ]);
    
    this.preferences.cssFramework = cssFramework;
  }

  // Backend technology selection with smart recommendations
  // Selezione tecnologie backend con raccomandazioni intelligenti
  async askBackendPreferences() {
    // Get all available backend options / Ottieni tutte le opzioni backend disponibili
    const allBackends = backendOptions.flatMap(opt => opt.frameworks);
    let backendChoices = [];
    
    // If fullstack, add compatibility indicators / Se fullstack, aggiungi indicatori di compatibilità
    if (this.preferences.projectType === 'fullstack' && this.preferences.frontend) {
      const recommended = this.getRecommendedBackends();
      
      // Build choices with compatibility indicators / Costruisci scelte con indicatori di compatibilità
      backendChoices = allBackends.map(backend => {
        const isRecommended = recommended.includes(backend);
        const displayName = isRecommended 
          ? `${backend} ${chalk.green('(Recommended)')}`
          : backend;
        
        return {
          name: displayName,
          value: backend
        };
      });
      
      console.log(chalk.cyan('\n💡 Backends marked as "Recommended" work best with your frontend stack'));
    } else {
      // For backend-only projects, show simple list / Per progetti solo backend, mostra lista semplice
      backendChoices = allBackends.map(backend => ({
        name: backend,
        value: backend
      }));
    }

    // Backend selection / Selezione backend
    const { backend } = await inquirer.prompt([
      {
        type: 'list',
        name: 'backend',
        message: 'Select a backend technology:',
        choices: backendChoices
      }
    ]);
    
    this.preferences.backend = backend;
    this.preferences.backendFramework = backend; // For simplified flow / Per flusso semplificato
  }

  // Get recommended backends based on frontend + CSS selection
  // Ottiene backend raccomandati basati su selezione frontend + CSS
  getRecommendedBackends() {
    const frontend = this.preferences.frontend;
    const css = this.preferences.cssFramework || 'None';
    
    if (frontend && backendCompatibility[frontend] && backendCompatibility[frontend][css]) {
      return backendCompatibility[frontend][css];
    }
    
    return [];
  }

  // Display final configuration summary / Mostra riassunto configurazione finale
  displaySummary() {
    console.log(chalk.yellow('\nProject Configuration Summary:'));
    console.log(chalk.cyan(`- Project Name: ${chalk.bold(this.preferences.projectName)}`));
    console.log(chalk.cyan(`- Project Path: ${chalk.bold(this.preferences.projectPath)}`));
    console.log(chalk.cyan(`- Project Type: ${chalk.bold(this.preferences.projectType)}`));
    
    if (this.preferences.frontend) {
      console.log(chalk.cyan(`- Frontend: ${chalk.bold(this.preferences.frontend)} (${this.preferences.frontendFramework})`));
      console.log(chalk.cyan(`- CSS Framework: ${chalk.bold(this.preferences.cssFramework)}`));
    }
    
    if (this.preferences.backend) {
      console.log(chalk.cyan(`- Backend: ${chalk.bold(this.preferences.backend)}`));
    }
  }

  // Confirm configuration before proceeding / Conferma configurazione prima di procedere
  async confirmConfiguration() {
    this.displaySummary();
    
    const { confirm } = await inquirer.prompt([
      {
        type: 'list',
        name: 'confirm',
        message: 'Ready to generate your project?',
        choices: [
          { name: 'Yes, generate my project', value: 'generate' },
          { name: 'No, modify configuration', value: 'modify' },
          { name: 'Cancel', value: 'cancel' }
        ]
      }
    ]);
    
    return confirm;
  }

  // Reset preferences for modification / Ripristina preferenze per modifica
  reset() {
    this.preferences = {
      projectName: null,
      projectPath: null,
      projectType: null,
      frontend: null,
      frontendFramework: null,
      cssFramework: null,
      backend: null,
      backendFramework: null
    };
  }
}

module.exports = UserPreferences;