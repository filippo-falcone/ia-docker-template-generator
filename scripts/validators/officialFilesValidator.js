// officialFilesValidator.js
// Modulo per validare che i file generati corrispondano esattamente ai file ufficiali di uno stack

const fs = require('fs');
const path = require('path');

/**
 * Confronta i file generati con quelli ufficiali (all-or-nothing)
 * @param {string} generatedDir - Directory radice dei file generati
 * @param {Object} officialFiles - Oggetto { percorso: contenuto } dei file ufficiali
 * @returns {Object} - { isValid: boolean, missingFiles: [], extraFiles: [], mismatchedFiles: [] }
 */
function validateAgainstOfficial(generatedDir, officialFiles) {
  const missingFiles = [];
  const extraFiles = [];
  const mismatchedFiles = [];

  // Trova tutti i file generati (ricorsivo)
  function walk(dir, relPath = '', acc = {}) {
    const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      const relEntryPath = path.join(relPath, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        walk(entryPath, relEntryPath, acc);
      } else {
        acc[relEntryPath] = fs.readFileSync(entryPath, 'utf8');
      }
    }
    return acc;
  }
  const generatedFiles = walk(generatedDir);

  // Controlla file mancanti e contenuto
  for (const [file, content] of Object.entries(officialFiles)) {
    if (!(file in generatedFiles)) {
      missingFiles.push(file);
    } else if (generatedFiles[file] !== content) {
      mismatchedFiles.push(file);
    }
  }

  // Controlla file extra
  for (const file of Object.keys(generatedFiles)) {
    if (!(file in officialFiles)) {
      extraFiles.push(file);
    }
  }

  return {
    isValid: missingFiles.length === 0 && extraFiles.length === 0 && mismatchedFiles.length === 0,
    missingFiles,
    extraFiles,
    mismatchedFiles
  };
}

module.exports = {
  validateAgainstOfficial
};
