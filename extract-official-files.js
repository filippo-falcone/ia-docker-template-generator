// Script per estrarre e serializzare tutti i file da una cartella (ricorsivo)
// Salva i risultati in un file JSON pronto per l'uso nei prompt AI

const fs = require('fs');
const path = require('path');

function walkDir(dir, fileList = [], baseDir = dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const relPath = path.relative(baseDir, filePath).replace(/\\/g, '/');
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList, baseDir);
    } else {
      fileList.push(relPath);
    }
  });
  return fileList;
}

function extractFilesToJson(srcDir, outFile) {
  const allFiles = walkDir(srcDir);
  const result = {};
  allFiles.forEach(relPath => {
    const absPath = path.join(srcDir, relPath);
    result[relPath] = fs.readFileSync(absPath, 'utf8');
  });
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
  console.log(`Estrazione completata. File salvato in: ${outFile}`);
}

// Uso: node extract-official-files.js temp/react-vite-official
// Se non viene passato nessun argomento, default su vite-vue-official
const inputDir = process.argv[2] || 'temp/vite-vue-official';
const absSrcDir = path.isAbsolute(inputDir) ? inputDir : path.join(__dirname, inputDir);
const outFile = absSrcDir + '-files.json';

extractFilesToJson(absSrcDir, outFile);
