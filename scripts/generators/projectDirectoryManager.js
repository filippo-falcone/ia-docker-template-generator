// projectDirectoryManager.js
// Modulo per la gestione delle directory del progetto (creazione, controllo, cancellazione)

const fs = require('fs');

function ensureProjectDirectory(projectPath) {
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }
}

async function deleteProjectDirectory(projectPath, logger) {
  try {
    const fsPromises = require('fs').promises;
    if (fs.existsSync(projectPath)) {
      await fsPromises.rm(projectPath, { recursive: true, force: true });
      if (logger) logger.info(`Cartella progetto eliminata: ${projectPath}`);
    }
  } catch (err) {
    if (logger) logger.error(`Errore durante la cancellazione della cartella progetto: ${err.message}`);
  }
}

module.exports = {
  ensureProjectDirectory,
  deleteProjectDirectory
};
