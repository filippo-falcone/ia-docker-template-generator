// stackResolver.js
// Modulo per risolvere stack e percorsi file ufficiali in base alle preferenze utente

const path = require('path');
const fs = require('fs');

/**
 * Mappa le preferenze utente al nome dello stack ufficiale (es. 'react-basic', 'vue-vite', ecc.)
 * @param {Object} preferences - Preferenze utente raccolte dal CLI
 * @returns {string} - Nome stack ufficiale
 */
function resolveStackName(preferences) {
  // Esempio di mapping base, da estendere secondo le regole del progetto
  const frontend = (preferences.frontendFramework || preferences.frontend || '').toLowerCase();
  if (frontend.includes('next')) return 'nextjs';
  if (frontend.includes('vite') && frontend.includes('react')) return 'react-vite';
  if (frontend.includes('vite') && frontend.includes('vue')) return 'vue-vite';
  if (frontend.includes('vue')) return 'vue-basic';
  if (frontend.includes('react')) return 'react-basic';
  if (frontend.includes('angular')) return 'angular-cli';
  // fallback
  return 'custom';
}

/**
 * Restituisce il percorso della cartella dei file ufficiali per lo stack
 * @param {string} stackName - Nome stack ufficiale
 * @returns {string} - Percorso assoluto cartella file ufficiali
 */
function getOfficialFilesDir(stackName) {
  return path.resolve(process.cwd(), 'temp', `${stackName}-official`);
}

/**
 * Carica tutti i file ufficiali per uno stack come oggetto { percorso: contenuto }
 * @param {string} stackName
 * @returns {Object} - Oggetto con chiavi = percorsi file, valori = contenuto
 */
function loadOfficialFiles(stackName) {
  const dir = getOfficialFilesDir(stackName);
  const files = {};
  if (!fs.existsSync(dir)) return files;
  function walk(currentDir, relPath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      const relEntryPath = path.join(relPath, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath, relEntryPath);
      } else {
        files[relEntryPath.replace(/\\/g, '/')] = fs.readFileSync(entryPath, 'utf8');
      }
    }
  }
  walk(dir);
  return files;
}

module.exports = {
  resolveStackName,
  getOfficialFilesDir,
  loadOfficialFiles
};
