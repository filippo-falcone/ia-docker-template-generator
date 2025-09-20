// fileContentGenerator.js
// Modulo per la generazione del contenuto dei singoli file tramite AI

class FileContentGenerator {
  constructor(model, promptBuilder, logger) {
    this.model = model;
    this.promptBuilder = promptBuilder;
    this.logger = logger;
  }

  async generateSingleFileContent(preferences, filePath, fileList) {
    let promptText = this.promptBuilder.buildPrompt({
      frontend: preferences.frontend || preferences.frontendFramework,
      backend: preferences.backend || preferences.backendFramework,
      cssFramework: preferences.cssFramework,
      includeDocker: true,
      includeAuth: false,
      isFullStack: preferences.projectType === 'fullstack'
    });

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

**Output must be ONLY raw file content for \`${filePath}\`. No markdown, no explanations.**
`;

    try {
      const result = await this.model.generateContent(promptText);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error(`Error generating content for ${filePath}: ${error.message}`);
      return `// Error: Failed to generate content for ${filePath}`;
    }
  }
}

module.exports = FileContentGenerator;
