// fileWriter.js
// Modulo per scrivere file su disco rimuovendo delimitatori markdown

const fs = require('fs');

/**
 * Rimuove i delimitatori markdown dal contenuto di un file generato
 * @param {string} content - Il contenuto del file generato
 * @returns {string} - Contenuto pulito senza delimitatori markdown
 */
function cleanMarkdownDelimiters(content) {
  // Rimuove blocchi come ```json, ```js, ```dockerfile, ecc.
  return content.replace(/```[a-zA-Z0-9]*\n([\s\S]*?)```/g, '$1').trim();
}

/**
 * Scrive un file su disco, rimuovendo i delimitatori markdown se presenti
 * @param {string} filePath - Percorso del file da scrivere
 * @param {string} content - Contenuto da scrivere
 */
function writeFileClean(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const cleanContent = cleanMarkdownDelimiters(content);
  fs.writeFileSync(filePath, cleanContent, 'utf8');
}

module.exports = {
  writeFileClean,
  cleanMarkdownDelimiters
};
