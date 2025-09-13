#!/usr/bin/env node

// [EN] Main setup script for AI Template Generator CLI
// [IT] Script principale di configurazione per la CLI Generatore di Template AI

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// [EN] Supported technologies
// [IT] Tecnologie supportate
const frontendChoices = ['React', 'Angular', 'Vue'];
const backendChoices = ['Node.js', 'Express', 'Laravel'];

// [EN] Ask user for project preferences
// [IT] Chiedi all'utente le preferenze del progetto
async function askPreferences() {
  // [EN] Prompt for frontend and backend
  // [IT] Prompt per frontend e backend
  const answers = await prompt([
    {
      type: 'list',
      name: 'frontend',
      message: '[EN] Choose a frontend technology:\n[IT] Scegli una tecnologia frontend:',
      choices: frontendChoices,
    },
    {
      type: 'list',
      name: 'backend',
      message: '[EN] Choose a backend technology:\n[IT] Scegli una tecnologia backend:',
      choices: backendChoices,
    },
  ]);
  return answers;
}

// [EN] Ask for OpenAI API Key
// [IT] Chiedi la chiave API OpenAI
async function askApiKey() {
  let apiKey = process.env.HF_TOKEN;
  if (!apiKey) {
    const answer = await prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: '[EN] Enter your Hugging Face access token:\n[IT] Inserisci il tuo token Hugging Face:',
      },
    ]);
    apiKey = answer.apiKey;
  }
  return apiKey;
}

// [EN] Generate project structure and Dockerfile using OpenAI
// [IT] Genera la struttura del progetto e il Dockerfile usando OpenAI
async function generateWithOpenAI(apiKey, frontend, backend) {
  // [EN] Prepare a robust prompt for Hugging Face
  // [IT] Prepara un prompt robusto per Hugging Face
  const prompt = `You are an expert Node.js/JavaScript project generator. The user has selected:
Frontend: ${frontend}
Backend: ${backend}

Generate a complete, production-ready CLI template with:
1. A valid package.json (name, version, description, author, license, correct dependencies for Node.js 22+, inquirer v9+, axios, and scripts).
2. A coherent folder structure: /frontend, /backend, /docker.
3. A Dockerfile compatible with the selected technologies.
4. A bilingual README.md (EN/IT) with install, usage, and configuration instructions.
5. All necessary config files (.gitignore, .env.example if needed).
6. All code and comments must be bilingual (EN/IT).
7. The template must be immediately installable and runnable (npm install, node index.js) with no missing files or dependency errors.
8. Adapt code for inquirer v9+ (use createPromptModule).
9. Output all file contents and folder structure, ready to be written to disk.`;

  // [EN] Call Hugging Face Inference API
  // [IT] Chiama l'API Hugging Face Inference
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: prompt,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // La risposta può essere un array di oggetti con campo 'generated_text'
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      return response.data[0].generated_text;
    }
    // In caso di risposta diversa
    return JSON.stringify(response.data, null, 2);
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('[EN] Hugging Face API error:', JSON.stringify(error.response.data));
      console.error('[IT] Errore API Hugging Face:', JSON.stringify(error.response.data));
    } else {
      console.error('[EN] Error calling Hugging Face API:', error.message);
      console.error('[IT] Errore chiamando l’API Hugging Face:', error.message);
    }
    return null;
  }
}

// [EN] Save generated files to disk
// [IT] Salva i file generati su disco
function saveFiles(structureText) {
  // [EN] Do not write if structureText is null or empty
  // [IT] Non scrivere se structureText è nullo o vuoto
  if (!structureText) {
    console.error('[EN] No project structure generated due to an error.');
    console.error('[IT] Nessuna struttura di progetto generata a causa di un errore.');
    return;
  }
  const baseDir = path.join(process.cwd(), 'ai-template-project');
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
  fs.writeFileSync(path.join(baseDir, 'structure.txt'), structureText);
  console.log('[EN] Project structure saved to ai-template-project/structure.txt');
  console.log('[IT] Struttura del progetto salvata in ai-template-project/structure.txt');
}

// [EN] Main execution
// [IT] Esecuzione principale
(async () => {
  console.log('==============================');
  console.log('🧠 AI Template Generator CLI');
  console.log('==============================');

  const { frontend, backend } = await askPreferences();
  const apiKey = await askApiKey();
  const structureText = await generateWithOpenAI(apiKey, frontend, backend);
  saveFiles(structureText);

  console.log('\n[EN] Done! Check the ai-template-project folder.');
  console.log('[IT] Fatto! Controlla la cartella ai-template-project.');
})();
