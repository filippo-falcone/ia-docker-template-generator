// Debug per capire quale modulo sta causando il problema
const PromptBuilder = require('./promptBuilder_v2');

console.log('🔍 DEBUG MODULI');

const promptBuilder = new PromptBuilder();

// Test selezioni che causano l'errore
const selections = {
    frontend: 'Vue + Vite',
    cssFramework: 'Bootstrap',
    includeDocker: false,
    isFullStack: false
};

console.log('📋 Selezioni di test:', selections);

// Determina moduli richiesti
const modules = promptBuilder.determineRequiredModules(selections);
console.log('🏗️ Moduli determinati:', modules);

// Testa ogni modulo individualmente
modules.forEach(moduleKey => {
    console.log(`\n🧪 Testing module: ${moduleKey}`);
    
    const module = promptBuilder.technologyModules[moduleKey];
    if (!module) {
        console.log(`❌ Module ${moduleKey} not found!`);
        return;
    }
    
    // Test tutti i metodi
    const methods = ['getProjectStructure', 'getDependencies', 'getConfigurations', 'getValidationRules', 'getCommonErrors'];
    
    methods.forEach(method => {
        try {
            if (typeof module[method] === 'function') {
                const result = module[method]();
                console.log(`  ✅ ${method}: OK (${result.length} chars)`);
            } else {
                console.log(`  ❌ ${method}: MISSING`);
            }
        } catch (error) {
            console.log(`  💥 ${method}: ERROR - ${error.message}`);
        }
    });
});

// Test completo buildPrompt
console.log('\n🎯 TEST BUILD PROMPT COMPLETO:');
try {
    const prompt = promptBuilder.buildPrompt(selections);
    console.log('✅ BuildPrompt SUCCESS!');
    console.log(`📏 Lunghezza: ${prompt.length} caratteri`);
} catch (error) {
    console.log('❌ BuildPrompt FAILED:', error.message);
    console.log('Stack:', error.stack);
}