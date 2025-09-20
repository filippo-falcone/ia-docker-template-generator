#!/usr/bin/env node
// filepath: c:\Users\falco\Projects\ia-docker-template-generator\index_new.js
// AI Docker Template Generator - Simplified Entry Point
// Generatore Template Docker AI - Punto di Ingresso Semplificato

const chalk = require('chalk');
require('dotenv').config({ quiet: true });

// Import modular components / Importa componenti modulari
/**
 * @fileoverview Main entry point for AI Docker Template Generator
 * Coordinates the complete workflow from user preferences to project generation
 * 
 * @author Filippo Falcone
 * @created 2025
 * @version 2.0.0
 */

const { UserPreferences } = require('./scripts/cli/userPreferences');
const ApiKeyManager = require('./scripts/cli/apiKeyManager');
const ProjectGenerator = require('./scripts/generators/projectGenerator');

// Main application class / Classe principale dell'applicazione
class TemplateGenerator {
  constructor() {
    this.userPreferences = new UserPreferences();
    this.apiKeyManager = new ApiKeyManager();
  }

  // Application entry point / Punto di ingresso dell'applicazione
  async run() {
    try {
      this.displayWelcome();
      
      // 1. Collect user preferences / Raccoglie preferenze utente
      const preferences = await this.collectUserPreferences();
      
      // 2. Get API key / Ottieni chiave API
      const apiKey = await this.apiKeyManager.getApiKey();
      
      // 3. Generate project / Genera progetto
      const generator = new ProjectGenerator(apiKey);
      await generator.generateProject(preferences);
      
      this.displaySuccess();
      
    } catch (error) {
      this.handleError(error);
    }
  }

  // Display welcome message / Mostra messaggio di benvenuto
  displayWelcome() {
    console.log(chalk.cyan('================================='));
    console.log(`| ${chalk.bold.yellow('AI Docker Template Generator')}  |`);
    console.log(chalk.cyan('================================='));
    console.log(chalk.white('Generate modern web projects with Docker integration\n'));
  }

  // Collect user preferences with confirmation flow / Raccoglie preferenze utente con flusso di conferma
  async collectUserPreferences() {
    let preferences;
    let confirmed = false;
    
    while (!confirmed) {
      // Collect all preferences / Raccoglie tutte le preferenze
      preferences = await this.userPreferences.collectPreferences();
      
      // Show summary and confirm / Mostra riassunto e conferma
      const confirmation = await this.userPreferences.confirmConfiguration();
      
      if (confirmation === 'generate') {
        confirmed = true;
      } else if (confirmation === 'modify') {
        console.log(chalk.yellow('Restarting configuration...\n'));
        this.userPreferences.reset();
      } else if (confirmation === 'cancel') {
        console.log(chalk.red('Project generation cancelled. Goodbye!'));
        process.exit(0);
      }
    }
    
    return preferences;
  }

  // Display success message / Mostra messaggio di successo
  displaySuccess() {
    console.log(chalk.green('\n🎉 Project generation completed successfully!'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white('1. Navigate to your project directory'));
    console.log(chalk.white('2. Read the README.md for setup instructions'));
    console.log(chalk.white('3. Run: docker compose up --build'));
    console.log(chalk.yellow('\nHappy coding! 🚀'));
  }

  // Handle application errors / Gestisce errori dell'applicazione
  handleError(error) {
    console.error(chalk.red('\n❌ Application Error:'), error.message);
    
    if (error.message.includes('API')) {
      console.log(chalk.yellow('\n💡 Tip: Make sure your Google Gemini API key is valid'));
      console.log(chalk.white('Get your key at: https://console.cloud.google.com/'));
    }
    
    console.log(chalk.gray('\nFor support, visit: https://github.com/filippo-falcone/ia-docker-template-generator'));
    process.exit(1);
  }
}

// Run the application / Esegui l'applicazione
async function main() {
  const app = new TemplateGenerator();
  await app.run();
}

// Execute if run directly / Esegui se avviato direttamente
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = TemplateGenerator;