# 📋 Changelog

All notable changes to the AI Docker Template Generator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-09-20

### 🚀 **Major Architecture Overhaul**

This release represents a complete rewrite of the application with a focus on modularity, user experience, and maintainability.

### ✨ **Added**

#### **Modular Architecture**

- **New Module Structure**: Organized codebase into logical modules under `scripts/` directory
  - `scripts/cli/` - User interaction modules
  - `scripts/generators/` - AI generation logic
  - `scripts/validators/` - Quality assurance modules
  - `scripts/utils/` - Utility functions and logging

#### **Enhanced User Experience**

- **Smart Backend Recommendations**: Intelligent suggestions based on frontend + CSS framework combinations
- **Clean CLI Interface**: Separated technical logging from user-facing messages
- **Navigation Support**: Back navigation and configuration modification capabilities
- **Progress Indicators**: Clear feedback during project generation

#### **Advanced Logging System**

- **File-based Logging**: Detailed technical logs saved to `./logs/` directory
- **Log Rotation**: Automatic cleanup keeping only the last 10 log files
- **Multiple Log Levels**: INFO, WARN, ERROR, DEBUG for comprehensive troubleshooting
- **User-friendly Output**: Clean interface without technical noise

#### **Technology Compatibility Engine**

- **Intelligent Mapping**: Frontend-backend compatibility recommendations
- **Visual Indicators**: Clear notation of recommended vs. available options
- **Optimized Combinations**: Pre-configured stacks for better development experience

#### **AI Prompt Optimization**

- **English-only Prompts**: Improved AI model performance with consistent language
- **Enhanced Templates**: Better structured prompts for more accurate generation
- **Context-aware Generation**: Smart prompt building based on project type and technologies

### 🔄 **Changed**

#### **CLI Workflow**

- **Simplified Flow**: Streamlined technology selection process
- **Better Error Handling**: Comprehensive validation and user-friendly error messages
- **Configuration Management**: Improved API key handling with multiple source support

#### **Project Generation**

- **Quality Improvements**: Better validation of generated projects
- **Full Stack Support**: Enhanced support for frontend-backend combinations
- **Docker Optimization**: Improved Dockerfile generation for different project types

### 🛠️ **Technical Improvements**

#### **Code Quality**

- **JSDoc Documentation**: Comprehensive documentation for all modules
- **Error Handling**: Robust error management throughout the application
- **Type Safety**: Better parameter validation and type checking

#### **Maintainability**

- **Separation of Concerns**: Clear responsibility boundaries between modules
- **Testability**: Modular design for easier unit testing
- **Extensibility**: Architecture designed for easy addition of new technologies

### 📚 **Documentation**

#### **Updated README**

- **Comprehensive Overview**: Detailed explanation of features and architecture
- **Usage Examples**: Clear examples for different use cases
- **Technology Matrix**: Complete mapping of supported technologies
- **Logging Documentation**: Explanation of the new logging system

#### **Developer Documentation**

- **API Documentation**: JSDoc comments for all public interfaces
- **Architecture Guide**: Explanation of the modular design
- **Contributing Guidelines**: Updated guidelines for project contributors

### 🔧 **Dependencies**

#### **Core Dependencies**

- `@google/generative-ai`: ^0.11.4 - Google Gemini AI integration
- `inquirer`: ^9.2.7 - Interactive CLI prompts
- `chalk`: ^5.3.0 - Terminal styling
- `ora`: ^7.0.1 - Loading spinners
- `dotenv`: ^16.3.1 - Environment variable support

### 🎯 **Migration from v1.x**

This is a major release with breaking changes:

#### **File Structure Changes**

- Main logic moved from `index.js` to modular structure
- Configuration now supports both `GOOGLE_API_KEY` and `GEMINI_API_KEY`
- Log files now stored in `./logs/` directory

#### **CLI Changes**

- Enhanced project type selection flow
- New backend recommendation system
- Improved error messages and user feedback

#### **Generation Changes**

- Better fullstack project support
- Improved Docker configurations
- Enhanced validation system

---

## [1.0.0] - 2024-XX-XX

### ✨ **Initial Release**

- Basic AI-powered project generation
- Support for React, Vue, Angular frontends
- Basic Docker integration
- Single-file architecture
- Italian/English mixed interface

---

> **Note**: This changelog tracks major changes and improvements. For detailed commit history, please refer to the Git repository.
