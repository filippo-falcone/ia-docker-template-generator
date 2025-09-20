// API Key Manager - Handles Google Gemini API key configuration
// Gestore Chiave API - Gestisce la configurazione della chiave API di Google Gemini

const fs = require('fs');
const path = require('path');
/**
 * @fileoverview Google Gemini API key management module
 * Handles secure API key configuration, storage, and environment detection
 * 
 * @author Filippo Falcone
 * @created 2025
 * @version 2.0.0
 */

const inquirer = require('inquirer');
const chalk = require('chalk');

class ApiKeyManager {
  constructor() {
    this.envPath = path.join(process.cwd(), '.env');
  }

  // Main method to get or prompt for API key / Metodo principale per ottenere o richiedere la chiave API
  async getApiKey() {
    // First check environment variables (both naming conventions) / Prima controlla le variabili d'ambiente (entrambe le convenzioni di naming)
    let apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      console.log(chalk.green('✓ Google API Key found in environment'));
      return apiKey;
    }

    // If not found, prompt user / Se non trovata, chiedi all'utente
    console.log(chalk.yellow('⚠ Google API Key not found'));
    apiKey = await this.promptForApiKey();
    
    if (!apiKey) {
      throw new Error('Google API Key is required to generate project templates');
    }

    // Ask if user wants to save for future use / Chiedi se l'utente vuole salvare per uso futuro
    await this.offerToSaveApiKey(apiKey);
    
    return apiKey;
  }

  // Prompt user to enter API key / Chiedi all'utente di inserire la chiave API
  async promptForApiKey() {
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your Google Gemini API Key:',
        mask: '*',
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'API Key is required';
          }
          if (input.length < 20) {
            return 'API Key seems too short. Please check and try again';
          }
          return true;
        }
      }
    ]);
    
    return apiKey;
  }

  // Offer to save API key to .env file / Offri di salvare la chiave API nel file .env
  async offerToSaveApiKey(apiKey) {
    const { saveToken } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'saveToken',
        message: 'Save API key to .env file for future use?',
        default: true
      }
    ]);
    
    if (saveToken) {
      const success = this.saveApiKeyToEnv(apiKey);
      if (success) {
        console.log(chalk.green('✓ API Key saved to .env file'));
      } else {
        console.log(chalk.yellow('⚠ Could not save API key, but continuing...'));
      }
    }
  }

  // Save API key to .env file / Salva la chiave API nel file .env
  saveApiKeyToEnv(apiKey) {
    try {
      let envContent = '';
      
      // Check if .env exists and read its content / Controlla se .env esiste e leggi il contenuto
      if (fs.existsSync(this.envPath)) {
        envContent = fs.readFileSync(this.envPath, 'utf8');
        
        // Check if GOOGLE_API_KEY already exists / Controlla se GOOGLE_API_KEY esiste già
        const envLines = envContent.split('\n');
        let tokenExists = false;
        
        // Update existing or add new / Aggiorna esistente o aggiungi nuovo
        const newContent = envLines.map(line => {
          if (line.trim().startsWith('GOOGLE_API_KEY=')) {
            tokenExists = true;
            return `GOOGLE_API_KEY=${apiKey}`;
          }
          return line;
        }).join('\n');
        
        // If token doesn't exist, add it / Se il token non esiste, aggiungilo
        if (!tokenExists) {
          envContent = newContent + `\nGOOGLE_API_KEY=${apiKey}\n`;
        } else {
          envContent = newContent;
        }
      } else {
        // Create new .env file / Crea nuovo file .env
        envContent = `GOOGLE_API_KEY=${apiKey}\n`;
      }
      
      // Write to .env file / Scrivi nel file .env
      fs.writeFileSync(this.envPath, envContent, 'utf8');
      return true;
      
    } catch (error) {
      console.error(chalk.red('Error saving API key:'), error.message);
      return false;
    }
  }

  // Validate API key format / Valida il formato della chiave API
  validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    
    // Basic validation - Google API keys are typically 39 characters
    // Validazione base - le chiavi API di Google sono tipicamente di 39 caratteri
    if (apiKey.length < 20) {
      return false;
    }
    
    // Check for common prefixes / Controlla prefissi comuni
    if (apiKey.startsWith('AIza') || apiKey.startsWith('gcp-')) {
      return true;
    }
    
    // If doesn't match common patterns, still allow (might be valid)
    // Se non corrisponde a pattern comuni, permetti comunque (potrebbe essere valida)
    return true;
  }

  // Display help information about getting an API key / Mostra informazioni di aiuto per ottenere una chiave API
  displayApiKeyHelp() {
    console.log(chalk.cyan('\n📋 How to get a Google Gemini API Key:'));
    console.log(chalk.white('1. Go to https://console.cloud.google.com/'));
    console.log(chalk.white('2. Create a new project or select existing one'));
    console.log(chalk.white('3. Enable the Gemini API'));
    console.log(chalk.white('4. Go to "Credentials" and create an API key'));
    console.log(chalk.white('5. Copy the API key and paste it here\n'));
  }
}

module.exports = ApiKeyManager;