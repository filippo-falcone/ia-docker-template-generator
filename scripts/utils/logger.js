// Logger System - Handles application logging separated from user interface
// Sistema Logger - Gestisce il logging dell'applicazione separato dall'interfaccia utente

/**
 * @fileoverview Advanced logging system for AI Docker Template Generator
 * Provides comprehensive logging capabilities with file management and user-friendly output
 * 
 * Features:
 * - Separated user interface from technical logging
 * - Automatic log file rotation and cleanup
 * - Multiple log levels (INFO, WARN, ERROR, DEBUG)
 * - Timestamped entries for debugging
 * - Clean user feedback methods
 * 
 * @author Filippo Falcone
 * @created 2025
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Logger class for comprehensive logging and user feedback
 * Manages both technical logging to files and clean user interface output
 * 
 * @class Logger
 */
class Logger {
  /**
   * Initialize Logger with timestamp-based log file
   * Sets up log directory and creates new log file for current session
   * 
   * @constructor
   */
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, `generation-${this.getTimestamp()}.log`);
    this.ensureLogDirectory();
  }

  // Ensure log directory exists / Assicura che la directory log esista
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // Get formatted timestamp (local time) / Ottieni timestamp formattato (ora locale)
  getTimestamp() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
  }

  // Get current time for log entries / Ottieni ora corrente per voci log
  getCurrentTime() {
    return new Date().toISOString();
  }

  // Write to log file / Scrivi nel file di log
  writeToFile(level, message, data = null) {
    const timestamp = this.getCurrentTime();
    let logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      logEntry += `\nData: ${JSON.stringify(data, null, 2)}`;
    }
    
    logEntry += '\n\n';
    
    try {
      fs.appendFileSync(this.logFile, logEntry, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  // Log levels / Livelli di log
  info(message, data = null) {
    this.writeToFile('INFO', message, data);
  }

  warn(message, data = null) {
    this.writeToFile('WARN', message, data);
  }

  error(message, data = null) {
    this.writeToFile('ERROR', message, data);
  }

  debug(message, data = null) {
    this.writeToFile('DEBUG', message, data);
  }

  // Log validation details / Registra dettagli di validazione
  logValidation(attempt, result) {
    this.info(`Validation attempt ${attempt}`, {
      isValid: result.isValid,
      errorCount: result.errors?.length || 0,
      missingFiles: result.missingFiles || [],
      incompleteFiles: result.incompleteFiles || [],
      errors: result.errors || []
    });
  }

  // Log file generation details / Registra dettagli generazione file
  logFileGeneration(filePath, success, error = null) {
    if (success) {
      this.debug(`Generated file: ${filePath}`);
    } else {
      this.error(`Failed to generate file: ${filePath}`, { error: error?.message });
    }
  }

  // Log project generation summary / Registra riassunto generazione progetto
  logGenerationSummary(preferences, fileCount, success) {
    this.info('Project generation completed', {
      projectName: preferences.projectName,
      projectType: preferences.projectType,
      frontend: preferences.frontend,
      backend: preferences.backend,
      cssFramework: preferences.cssFramework,
      filesGenerated: fileCount,
      success: success
    });
  }

  // Log API calls / Registra chiamate API
  logApiCall(type, success, error = null) {
    if (success) {
      this.debug(`API call successful: ${type}`);
    } else {
      this.error(`API call failed: ${type}`, { error: error?.message });
    }
  }

  // User-facing methods for important messages / Metodi rivolti all'utente per messaggi importanti
  userInfo(message) {
    console.log(chalk.blue('ℹ '), chalk.white(message));
    this.info(`USER: ${message}`);
  }

  userSuccess(message) {
    console.log(chalk.green('✓'), chalk.white(message));
    this.info(`USER SUCCESS: ${message}`);
  }

  userWarning(message) {
    console.log(chalk.yellow('⚠'), chalk.white(message));
    this.warn(`USER WARNING: ${message}`);
  }

  userError(message) {
    console.log(chalk.red('✗'), chalk.white(message));
    this.error(`USER ERROR: ${message}`);
  }

  // Display log file location for debugging / Mostra posizione file di log per debugging
  getLogPath() {
    return this.logFile;
  }

  // Clean old log files (keep last 10) / Pulisci vecchi file di log (mantieni ultimi 10)
  cleanOldLogs() {
    try {
      const files = fs.readdirSync(this.logDir)
        .filter(file => file.startsWith('generation-') && file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.logDir, file),
          time: fs.statSync(path.join(this.logDir, file)).mtime
        }))
        .sort((a, b) => b.time - a.time);

      // Keep only the 10 most recent logs / Mantieni solo i 10 log più recenti
      if (files.length > 10) {
        const toDelete = files.slice(10);
        toDelete.forEach(file => {
          try {
            fs.unlinkSync(file.path);
            this.debug(`Cleaned old log file: ${file.name}`);
          } catch (error) {
            this.error(`Failed to clean log file: ${file.name}`, { error: error.message });
          }
        });
      }
    } catch (error) {
      this.error('Failed to clean old logs', { error: error.message });
    }
  }
}

module.exports = Logger;