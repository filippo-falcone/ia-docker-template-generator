#!/usr/bin/env node

const inquirer = require('inquirer');
const { prompt } = inquirer;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ora = require('ora');
const chalk = require('chalk');
require('dotenv').config({ quiet: true });

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
  console.log(chalk.cyan('================================='));
  console.log(`| ${chalk.bold.yellow('AI Docker Template Generator')}  |`);
  console.log(chalk.cyan('================================='));
  
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
  console.log(chalk.yellow('\nProject Configuration Summary:'));
  console.log(chalk.cyan(`- Project Name: ${chalk.bold(preferences.projectName)}`));
  console.log(chalk.cyan(`- Project Path: ${chalk.bold(preferences.projectPath)}`));
  console.log(chalk.cyan(`- Project Type: ${chalk.bold(preferences.projectType)}`));
  
  if (preferences.frontend) {
    console.log(chalk.cyan(`- Frontend: ${chalk.bold(preferences.frontend)} (${preferences.frontendFramework})`));
    console.log(chalk.cyan(`- CSS Framework: ${chalk.bold(preferences.cssFramework)}`));
  }
  
  if (preferences.backend) {
    console.log(chalk.cyan(`- Backend: ${chalk.bold(preferences.backend)} (${preferences.backendFramework})`));
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
    console.log(chalk.red('Project generation cancelled.'));
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
    
    // Check if GOOGLE_API_KEY already exists in the file
    const envLines = envContent.split('\n');
    let tokenExists = false;
    
    // Create new content with updated token
    const newContent = envLines.map(line => {
      if (line.trim().startsWith('GOOGLE_API_KEY=')) {
        tokenExists = true;
        return `GOOGLE_API_KEY=${apiKey}`;
      }
      return line;
    }).join('\n');
    
    // If token doesn't exist in file, add it
    if (!tokenExists) {
      envContent = newContent + `\nGOOGLE_API_KEY=${apiKey}\n`;
    } else {
      envContent = newContent;
    }
  } else {
    // Create new .env file with token
    envContent = `GOOGLE_API_KEY=${apiKey}\n`;
  }
  
  // Write to .env file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log(chalk.green('Google API Key saved to .env file'));
    return true;
  } catch (error) {
    console.error(chalk.red('Error saving API key to .env file:'), error.message);
    return false;
  }
}

// Ask for Google API Key
// First checks environment variables, then prompts user if not found
// Also offers to save the key for future use
// Richiede la chiave API di Google
// Prima controlla le variabili d'ambiente, poi chiede all'utente se non la trova
// Offre anche di salvare la chiave per uso futuro
async function askApiKey() {
  let apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your Google API Key for Gemini:',
      },
    ]);
    apiKey = answer.apiKey;
    
    // Ask if the user wants to save the token for future use
    const saveAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'saveToken',
        message: 'Do you want to save the API key for future use?',
        default: true
      },
    ]);
    
    if (saveAnswer.saveToken) {
      saveApiKeyToEnv(apiKey);
    }
  }
  return apiKey;
}

// Generate project file structure using Google Gemini (Architect Role)
async function generateFileStructure(apiKey, preferences) {
  let promptText = `You are an expert project architect. Based on the user's selections, generate ONLY a JSON array of all the file paths needed for the project.

User selections:
- Project Type: ${preferences.projectType}
- Frontend: ${preferences.frontend || 'N/A'} (${preferences.frontendFramework || 'N/A'})
- CSS Framework: ${preferences.cssFramework || 'N/A'}
- Backend: ${preferences.backend || 'N/A'} (${preferences.backendFramework || 'N/A'})

**Instructions:**
1.  **Output Format:** Your response MUST be a single, raw, valid JSON array. Do not include any other text, explanations, or markdown.
2.  **COMPLETE FRAMEWORK STRUCTURE:** Generate the FULL project structure as if created by the framework's official CLI tools:
    - **Vue.js projects:** Include the complete structure like \`npm create vue@latest\` would create:
      * src/components/, src/views/, src/router/, src/stores/, src/assets/
      * public/ directory with index.html, favicon.ico
      * Multiple .vue components (App.vue, HelloWorld.vue, WelcomeView.vue, AboutView.vue)
      * Router configuration, store setup, main.js with proper imports
      * CSS files, configuration files (vite.config.js, etc.)
    - **Laravel projects:** Include the complete structure like \`composer create-project laravel/laravel\` would create:
      * app/Http/Controllers/, app/Models/, database/migrations/, resources/views/
      * routes/web.php, routes/api.php
      * Multiple PHP files (User.php model, controllers, middleware)
      * Blade templates, Laravel configuration files
      * artisan, bootstrap/, config/, storage/, tests/ directories
    - **React projects:** Include complete structure with components, hooks, styles
    - **NOT just minimal files:** Don't create only App.vue or a single controller - create a realistic, working project
3.  **Structure Organization:**
    - For 'fullstack' projects, use '/frontend' and '/backend' subdirectories.
    - Include all necessary configuration files (package.json, Dockerfile, docker-compose.yml, .gitignore, .env.example, etc.).
    - **NEVER include auto-generated files:** Do NOT include package-lock.json, yarn.lock, composer.lock, or any other dependency lock files as these should be generated automatically by package managers.
4.  **Framework-Specific Requirements:**
    - **Vue.js + Vite:** Include vite.config.js, multiple components, router setup, store (Pinia), proper src/ structure
    - **Laravel:** Include proper MVC structure, multiple models/controllers, blade templates, routing, middleware
    - **React:** Include components/, hooks/, utils/, proper JSX structure
    - **Node.js/Express:** Include routes/, middleware/, controllers/, proper Express app structure
5.  **MANDATORY DOCKER FILES:** For fullstack projects, you MUST ALWAYS include:
    - \`docker-compose.yml\` in the root directory (REQUIRED for fullstack projects)
    - \`frontend/Dockerfile\` (REQUIRED for frontend containerization)
    - \`backend/Dockerfile\` (REQUIRED for backend containerization)
    - These files are NOT optional - they are essential for the project to work as intended
6.  **Example JSON Array Output for Vue+Laravel Fullstack:**
    [
      "docker-compose.yml",
      ".gitignore",
      ".env.example",
      "README.md",
      "frontend/Dockerfile",
      "frontend/package.json",
      "frontend/vite.config.js",
      "frontend/index.html",
      "frontend/src/main.js",
      "frontend/src/App.vue",
      "frontend/src/components/HelloWorld.vue",
      "frontend/src/router/index.js",
      "frontend/src/views/HomeView.vue",
      "frontend/src/views/AboutView.vue",
      "backend/Dockerfile",
      "backend/.env.example",
      "backend/composer.json",
      "backend/artisan",
      "backend/app/Http/Controllers/Controller.php",
      "backend/app/Models/User.php",
      "backend/routes/web.php",
      "backend/routes/api.php",
      "backend/resources/views/welcome.blade.php",
      "backend/database/migrations/0001_01_01_000000_create_users_table.php"
    ]`;

  const spinner = ora('Calling AI Architect to design file structure...').start();
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text().trim();

    // Attempt to parse the JSON array
    try {
      const fileList = JSON.parse(text);
      if (Array.isArray(fileList)) {
        spinner.succeed(chalk.green('AI Architect designed the file structure.'));
        return fileList;
      } else {
        throw new Error('Response is not a JSON array.');
      }
    } catch (e) {
      spinner.fail(chalk.red('AI Architect response was not valid JSON.'));
      console.error('Raw response:', text);
      throw new Error('Failed to parse file structure from AI.');
    }
  } catch (error) {
    spinner.fail(chalk.red('Error calling AI Architect:'));
    console.error(error.message);
    return null;
  }
}

// Generate content for a single file using Google Gemini (Developer Role)
async function generateFileContent(apiKey, preferences, filePath, fileList) {
  let promptText = `You are an expert software developer. Your task is to generate the complete, production-ready code for a specific file, using the entire project structure for context.

**Project Stack:**
- Project Type: ${preferences.projectType}
- Frontend: ${preferences.frontend || 'N/A'} (${preferences.frontendFramework || 'N/A'})
- CSS Framework: ${preferences.cssFramework || 'N/A'}
- Backend: ${preferences.backend || 'N/A'} (${preferences.backendFramework || 'N/A'})
- Project Name: ${preferences.projectName}

**Full Project Structure for Context:**
\`\`\`json
${JSON.stringify(fileList, null, 2)}
\`\`\`

**File to Generate:** \`${filePath}\`

**TECHNOLOGY CONSISTENCY RULES:**
- **Frontend Framework:** ${preferences.frontendFramework || 'N/A'} - Use EXACTLY this framework, no alternatives
- **JavaScript vs TypeScript:** If "Vue + Vite" (without TypeScript mentioned) → Use .js files, NO .ts files, NO TypeScript configuration
- **File Extensions:** For Vue + Vite → main.js, components as .vue, NO .ts files unless TypeScript explicitly selected
- **Configuration Files:** For Vue + Vite (JS) → vite.config.js, NO tsconfig files, NO TypeScript dependencies
- **Package.json Script:** Match the selected framework exactly - Vue + Vite should have standard Vite scripts

**REQUIREMENTS:**

**A. OUTPUT FORMAT & STRUCTURE**

A1. **Content Output:** Generate ONLY the raw code/text for the requested file (\`${filePath}\`). Do not add explanations, comments, or markdown wrappers.

A2. **NO MARKDOWN FORMATTING:** Do NOT wrap output in markdown code blocks. Output must be raw file content that can be directly written to disk.

A3. **File Reference Rule:** NEVER reference files that don't exist in the provided project structure (images, assets, CSS, JS, components, etc.)

**B. FRAMEWORK REQUIREMENTS**

B1. **Vue.js Projects** - Replicate EXACTLY \`npm create vue@latest\` structure:
    - **Welcome page:** src/App.vue with official Vue design + chosen CSS framework
    - **Entry point:** src/main.js, index.html with relative paths (./src/main.js NOT /src/main.js)
    - **Vite config:** vite.config.js with @ alias: \`'@': fileURLToPath(new URL('./src', import.meta.url))\`
    - **Router:** If selected, proper Vue Router in src/router/index.js
    - **Store:** If Pinia selected, proper store in src/stores/index.js

B2. **Laravel Projects** - Replicate EXACTLY \`composer create-project laravel/laravel\` structure:
    - **ABSOLUTE RULE:** NEVER EVER use ANY Lumen classes or patterns. This is Laravel standard, NOT Lumen.
    - **Forbidden code:** NEVER use \`Laravel\\Lumen\\Application\`, \`Laravel\\Lumen\\Bootstrap\\LoadEnvironmentVariables\`, or any \`Laravel\\Lumen\` namespace
    - **Required:** Use ONLY \`\\Illuminate\\Foundation\\Application::configure()\` in bootstrap/app.php
    - **Standard Laravel bootstrap:** Must use Laravel 11+ bootstrap pattern with configure() method
    - **Welcome:** resources/views/welcome.blade.php with official Laravel design
    - **Directories:** Standard app/, config/, database/, routes/, etc.

**C. DEPENDENCY CONSISTENCY**

C1. **Critical Rule:** Every import/require MUST have corresponding dependency in package.json/composer.json:
    - Vue + Pinia → "pinia": "^2.1.0" in package.json
    - Vue + Router → "vue-router": "^4.2.5" in package.json  
    - Bootstrap → "bootstrap": "^5.3.2" in package.json
    - Laravel → "laravel/framework" in composer.json

C2. **Technology Consistency:** PHP projects use ONLY PHP packages, Node.js use ONLY npm packages

**D. DOCKER CONFIGURATION**

D1. **Port Standards:**
    - Frontend: 8080:80 (Nginx serves static files)
    - Backend: 8000:8000 (Laravel serve)
    - Database: 3306:3306
    - NEVER use dev ports (5173, 3000) in containers

D2. **File Validation:** ONLY copy files that exist in project structure:
    - If package-lock.json NOT in list → use \`npm install\` not \`npm ci\`
    - If composer.lock NOT in list → don't copy it
    - If nginx.conf NOT in list → use default config

D3. **Volume Warning:** For docker-compose.yml backend services:
    - **NEVER use:** \`volumes: - ./backend:/var/www/html\` (overwrites vendor directory)
    - **PRODUCTION RULE:** Use NO volumes for backend services in docker-compose.yml
    - **CORRECT for production:** Remove all volume mounts from backend service
    - **ONLY IF development volumes needed:** Add vendor persistence:
      \`\`\`
      volumes:
        - ./backend:/var/www/html
        - vendor_data:/var/www/html/vendor
      \`\`\`
      And add \`vendor_data:\` in volumes section at bottom

**E. CROSS-PLATFORM COMPATIBILITY**

E1. **README Requirements:**
    - Prerequisites with Docker as universal option
    - Both local AND Docker installation alternatives
    - Docker Compose instructions: \`docker-compose up --build\`
    - Troubleshooting with Docker alternatives

E2. **Bilingual:** All user-facing text must be bilingual (EN/IT)

**Output must be ONLY raw file content for \`${filePath}\`. No markdown, no explanations.**
`;

  // No spinner here as it will be managed by the calling function in a loop
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(promptText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(chalk.red(`\nError generating content for ${filePath}:`), error.message);
    return `// Error: Failed to generate content for ${filePath}. Please check the logs.`;
  }
}

// Create the project files and directories
async function createProject(apiKey, preferences) {
  const projectPath = preferences.projectPath;
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  // 1. Get the file structure
  const fileList = await generateFileStructure(apiKey, preferences);

  if (!fileList || fileList.length === 0) {
    console.error(chalk.red('Could not generate project structure. Aborting.'));
    return;
  }

  const spinner = ora(`Generating ${fileList.length} project files...`).start();
  let filesCreated = 0;

  // 2. Generate content for each file
  for (const filePath of fileList) {
    spinner.text = `Generating content for: ${chalk.yellow(filePath)}`;
    const content = await generateFileContent(apiKey, preferences, filePath, fileList);

    if (content !== null) {
      const fullPath = path.join(projectPath, filePath);
      const dirname = path.dirname(fullPath);

      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }

      fs.writeFileSync(fullPath, content);
      filesCreated++;
    }
  }

  spinner.succeed(chalk.green(`Created ${filesCreated} files in the project structure.`));
  console.log(chalk.bold.green(`\nProject "${preferences.projectName}" created successfully at ${preferences.projectPath}`));
  console.log(chalk.blue('Please check the generated files, install dependencies, and start the project.'));
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
      // Get API key
      const apiKey = await askApiKey();
      
      if (!apiKey) {
        console.error('API key is required to generate project templates.');
        // We don't exit, but we can't proceed, so we'll let the loop restart
        completed = false; 
        continue; // Skip to the next iteration of the while loop
      }

      // Generate the project using the new refactored flow
      console.log('Generating project template with AI...');
      await createProject(apiKey, preferences);
      completed = true; // End the loop
    } else {
      // This part is hit if the user chooses to 'modify' from the confirmation prompt
      console.log(chalk.yellow('Modification requested. Restarting configuration...'));
      // All preferences are reset inside completeProjectFlow if 'modify' is chosen,
      // so the loop will naturally restart the process.
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});