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

// Import the modular prompt builder and validation systems
const PromptBuilder = require('./promptBuilder_v2');
const PostGenerationValidator = require('./postGenerationValidator');
const AutoCorrector = require('./autoCorrector');

// Constants for CLI UI - Used for navigation throughout the application
// Costanti per l'interfaccia CLI - Utilizzate per la navigazione nell'applicazione
const BACK_OPTION = '← Go Back';
const BACK_VALUE = 'back';
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
  // Initialize the modular prompt builder
  const promptBuilder = new PromptBuilder();
  
  // Build specialized prompt based on user preferences
  // SEMPRE include Docker - è l'obiettivo principale del tool!
  let promptText;
  
  if (preferences.projectType === 'frontend' && preferences.frontend) {
    // Frontend-only project with Docker
    promptText = promptBuilder.buildPrompt({
      frontend: preferences.frontend || preferences.frontendFramework,
      backend: null,
      cssFramework: preferences.cssFramework,
      includeDocker: true, // SEMPRE Docker per frontend
      includeAuth: false,
      isFullStack: false
    });
  } else if (preferences.projectType === 'backend' && preferences.backend) {
    // Backend-only project with Docker
    promptText = promptBuilder.buildPrompt({
      frontend: null,
      backend: preferences.backend || preferences.backendFramework,
      cssFramework: null,
      includeDocker: true, // SEMPRE Docker per backend
      includeAuth: false,
      isFullStack: false
    });
  } else {
    // Full-stack project with Docker
    promptText = promptBuilder.buildPrompt({
      frontend: preferences.frontend || preferences.frontendFramework,
      backend: preferences.backend || preferences.backendFramework,
      cssFramework: preferences.cssFramework,
      includeDocker: true, // SEMPRE Docker per fullstack
      includeAuth: false,
      isFullStack: preferences.projectType === 'fullstack'
    });
  }

  // Add specific instructions for file structure generation
  promptText += `

**CURRENT TASK: Generate complete file structure as JSON array**

User selections:
- Project Type: ${preferences.projectType}
- Frontend: ${preferences.frontend || 'N/A'} (${preferences.frontendFramework || 'N/A'})
- CSS Framework: ${preferences.cssFramework || 'N/A'}
- Backend: ${preferences.backend || 'N/A'} (${preferences.backendFramework || 'N/A'})

**CRITICAL OUTPUT REQUIREMENTS:**
1. Your response MUST be a single, raw, valid JSON array
2. Do not include any other text, explanations, or markdown
3. Generate COMPLETE framework structure (not minimal files)
4. Include ALL configuration files mentioned in the rules above
5. NO auto-generated files (package-lock.json, composer.lock, etc.)

Example JSON output:
[
  "docker-compose.yml",
  "README.md",
  "frontend/package.json",
  "frontend/Dockerfile",
  "frontend/src/App.vue",
  "backend/composer.json",
  "backend/Dockerfile",
  "backend/bootstrap/app.php"
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
  // Initialize the modular prompt builder
  const promptBuilder = new PromptBuilder();
  
  // Build technology-specific prompt
  let promptText = promptBuilder.buildPrompt({
    frontend: preferences.frontend || preferences.frontendFramework,
    backend: preferences.backend || preferences.backendFramework,
    cssFramework: preferences.cssFramework,
    includeDocker: true,
    includeAuth: false,
    isFullStack: preferences.projectType === 'fullstack'
  });
  
  // Add specific context for this file generation task
  promptText += `

**CURRENT TASK: Generate content for specific file**

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

**CRITICAL OUTPUT REQUIREMENTS:**
1. Generate ONLY the raw code/text for the requested file
2. NO explanations, comments, or markdown wrappers
3. Content must be directly writable to disk
4. Follow all technology-specific rules mentioned above
    - **Example WRONG:** \`\`\`json\\n{...}\\n\`\`\`
    - **Example CORRECT:** {"name": "value"}

A3. **File Reference Rule:** NEVER reference files that don't exist in the provided project structure (images, assets, CSS, JS, components, etc.)

**B. FRAMEWORK REQUIREMENTS**

B1. **Vue.js Projects** - Replicate EXACTLY \`npm create vue@latest\` structure:
    - **Welcome page:** src/App.vue with official Vue design + chosen CSS framework
    - **Entry point:** src/main.js, index.html with relative paths (./src/main.js NOT /src/main.js)
    - **Vite config:** vite.config.js with @ alias: \`'@': fileURLToPath(new URL('./src', import.meta.url))\`
    - **Router:** If selected, proper Vue Router in src/router/index.js
    - **Store:** If Pinia selected, proper store in src/stores/index.js
    - **Build Setup:** ALWAYS include in package.json: \`"build": "vite build", "preview": "vite preview"\`
    - **Docker Build:** Multi-stage Dockerfile: Stage 1 build with Node.js, Stage 2 serve with nginx
    - **NGINX Config:** REQUIRED file frontend/nginx.conf with SPA routing and API proxy

B2. **Laravel Projects** - Replicate EXACTLY \`composer create-project laravel/laravel\` structure:
    - **ABSOLUTE RULE:** NEVER EVER use ANY Lumen classes or patterns. This is Laravel standard, NOT Lumen.
    - **Forbidden code:** NEVER use \`Laravel\\Lumen\\Application\`, \`Laravel\\Lumen\\Bootstrap\\LoadEnvironmentVariables\`, or any \`Laravel\\Lumen\` namespace
    - **Required:** Use ONLY \`\\Illuminate\\Foundation\\Application::configure()\` in bootstrap/app.php
    - **Standard Laravel bootstrap:** Must use Laravel 11+ bootstrap pattern with configure() method
    - **CORRECT bootstrap/app.php example:**
      \`\`\`php
      <?php
      
      require_once __DIR__.'/../vendor/autoload.php';
      
      return \\Illuminate\\Foundation\\Application::configure(basePath: dirname(__DIR__))
          ->withRouting(
              web: __DIR__.'/../routes/web.php',
              commands: __DIR__.'/../routes/console.php',
              health: '/up',
          )
          ->withMiddleware(function (Middleware \\$middleware) {
              //
          })
          ->withExceptions(function (Exceptions \\$exceptions) {
              //
          })->create();
      \`\`\`
    - **Welcome:** resources/views/welcome.blade.php with official Laravel design
    - **Directories:** Standard app/, config/, database/, routes/, etc.

**C. DEPENDENCY CONSISTENCY**

C1. **Critical Rule:** Every import/require MUST have corresponding dependency in package.json/composer.json:
    - Vue + Pinia → "pinia": "^2.1.0" in package.json
    - Vue + Router → "vue-router": "^4.2.5" in package.json  
    - Bootstrap → "bootstrap": "^5.3.2" in package.json
    - Laravel → "laravel/framework" in composer.json

C2. **System Dependencies:** Required packages for each technology:
    - **PHP/Laravel:** \`libzip-dev zip unzip git supervisor nginx libonig-dev curl\`
    - **Node.js/Vue:** \`build-essential python3\` for node-gyp compilation
    - **Common:** \`curl wget ca-certificates\` for healthchecks and downloads

C2. **Technology Consistency:** PHP projects use ONLY PHP packages, Node.js use ONLY npm packages

C3. **Strict Technology Separation:**
    - **PHP/Laravel projects:** NEVER include package.json, node_modules, npm scripts, or Node.js dependencies
    - **Node.js/Vue projects:** NEVER include composer.json, vendor/, PHP classes, or PHP dependencies  
    - **Fullstack projects:** Each service (frontend/backend) should have its own technology stack completely separate
    - **Forbidden mixing:** No PHP packages in package.json, no npm packages in composer.json

**D. DOCKER CONFIGURATION**

D1. **Port Standards:**
    - Frontend: 8080:80 (Nginx serves static files)
    - Backend: 8000:8000 (Laravel serve)
    - Database: 3306:3306
    - NEVER use dev ports (5173, 3000) in containers

D2. **Docker Compose Modern Format:**
    - **NO version field:** Remove \`version: '3.9'\` line (obsolete in modern Docker Compose)
    - **Explicit service dependencies:** Use proper \`depends_on\` with condition checking
    - **Named volumes:** Always declare volumes at bottom of file
    - **Health checks:** Add health checks for database AND backend services
    - **Backend health check:** \`curl --fail http://localhost:8000/up || exit 1\` for Laravel /up endpoint

D2. **File Validation & Required Configs:**
    - **Package managers:** If package-lock.json NOT in list → use \`npm install\` not \`npm ci\`
    - **Composer:** If composer.lock NOT in list → don't copy it, use \`composer install\` to generate
    - **NGINX Frontend:** ALWAYS create nginx.conf for Vue.js projects with:
      * \`try_files $uri $uri/ /index.html;\` for SPA routing
      * \`location /api { proxy_pass http://backend:8000; }\` for API proxy
      * \`root /usr/share/nginx/html;\` and \`index index.html;\`
    - **Build Context Rule:** If docker-compose.yml uses \`build: ./backend\`, then in backend/Dockerfile use \`COPY . .\` NOT \`COPY backend/ .\`
    - **Dockerfile Path Rules:**
      * Build context \`./frontend\` → use \`COPY package.json .\` NOT \`COPY frontend/package.json .\`
      * Build context \`./backend\` → use \`COPY composer.json .\` NOT \`COPY backend/composer.json .\`
      * Build context \`.\` (root) → use \`COPY frontend/package.json .\` (full path needed)

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

D4. **PHP/Laravel Dockerfile Requirements:**
    - **MANDATORY Composer:** Always install Composer: \`COPY --from=composer:latest /usr/bin/composer /usr/bin/composer\`
    - **Complete Dependencies:** Install ALL required packages: \`libzip-dev zip unzip git supervisor nginx libonig-dev curl\`
    - **PHP Extensions:** Install: \`pdo_mysql mbstring zip exif pcntl\`
    - **Web Server Setup:** Configure PHP-FPM + Nginx for production:
      * Install nginx and supervisor in same container
      * Create nginx config for Laravel with \`try_files $uri $uri/ /index.php?$query_string;\`
      * Add supervisor config to run both php-fpm and nginx
      * Expose port 8000 and use \`CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]\`
    - **Permissions:** Add \`RUN chown -R www-data:www-data /var/www/html\` after copying files
    - **Storage permissions:** Add \`RUN chmod -R 775 /var/www/html/storage/\` for Laravel
    - **Production practice:** NEVER copy composer.lock - only copy composer.json and let install generate lock file

D5. **REQUIRED Configuration Files:**
    - **frontend/nginx.conf for Vue.js:**
      \`\`\`
      server {
          listen 80;
          server_name localhost;
          root /usr/share/nginx/html;
          index index.html;
          location / { try_files $uri $uri/ /index.html; }
          location /api { proxy_pass http://backend:8000; }
      }
      \`\`\`
    - **backend/supervisord.conf for Laravel:**
      \`\`\`
      [supervisord]
      [program:nginx]
      command=nginx -g "daemon off;"
      [program:php-fpm]
      command=php-fpm -F
      \`\`\`

**E. CROSS-PLATFORM COMPATIBILITY**

E1. **README Requirements:**
    - Prerequisites with Docker as universal option
    - Both local AND Docker installation alternatives
    - Docker Compose instructions: \`docker-compose up --build\`
    - Troubleshooting with Docker alternatives

E2. **Bilingual:** All user-facing text must be bilingual (EN/IT)

E3. **Environment Configuration:**
    - **.env.example:** Must include ALL required environment variables with safe defaults
    - **Cross-platform paths:** Use forward slashes in all configuration files  
    - **Database credentials:** Use consistent naming (DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD)
    - **Port consistency:** .env.example should match docker-compose.yml port mappings

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
  
  // 3. NUOVO WORKFLOW: Validate -> Fix -> Validate
  console.log(chalk.yellow('\n🔍 Starting post-generation validation...'));
  
  const validator = new PostGenerationValidator();
  const autoCorrector = new AutoCorrector(apiKey);
  
  let validationAttempts = 0;
  const maxAttempts = 3;
  
  while (validationAttempts < maxAttempts) {
    validationAttempts++;
    console.log(chalk.blue(`\n📋 Validation attempt ${validationAttempts}/${maxAttempts}...`));
    
    // Validazione del progetto generato
    const validationResult = await validator.validateGeneratedProject(
      preferences.projectPath,
      preferences.projectType,
      preferences
    );
    
    if (validationResult.isValid) {
      console.log(chalk.green('✅ Project validation PASSED - Everything looks perfect!'));
      break;
    } else {
      console.log(chalk.yellow(`⚠️  Found ${validationResult.errors.length} issues that need correction:`));
      validationResult.errors.forEach(error => {
        console.log(chalk.red(`   ❌ ${error}`));
      });
      
      if (validationAttempts >= maxAttempts) {
        console.log(chalk.yellow('\n⚠️  Maximum correction attempts reached. Manual review may be needed.'));
        break;
      }
      
      // Correzione automatica
      console.log(chalk.blue('\n🔧 Starting automatic correction...'));
      const correctionResult = await autoCorrector.correctProject(
        preferences.projectPath,
        validationResult,
        preferences.projectType,
        preferences
      );
      
      if (correctionResult.success) {
        console.log(chalk.green(`✅ Applied ${correctionResult.corrections.length} corrections`));
        correctionResult.corrections.forEach(correction => {
          if (correction.success) {
            console.log(chalk.green(`   ✅ ${correction.type}: ${correction.file}`));
          } else {
            console.log(chalk.red(`   ❌ Failed ${correction.type}: ${correction.file}`));
          }
        });
      } else {
        console.log(chalk.red(`❌ Automatic correction failed: ${correctionResult.error}`));
        break;
      }
    }
  }
  
  console.log(chalk.bold.green(`\nProject "${preferences.projectName}" created successfully at ${preferences.projectPath}`));
  console.log(chalk.blue('🐳 Your project is now ready with Docker! Check the README.md for setup instructions.'));
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