#!/usr/bin/env node

const inquirer = require('inquirer');
const { prompt } = inquirer;
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config();

// Constants for CLI UI - Used for navigation throughout the application
// Costanti per l'interfaccia CLI - Utilizzate per la navigazione nell'applicazione
const BACK_OPTION = '← Go Back';
const BACK_VALUE = '__back__';
const EXIT_OPTION = '× Exit';
const EXIT_VALUE = '__exit__';

// Technology choices for prompts - Used in technology selection menus
// Opzioni tecnologiche per i prompt - Utilizzate nei menu di selezione delle tecnologie
const frontendOptions = [
  { name: 'React', frameworks: ['React (Basic)', 'React + Vite', 'Next.js'] },
  { name: 'Vue', frameworks: ['Vue 3', 'Vue + Vite', 'Nuxt.js'] },
  { name: 'Angular', frameworks: ['Angular CLI', 'Angular + Standalone Components'] }
];

const backendOptions = [
  { name: 'Node.js', frameworks: ['Express', 'NestJS', 'Fastify'] },
  { name: 'Python', frameworks: ['Django', 'Flask', 'FastAPI'] },
  { name: 'PHP', frameworks: ['Laravel', 'Symfony', 'Slim'] }
];

const cssFrameworks = ['None', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Bulma'];

// Main function to start the CLI application
// This is the entry point of the program
// Funzione principale per avviare l'applicazione CLI
// Questo è il punto di ingresso del programma
async function main() {
  console.log('=================================');
  console.log('| AI Docker Template Generator  |');
  console.log('=================================');
  
  try {
    await startProjectCreationFlow(); // Start the interactive project creation flow
                                     // Avvia il flusso interattivo di creazione del progetto
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

// Frontend technology selection
// This function handles the selection of frontend technologies and frameworks
// It includes back navigation at each step
// Selezione della tecnologia frontend
// Questa funzione gestisce la selezione delle tecnologie e dei framework frontend
// Include la navigazione indietro in ogni fase
async function askFrontendPreferences(preferences) {
  // Frontend technology selection with back option
  // Selezione della tecnologia frontend con opzione per tornare indietro
  while (!preferences.frontend) {
    const frontendResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'frontend',
        message: 'Select a frontend technology:',
        choices: [
          ...frontendOptions.map(opt => ({ name: opt.name, value: opt.name })),
          { name: BACK_OPTION, value: BACK_VALUE }
        ]
      }
    ]);
    
    if (frontendResponse.frontend === BACK_VALUE) {
      preferences.projectType = null; // Go back to project type selection
      return;
    }
    
    preferences.frontend = frontendResponse.frontend;
  }
  
  // Frontend framework
  while (!preferences.frontendFramework) {
    // Find frameworks for the selected frontend technology
    const frameworks = frontendOptions.find(opt => opt.name === preferences.frontend)?.frameworks || [];
    
    const frameworkResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'frontendFramework',
        message: `Select a ${preferences.frontend} framework:`,
        choices: [
          ...frameworks.map(fw => ({ name: fw, value: fw })),
          { name: BACK_OPTION, value: BACK_VALUE }
        ]
      }
    ]);
    
    if (frameworkResponse.frontendFramework === BACK_VALUE) {
      preferences.frontend = null; // Go back to frontend selection
      return;
    }
    
    preferences.frontendFramework = frameworkResponse.frontendFramework;
  }
  
  // CSS framework
  while (!preferences.cssFramework) {
    const cssResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'cssFramework',
        message: 'Select a CSS framework:',
        choices: [
          ...cssFrameworks.map(css => ({ name: css, value: css })),
          { name: BACK_OPTION, value: BACK_VALUE }
        ]
      }
    ]);
    
    if (cssResponse.cssFramework === BACK_VALUE) {
      preferences.frontendFramework = null; // Go back to framework selection
      return;
    }
    
    preferences.cssFramework = cssResponse.cssFramework;
  }
}

// Backend technology selection
async function askBackendPreferences(preferences) {
  // Backend technology selection with back option
  // Similar to frontend, but for server-side technologies
  // Selezione della tecnologia backend con opzione per tornare indietro
  // Simile al frontend, ma per tecnologie lato server
  while (!preferences.backend) {
    const backendResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'backend',
        message: 'Select a backend technology:',
        choices: [
          ...backendOptions.map(opt => ({ name: opt.name, value: opt.name })),
          { name: BACK_OPTION, value: BACK_VALUE }
        ]
      }
    ]);
    
    if (backendResponse.backend === BACK_VALUE) {
      preferences.projectType = null; // Go back to project type selection
      return;
    }
    
    preferences.backend = backendResponse.backend;
  }
  
  // Backend framework
  while (!preferences.backendFramework) {
    // Find frameworks for the selected backend technology
    const frameworks = backendOptions.find(opt => opt.name === preferences.backend)?.frameworks || [];
    
    const frameworkResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'backendFramework',
        message: `Select a ${preferences.backend} framework:`,
        choices: [
          ...frameworks.map(fw => ({ name: fw, value: fw })),
          { name: BACK_OPTION, value: BACK_VALUE }
        ]
      }
    ]);
    
    if (frameworkResponse.backendFramework === BACK_VALUE) {
      preferences.backend = null; // Go back to backend selection
      return;
    }
    
    preferences.backendFramework = frameworkResponse.backendFramework;
  }
}

// Complete the project configuration flow
async function completeProjectFlow(preferences) {
  // This function coordinates the technology selection based on project type
  // and handles the final confirmation before project generation
  // Questa funzione coordina la selezione della tecnologia in base al tipo di progetto
  // e gestisce la conferma finale prima della generazione del progetto
  
  // Select frontend technologies if needed
  // Seleziona le tecnologie frontend se necessario
  if (['frontend', 'fullstack'].includes(preferences.projectType)) {
    await askFrontendPreferences(preferences);
    
    // If user went back to project type selection
    if (!preferences.projectType) {
      return false;
    }
  }
  
  // Select backend technologies if needed
  if (['backend', 'fullstack'].includes(preferences.projectType)) {
    await askBackendPreferences(preferences);
    
    // If user went back to project type selection
    if (!preferences.projectType) {
      return false;
    }
  }
  
  // Final confirmation of all preferences
  console.log('\nProject Configuration Summary:');
  console.log(`- Project Name: ${preferences.projectName}`);
  console.log(`- Project Path: ${preferences.projectPath}`);
  console.log(`- Project Type: ${preferences.projectType}`);
  
  if (preferences.frontend) {
    console.log(`- Frontend: ${preferences.frontend} (${preferences.frontendFramework})`);
    console.log(`- CSS Framework: ${preferences.cssFramework}`);
  }
  
  if (preferences.backend) {
    console.log(`- Backend: ${preferences.backend} (${preferences.backendFramework})`);
  }
  
  const confirmResponse = await inquirer.prompt([
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
  
  if (confirmResponse.confirm === 'cancel') {
    console.log('Project generation cancelled.');
    process.exit(0);
  }
  
  if (confirmResponse.confirm === 'modify') {
    // Reset project type to start flow again
    preferences.projectType = null;
    preferences.frontend = null;
    preferences.frontendFramework = null;
    preferences.cssFramework = null;
    preferences.backend = null;
    preferences.backendFramework = null;
    return false;
  }
  
  return true;
}

// Save API key to .env file
// Function to save API key to .env file for future use
// This improves user experience by not requiring the token on every run
// Funzione per salvare la chiave API nel file .env per uso futuro
// Migliora l'esperienza utente non richiedendo il token ad ogni esecuzione
function saveApiKeyToEnv(apiKey) {
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  // Check if .env exists and read its content
  // Verifica se esiste il file .env e legge il suo contenuto
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if HF_TOKEN already exists in the file
    const envLines = envContent.split('\n');
    let tokenExists = false;
    
    // Create new content with updated token
    const newContent = envLines.map(line => {
      if (line.trim().startsWith('HF_TOKEN=')) {
        tokenExists = true;
        return `HF_TOKEN=${apiKey}`;
      }
      return line;
    }).join('\n');
    
    // If token doesn't exist in file, add it
    if (!tokenExists) {
      envContent = newContent + `\nHF_TOKEN=${apiKey}\n`;
    } else {
      envContent = newContent;
    }
  } else {
    // Create new .env file with token
    envContent = `HF_TOKEN=${apiKey}\n`;
  }
  
  // Write to .env file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('Hugging Face token saved to .env file');
    return true;
  } catch (error) {
    console.error('Error saving token to .env file:', error.message);
    return false;
  }
}

// Ask for Hugging Face API Token
// First checks environment variables, then prompts user if not found
// Also offers to save the token for future use
// Richiede il token API di Hugging Face
// Prima controlla le variabili d'ambiente, poi chiede all'utente se non lo trova
// Offre anche di salvare il token per uso futuro
async function askApiKey() {
  let apiKey = process.env.HF_TOKEN;
  if (!apiKey) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your Hugging Face access token:',
      },
    ]);
    apiKey = answer.apiKey;
    
    // Ask if the user wants to save the token for future use
    const saveAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'saveToken',
        message: 'Do you want to save the token for future use?',
        default: true
      },
    ]);
    
    if (saveAnswer.saveToken) {
      saveApiKeyToEnv(apiKey);
    }
  }
  return apiKey;
}

// Generate project structure and Dockerfile using Hugging Face
// Generate project structure using Hugging Face's API
// This creates a detailed prompt based on user selections to guide AI generation
// Genera la struttura del progetto utilizzando l'API di Hugging Face
// Crea un prompt dettagliato basato sulle selezioni dell'utente per guidare la generazione AI
async function generateWithOpenAI(apiKey, preferences) {
  // Prepare a robust prompt for Hugging Face based on user preferences
  // Prepara un prompt robusto per Hugging Face basato sulle preferenze dell'utente
  let promptText = `You are an expert project scaffold generator. The user has selected:\n`;
  
  // Add project type
  promptText += `Project Type: ${preferences.projectType} (${preferences.projectType === 'frontend' ? 'Frontend Only' : preferences.projectType === 'backend' ? 'Backend Only' : 'Full Stack'})\n`;
  
  // Add frontend details if applicable
  if (preferences.frontend) {
    promptText += `Frontend: ${preferences.frontend} (${preferences.frontendFramework})\n`;
    promptText += `CSS Framework: ${preferences.cssFramework}\n`;
  }
  
  // Add backend details if applicable
  if (preferences.backend) {
    promptText += `Backend: ${preferences.backend} (${preferences.backendFramework})\n`;
  }
  
  // Standard instructions
  promptText += `\nGenerate a complete, production-ready project template with:
1. All necessary configuration files (package.json, tsconfig.json, etc.) with correct dependencies for the selected technologies.
2. A coherent folder structure${preferences.projectType === 'fullstack' ? ': /frontend, /backend, /docker' : ''}.
3. ${preferences.projectType === 'fullstack' ? 'A Dockerfile compatible with the selected technologies.' : 'Appropriate configuration for development and production.'}
4. A bilingual README.md (EN/IT) with install, usage, and configuration instructions.
5. All necessary config files (.gitignore, .env.example if needed).
6. All code and comments must be bilingual (EN/IT).
7. The template must be immediately installable and runnable with no missing files or dependency errors.
8. Include proper configuration for the selected CSS framework (${preferences.cssFramework}) if applicable.
9. Return your response as a JSON object where each key is a file path and each value is the content of that file.
   For example: { "README.md": "# Project Name\\n...", "src/index.js": "console.log('Hello');" }
10. For directory structure, include empty directories by setting the value to null.
    For example: { "src/components": null }`;

  try {
    // First check if we should use the real API or fallback to local generation
    const useAIGeneration = await askUseAIGeneration();
    
    if (!useAIGeneration) {
      console.log('Using local template generation instead of AI...');
      
      // Return a simple structure that will trigger the fallback mechanisms
      return JSON.stringify({
        'README.md': `# ${preferences.projectName}\n\nProject generated with local template generator.`,
        'README.it.md': `# ${preferences.projectName}\n\nProgetto generato con il generatore di template locale.`
      });
    }
    
    // If using AI, proceed with API call
    console.log('Calling Hugging Face API to generate project files...');
    
    // Define Hugging Face API endpoint - using a model that can generate structured code
    const apiUrl = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf';
    
    try {
      // Make the API call with a timeout
      const response = await Promise.race([
        axios.post(
          apiUrl,
          {
            inputs: promptText,
            parameters: {
              max_length: 4096,
              temperature: 0.7,
              return_full_text: false
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout
          }
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API request timed out after 30 seconds')), 30000)
        )
      ]);

      // Check if we got a valid response with generated text
      if (response.data && response.data.generated_text) {
        console.log('Project structure generated successfully by AI');
        // Return the generated text
        return response.data.generated_text;
      } else {
        console.error('Unexpected response format from Hugging Face API');
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error in template generation:', error.message);
      if (error.response) {
        console.error('API response error:', error.response.status, error.response.data);
      }
      
      // Ask if user wants to use local generation instead
      const useFallback = await askUseFallback();
      if (useFallback) {
        console.log('Falling back to local template generation...');
        return JSON.stringify({
          'README.md': `# ${preferences.projectName}\n\nProject generated with local template generator.`,
          'README.it.md': `# ${preferences.projectName}\n\nProgetto generato con il generatore di template locale.`
        });
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return null;
  }
}

// Ask if user wants to use AI generation or local generation
// Chiede se l'utente vuole usare la generazione AI o la generazione locale
async function askUseAIGeneration() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'useAI',
      message: 'How would you like to generate your project?',
      choices: [
        { name: 'Use AI to generate a custom project structure (requires Hugging Face API)', value: true },
        { name: 'Use local templates (faster, more reliable)', value: false }
      ],
      default: false
    }
  ]);
  
  return answer.useAI;
}

// Ask if user wants to use fallback local generation when AI fails
// Chiede se l'utente vuole usare la generazione locale di fallback quando l'AI fallisce
async function askUseFallback() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useFallback',
      message: 'AI generation failed. Would you like to use local templates instead?',
      default: true
    }
  ]);
  
  return answer.useFallback;
}

// Write project files based on the AI response
// Create the actual project files based on AI generation
// This function writes files to the user's selected location
// Crea i file di progetto effettivi basati sulla generazione AI
// Questa funzione scrive i file nella posizione selezionata dall'utente
async function createProject(preferences, generatedContent) {
  // Create the project directory if it doesn't exist
  // Crea la directory del progetto se non esiste
  const projectPath = preferences.projectPath;
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  console.log('Creating project files and directory structure...');
  
  try {
    // Extract the JSON from the generated content
    // La risposta potrebbe contenere altro testo oltre al JSON, quindi cerchiamo di estrarlo
    let fileStructure;
    try {
      // Try to parse the entire response as JSON first
      fileStructure = JSON.parse(generatedContent);
    } catch (e) {
      // If that fails, try to extract JSON from the text
      try {
        const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          fileStructure = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse AI response as JSON');
        }
      } catch (e2) {
        console.log('AI response could not be parsed as JSON. Using default structure.');
        console.log('Response was:', generatedContent ? generatedContent.substring(0, 100) + '...' : 'empty');
        createDefaultProjectStructure(projectPath, preferences);
        return;
      }
    }

    if (!fileStructure || typeof fileStructure !== 'object') {
      // If we still don't have valid JSON, fall back to default structure
      console.warn('AI generated invalid response format. Using default structure instead.');
      createDefaultProjectStructure(projectPath, preferences);
      return;
    }

    // Create all directories and files from the AI-generated structure
    console.log('Creating AI-generated project structure...');
    let filesCreated = 0;
    
    for (const [filePath, content] of Object.entries(fileStructure)) {
      const fullPath = path.join(projectPath, filePath);
      
      // Make sure the directory exists
      const dirname = path.dirname(fullPath);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }
      
      // If content is null, it's an empty directory, already created above
      if (content !== null) {
        fs.writeFileSync(fullPath, content);
        filesCreated++;
      }
    }
    
    console.log(`Created ${filesCreated} files from AI-generated structure.`);
    
    // If AI didn't generate essential files like README.md, create them
    const readmePath = path.join(projectPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      createDefaultReadmeFiles(projectPath, preferences);
    }
    
  } catch (error) {
    console.error('Error while creating project from AI response:', error.message);
    console.log('Falling back to default project structure...');
    createDefaultProjectStructure(projectPath, preferences);
  }

  console.log(`Project "${preferences.projectName}" created successfully at ${projectPath}`);
  console.log('Please check the generated files and customize them as needed.');
}

// Fallback function to create default README files if AI doesn't generate them
// Funzione di fallback per creare file README predefiniti se l'IA non li genera
function createDefaultReadmeFiles(projectPath, preferences) {
  // Create README.md with project information
  const readmePath = path.join(projectPath, 'README.md');
  const readmeContent = `# ${preferences.projectName}

## Project Overview
This is a ${preferences.projectType} project created with the IA Docker Template Generator.

### Technologies Used
${preferences.frontend ? `- Frontend: ${preferences.frontend} (${preferences.frontendFramework})
- CSS: ${preferences.cssFramework}` : ''}
${preferences.backend ? `- Backend: ${preferences.backend} (${preferences.backendFramework})` : ''}

## Getting Started
Instructions for setup and running the project...

## Docker Setup
Docker configuration for easy deployment...

Created by Filippo Falcone

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md) [![Italian](https://img.shields.io/badge/lang-Italiano-green.svg)](README.it.md)
`;

  fs.writeFileSync(readmePath, readmeContent);

  // Also create an Italian version of the README
  const readmeItPath = path.join(projectPath, 'README.it.md');
  const readmeItContent = `# ${preferences.projectName}

## Panoramica del Progetto
Questo è un progetto ${preferences.projectType} creato con IA Docker Template Generator.

### Tecnologie Utilizzate
${preferences.frontend ? `- Frontend: ${preferences.frontend} (${preferences.frontendFramework})
- CSS: ${preferences.cssFramework}` : ''}
${preferences.backend ? `- Backend: ${preferences.backend} (${preferences.backendFramework})` : ''}

## Per Iniziare
Istruzioni per la configurazione e l'esecuzione del progetto...

## Configurazione Docker
Configurazione Docker per una facile implementazione...

Creato da Filippo Falcone

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md) [![Italian](https://img.shields.io/badge/lang-Italiano-green.svg)](README.it.md)
`;

  fs.writeFileSync(readmeItPath, readmeItContent);
}

// Fallback function to create a default project structure if AI fails
// Funzione di fallback per creare una struttura di progetto predefinita se l'IA fallisce
function createDefaultProjectStructure(projectPath, preferences) {
  console.log('Creating default project structure...');
  
  // Create appropriate directories based on project type
  if (preferences.projectType === 'fullstack') {
    fs.mkdirSync(path.join(projectPath, 'frontend'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'backend'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'docker'), { recursive: true });
  } else if (preferences.projectType === 'frontend') {
    fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });
  } else if (preferences.projectType === 'backend') {
    fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'config'), { recursive: true });
  }
  
  // Create default README files
  createDefaultReadmeFiles(projectPath, preferences);
  
  // Create additional files based on project type
  createProjectFiles(projectPath, preferences);
}

// Helper function to create additional project files as fallback
// Funzione di supporto per creare file di progetto aggiuntivi come fallback
function createProjectFiles(projectPath, preferences) {
  // Create .gitignore
  const gitignorePath = path.join(projectPath, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    const gitignoreContent = `# Dependencies
node_modules/
vendor/
.env

# Build files
dist/
build/
*.log

# IDE files
.idea/
.vscode/
*.sublime-*

# OS files
.DS_Store
Thumbs.db
`;
    fs.writeFileSync(gitignorePath, gitignoreContent);
  }

  // Create .env.example
  const envExamplePath = path.join(projectPath, '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    const envExampleContent = `# Environment Variables
# Copy this file to .env and fill in your values

# App settings
APP_NAME=${preferences.projectName}
APP_ENV=development
APP_DEBUG=true

# Database settings
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=${preferences.projectName.toLowerCase().replace(/\s+/g, '_')}_db
DB_USERNAME=root
DB_PASSWORD=

# API keys
API_KEY=
`;
    fs.writeFileSync(envExamplePath, envExampleContent);
  }

  // Create files based on project type - only if AI didn't generate them
  if (preferences.projectType === 'fullstack' || preferences.projectType === 'frontend') {
    createFrontendFiles(projectPath, preferences);
  }
  
  if (preferences.projectType === 'fullstack' || preferences.projectType === 'backend') {
    createBackendFiles(projectPath, preferences);
  }
  
  if (preferences.projectType === 'fullstack') {
    createDockerFiles(projectPath, preferences);
  }
}

// Create frontend related files as fallback
// Crea file relativi al frontend come fallback
function createFrontendFiles(projectPath, preferences) {
  const frontendPath = preferences.projectType === 'fullstack' 
    ? path.join(projectPath, 'frontend') 
    : projectPath;
  
  // Ensure the frontend directory exists
  if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
  }
  
  // Create package.json for frontend if not exists
  const packageJsonPath = path.join(frontendPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    const packageJsonContent = {
      name: preferences.projectName.toLowerCase().replace(/\s+/g, '-') + (preferences.projectType === 'fullstack' ? '-frontend' : ''),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        serve: 'vite preview'
      },
      dependencies: {},
      devDependencies: {}
    };

    // Add dependencies based on frontend tech
    if (preferences.frontend === 'Vue') {
      packageJsonContent.dependencies.vue = '^3.3.0';
      if (preferences.frontendFramework.includes('Vite')) {
        packageJsonContent.devDependencies['@vitejs/plugin-vue'] = '^4.4.0';
        packageJsonContent.devDependencies.vite = '^4.5.0';
      }
    } else if (preferences.frontend === 'React') {
      packageJsonContent.dependencies.react = '^18.2.0';
      packageJsonContent.dependencies['react-dom'] = '^18.2.0';
      if (preferences.frontendFramework.includes('Vite')) {
        packageJsonContent.devDependencies['@vitejs/plugin-react'] = '^4.1.0';
        packageJsonContent.devDependencies.vite = '^4.5.0';
      }
    }

    // Add CSS framework dependencies
    if (preferences.cssFramework === 'Tailwind CSS') {
      packageJsonContent.devDependencies.tailwindcss = '^3.3.3';
      packageJsonContent.devDependencies.autoprefixer = '^10.4.15';
      packageJsonContent.devDependencies.postcss = '^8.4.30';
    } else if (preferences.cssFramework === 'Bootstrap') {
      packageJsonContent.dependencies.bootstrap = '^5.3.2';
      if (preferences.frontend === 'Vue') {
        packageJsonContent.dependencies['bootstrap-vue'] = '^2.23.1';
      }
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
  }

  // Create index.html if not exists
  const indexHtmlPath = path.join(frontendPath, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${preferences.projectName}</title>
  <!-- Generated with IA Docker Template Generator -->
  <!-- Generato con IA Docker Template Generator -->
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./src/main.js"></script>
</body>
</html>
`;
    fs.writeFileSync(indexHtmlPath, indexHtmlContent);
  }

  // Create src directory and main files
  const srcPath = path.join(frontendPath, 'src');
  if (!fs.existsSync(srcPath)) {
    fs.mkdirSync(srcPath, { recursive: true });
  }

  // Create basic source files based on framework if they don't exist
  if (preferences.frontend === 'Vue') {
    const mainJsPath = path.join(srcPath, 'main.js');
    if (!fs.existsSync(mainJsPath)) {
      const mainJsContent = `// Main application entry point
// Punto di ingresso principale dell'applicazione
import { createApp } from 'vue';
import App from './App.vue';
${preferences.cssFramework === 'Bootstrap' ? "import 'bootstrap/dist/css/bootstrap.css';" : ''}

createApp(App).mount('#app');
`;
      fs.writeFileSync(mainJsPath, mainJsContent);
    }
    
    const appVuePath = path.join(srcPath, 'App.vue');
    if (!fs.existsSync(appVuePath)) {
      const appVueContent = `<template>
  <div class="app">
    <h1>${preferences.projectName}</h1>
    <p>Welcome to your new ${preferences.frontend} application!</p>
    <p>Benvenuto nella tua nuova applicazione ${preferences.frontend}!</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  // Component logic here / Logica del componente qui
}
</script>

<style>
.app {
  text-align: center;
  padding: 20px;
}
</style>
`;
      fs.writeFileSync(appVuePath, appVueContent);
    }
  }
}

// Create backend related files as fallback
// Crea file relativi al backend come fallback
function createBackendFiles(projectPath, preferences) {
  const backendPath = preferences.projectType === 'fullstack' 
    ? path.join(projectPath, 'backend') 
    : projectPath;
  
  // Ensure the backend directory exists
  if (!fs.existsSync(backendPath)) {
    fs.mkdirSync(backendPath, { recursive: true });
  }
  
  // Create basic backend files based on selected technology
  if (preferences.backend === 'Node.js') {
    // Create package.json for Node.js if not exists
    const packageJsonPath = path.join(backendPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      const packageJsonContent = {
        name: preferences.projectName.toLowerCase().replace(/\s+/g, '-') + (preferences.projectType === 'fullstack' ? '-backend' : ''),
        version: '0.1.0',
        private: true,
        scripts: {
          start: 'node src/index.js',
          dev: 'nodemon src/index.js'
        },
        dependencies: {
          "dotenv": "^16.3.1"
        },
        devDependencies: {
          "nodemon": "^3.0.1"
        }
      };

      // Add framework specific dependencies
      if (preferences.backendFramework === 'Express') {
        packageJsonContent.dependencies.express = '^4.18.2';
      } else if (preferences.backendFramework === 'NestJS') {
        packageJsonContent.dependencies['@nestjs/core'] = '^10.2.0';
        packageJsonContent.dependencies['@nestjs/common'] = '^10.2.0';
      } else if (preferences.backendFramework === 'Fastify') {
        packageJsonContent.dependencies.fastify = '^4.23.0';
      }

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
    }
    
    // Create src directory and main file
    const srcPath = path.join(backendPath, 'src');
    if (!fs.existsSync(srcPath)) {
      fs.mkdirSync(srcPath, { recursive: true });
    }

    // Create index.js with appropriate framework if not exists
    const indexJsPath = path.join(srcPath, 'index.js');
    if (!fs.existsSync(indexJsPath)) {
      const indexJsContent = preferences.backendFramework === 'Express' 
        ? `// Express server entry point
// Punto di ingresso del server Express
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${preferences.projectName} API' });
});

app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});`
        : `// ${preferences.backendFramework} server entry point
// Punto di ingresso del server ${preferences.backendFramework}
require('dotenv').config();

console.log('${preferences.backendFramework} server starting...');
console.log('Server ${preferences.backendFramework} in avvio...');`;

      fs.writeFileSync(indexJsPath, indexJsContent);
    }
  } else if (preferences.backend === 'PHP') {
    // Create composer.json for PHP if not exists
    const composerJsonPath = path.join(backendPath, 'composer.json');
    if (!fs.existsSync(composerJsonPath)) {
      const composerJsonContent = {
        name: preferences.projectName.toLowerCase().replace(/\s+/g, '-') + (preferences.projectType === 'fullstack' ? '-backend' : ''),
        description: `${preferences.projectName} backend`,
        type: "project",
        require: {
          "php": "^8.1"
        },
        "require-dev": {
          "phpunit/phpunit": "^10.0"
        },
        autoload: {
          "psr-4": {
            "App\\\\": "src/"
          }
        },
        scripts: {
          "start": "php -S localhost:8000 -t public"
        }
      };

      if (preferences.backendFramework === 'Laravel') {
        composerJsonContent.require["laravel/framework"] = "^10.0";
      } else if (preferences.backendFramework === 'Symfony') {
        composerJsonContent.require["symfony/framework-bundle"] = "^6.0";
      } else if (preferences.backendFramework === 'Slim') {
        composerJsonContent.require["slim/slim"] = "^4.0";
      }

      fs.writeFileSync(composerJsonPath, JSON.stringify(composerJsonContent, null, 2));
    }
    
    // Create src and public directories
    const srcPath = path.join(backendPath, 'src');
    const publicPath = path.join(backendPath, 'public');
    if (!fs.existsSync(srcPath)) {
      fs.mkdirSync(srcPath, { recursive: true });
    }
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }

    // Create index.php if not exists
    const indexPhpPath = path.join(publicPath, 'index.php');
    if (!fs.existsSync(indexPhpPath)) {
      const indexPhpContent = `<?php
/**
 * ${preferences.projectName} - PHP Application
 * ${preferences.projectName} - Applicazione PHP
 */

// Bootstrap application
// Avvio dell'applicazione
require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
// Caricamento delle variabili d'ambiente
$dotenv = new \\Dotenv\\Dotenv(__DIR__ . '/..');
$dotenv->load();

echo 'Welcome to ${preferences.projectName} API';
echo 'Benvenuto nell\\'API di ${preferences.projectName}';
`;
      fs.writeFileSync(indexPhpPath, indexPhpContent);
    }
  }
}

// Create Docker related files
// Crea file relativi a Docker
// Create Docker related files as fallback
// Crea file relativi a Docker come fallback
function createDockerFiles(projectPath, preferences) {
  const dockerPath = path.join(projectPath, 'docker');
  
  // Ensure the docker directory exists
  if (!fs.existsSync(dockerPath)) {
    fs.mkdirSync(dockerPath, { recursive: true });
  }
  
  // Create Dockerfile if not exists
  const dockerfilePath = path.join(dockerPath, 'Dockerfile');
  if (!fs.existsSync(dockerfilePath)) {
    let dockerfileContent = `# ${preferences.projectName} Dockerfile
# Generated with IA Docker Template Generator
# Generato con IA Docker Template Generator

`;

    if (preferences.frontend && preferences.backend) {
      dockerfileContent += `# Multi-stage build for fullstack application
# Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
`;

      if (preferences.backend === 'Node.js') {
        dockerfileContent += `FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist /app/public
EXPOSE 3000
CMD ["node", "src/index.js"]`;
      } else if (preferences.backend === 'PHP') {
        dockerfileContent += `FROM php:8.1-apache
WORKDIR /var/www/html
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist /var/www/html/public
RUN docker-php-ext-install pdo pdo_mysql
EXPOSE 80
CMD ["apache2-foreground"]`;
      }
    } else if (preferences.frontend) {
      dockerfileContent += `FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;
    } else if (preferences.backend === 'Node.js') {
      dockerfileContent += `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]`;
    } else if (preferences.backend === 'PHP') {
      dockerfileContent += `FROM php:8.1-apache
WORKDIR /var/www/html
COPY . .
RUN docker-php-ext-install pdo pdo_mysql
EXPOSE 80
CMD ["apache2-foreground"]`;
    }

    fs.writeFileSync(dockerfilePath, dockerfileContent);
  }

  // Create docker-compose.yml if not exists
  const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
  if (!fs.existsSync(dockerComposePath)) {
    let dockerComposeContent = `version: '3'

services:
`;

    if (preferences.frontend && preferences.backend) {
      if (preferences.backend === 'Node.js') {
        dockerComposeContent += `  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production`;
      } else if (preferences.backend === 'PHP') {
        dockerComposeContent += `  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "80:80"
    volumes:
      - ./backend:/var/www/html
      - ./frontend/dist:/var/www/html/public`;
      }

      if (preferences.backend === 'Node.js' || preferences.backend === 'PHP') {
        dockerComposeContent += `
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_DATABASE=${preferences.projectName.toLowerCase().replace(/\s+/g, '_')}_db
      - MYSQL_ROOT_PASSWORD=root_password
    volumes:
      - dbdata:/var/lib/mysql

volumes:
  dbdata:`;
      }
    } else if (preferences.frontend) {
      dockerComposeContent += `  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "80:80"`;
    } else if (preferences.backend === 'Node.js') {
      dockerComposeContent += `  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_DATABASE=${preferences.projectName.toLowerCase().replace(/\s+/g, '_')}_db
      - MYSQL_ROOT_PASSWORD=root_password
    volumes:
      - dbdata:/var/lib/mysql

volumes:
  dbdata:`;
    } else if (preferences.backend === 'PHP') {
      dockerComposeContent += `  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "80:80"
    volumes:
      - ./:/var/www/html
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_DATABASE=${preferences.projectName.toLowerCase().replace(/\s+/g, '_')}_db
      - MYSQL_ROOT_PASSWORD=root_password
    volumes:
      - dbdata:/var/lib/mysql

volumes:
  dbdata:`;
    }

    fs.writeFileSync(dockerComposePath, dockerComposeContent);
  }
}

// Main project creation flow
// Main project creation flow with back navigation
// This is the central function that coordinates the entire user interaction process
// Flusso principale di creazione del progetto con navigazione indietro
// Questa è la funzione centrale che coordina l'intero processo di interazione con l'utente
async function startProjectCreationFlow() {
  // Store all preferences in this object
  // Each property is initially null and will be filled through the interactive process
  // Memorizza tutte le preferenze in questo oggetto
  // Ogni proprietà è inizialmente null e verrà compilata attraverso il processo interattivo
  const preferences = {
    projectName: null,    // Name of the project / Nome del progetto
    projectPath: null,    // Path where the project will be created / Percorso dove il progetto sarà creato
    projectType: null,    // frontend, backend, or fullstack / frontend, backend, o fullstack
    frontend: null,       // Selected frontend technology / Tecnologia frontend selezionata
    frontendFramework: null, // Selected frontend framework / Framework frontend selezionato
    cssFramework: null,   // Selected CSS framework / Framework CSS selezionato
    backend: null,        // Selected backend technology / Tecnologia backend selezionata
    backendFramework: null // Selected backend framework / Framework backend selezionato
  };
  
  let completed = false;
  
  while (!completed) {
    // Project name
    while (!preferences.projectName) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Create a new project', value: 'create' },
            { name: EXIT_OPTION, value: EXIT_VALUE }
          ]
        }
      ]);
      
      if (action === EXIT_VALUE) {
        console.log('Exiting the template generator. Goodbye!');
        process.exit(0);
      }
      
      // Ask for project name
      const nameResponse = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Enter a name for your project:',
          validate: (input) => input.trim() !== '' ? true : 'Project name is required',
        },
        {
          type: 'list',
          name: 'action',
          message: 'Continue or go back?',
          choices: [
            { name: 'Continue', value: 'continue' },
            { name: BACK_OPTION, value: BACK_VALUE }
          ]
        }
      ]);
      
      if (nameResponse.action === BACK_VALUE) {
        continue;
      }
      
      preferences.projectName = nameResponse.projectName;
    }
    
    // Project location
    while (!preferences.projectPath) {
      const homeDir = os.homedir();
      const defaultPath = path.join(homeDir, 'Projects', preferences.projectName);
      
      const pathResponse = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectPath',
          message: 'Enter project path:',
          default: defaultPath,
          validate: (input) => input.trim() !== '' ? true : 'Project path is required',
        },
        {
          type: 'list',
          name: 'action',
          message: 'Continue or go back?',
          choices: [
            { name: 'Continue', value: 'continue' },
            { name: BACK_OPTION, value: BACK_VALUE }
          ]
        }
      ]);
      
      if (pathResponse.action === BACK_VALUE) {
        preferences.projectName = null; // Reset project name to go back
        continue;
      }
      
      preferences.projectPath = pathResponse.projectPath;
    }
    
    // Project type
    while (!preferences.projectType) {
      const typeResponse = await inquirer.prompt([
        {
          type: 'list',
          name: 'projectType',
          message: 'Select the project type:',
          choices: [
            { name: 'Frontend Only', value: 'frontend' },
            { name: 'Backend Only', value: 'backend' },
            { name: 'Full Stack', value: 'fullstack' },
            { name: BACK_OPTION, value: BACK_VALUE }
          ]
        }
      ]);
      
      if (typeResponse.projectType === BACK_VALUE) {
        preferences.projectPath = null; // Reset path to go back
        continue;
      }
      
      preferences.projectType = typeResponse.projectType;
    }
    
    // Complete the project preferences flow
    const configComplete = await completeProjectFlow(preferences);
    
    if (configComplete) {
      // Get API key for Hugging Face
      const apiKey = await askApiKey();
      
      if (!apiKey) {
        console.error('API key is required to generate project templates.');
        process.exit(1);
      }
      
      // Generate the project using Hugging Face API
      console.log('Generating project template with AI...');
      const generatedContent = await generateWithOpenAI(apiKey, preferences);
      
      if (generatedContent) {
        // Create project files
        await createProject(preferences, generatedContent);
        completed = true;
      } else {
        console.error('Failed to generate project template.');
        
        const retryResponse = await inquirer.prompt([
          {
            type: 'list',
            name: 'retry',
            message: 'Would you like to try again?',
            choices: [
              { name: 'Yes, try again', value: true },
              { name: 'No, exit', value: false }
            ]
          }
        ]);
        
        if (!retryResponse.retry) {
          process.exit(1);
        }
      }
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});