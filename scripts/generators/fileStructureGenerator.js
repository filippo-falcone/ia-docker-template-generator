// fileStructureGenerator.js
// Modulo per la generazione della struttura file del progetto tramite AI

const ora = require('ora');
const chalk = require('chalk');

class FileStructureGenerator {
  constructor(model, promptBuilder, logger) {
    this.model = model;
    this.promptBuilder = promptBuilder;
    this.logger = logger;
  }

  buildFileStructurePrompt(preferences) {
    let promptText = this.promptBuilder.buildPrompt({
      frontend: preferences.frontend || preferences.frontendFramework,
      backend: preferences.backend || preferences.backendFramework,
      cssFramework: preferences.cssFramework,
      includeDocker: true,
      includeAuth: false,
      isFullStack: preferences.projectType === 'fullstack'
    });

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

    return promptText;
  }

  async generateFileStructure(preferences) {
    const promptText = this.buildFileStructurePrompt(preferences);
    this.logger.debug('Built file structure prompt', { promptLength: promptText.length });
    const spinner = ora('Designing project architecture...').start();
    try {
      const result = await this.model.generateContent(promptText);
      const response = await result.response;
      const text = response.text().trim();
      this.logger.logApiCall('file structure generation', true);
      const fileList = JSON.parse(text);
      if (!Array.isArray(fileList)) {
        throw new Error('AI response is not a valid file list array');
      }
      spinner.succeed(chalk.green(`Architecture designed`));
      this.logger.debug('AI response parsed successfully', { fileCount: fileList.length });
      return fileList;
    } catch (error) {
      spinner.fail(chalk.red('Failed to design architecture'));
      this.logger.logApiCall('file structure generation', false, error);
      throw error;
    }
  }
}

module.exports = FileStructureGenerator;
