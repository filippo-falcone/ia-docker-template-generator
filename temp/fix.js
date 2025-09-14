const fs = require('fs');
const filePath = '../index.js';
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/await prompt\(/g, 'await inquirer.prompt(');
fs.writeFileSync(filePath, content);
console.log('Fixed all prompt references');