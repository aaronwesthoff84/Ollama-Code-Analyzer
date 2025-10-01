# Ollama Code Analyzer & Review Tool

A web-based application that allows users to analyze code using a local Ollama instance. The application sends your code to a large language model (LLM) to predict its output, analyze unit tests, and provide suggestions for improvement.

## 🚀 Quick Start & Setup

### 1. Install and Run Ollama
This application requires a local Ollama server to be running.

1.  **Download Ollama**: If you haven't already, download and install Ollama from [ollama.com](https://ollama.com/).
2.  **Pull a Model**: Open your terminal and pull a model. We recommend `llama3` for the best results.
    ```bash
    ollama pull llama3
    ```
3.  **Keep Ollama Running**: The Ollama application or background service must be running for this tool to work.

### 2. Install Project Dependencies
Open your terminal in the project's root directory and run:
```bash
npm install
```

### 3. Run the Development Server
To start the application, run:
```bash
npm run dev
```

### 4. Open in Browser
Navigate to the local server address shown in the terminal (e.g., `http://localhost:3000`) in your web browser.

## ✨ Features

*   **Multi-Language Support**: Analyze **Python**, **JavaScript**, **Kotlin**, **Gradle**, **Dockerfile**, **YAML**, and **Shell Script** code.
*   **Code Analysis & Review**: Sends code to a local Ollama instance for AI-powered analysis and provides suggestions for improvement.
*   **Output Prediction**: Predicts the `stdout` and `stderr` of your code.
*   **Unit Testing Analysis**: Define unit tests and have the AI predict their pass/fail status.
*   **Code Formatting**: Automatically format your code according to language-specific style guides.
*   **Save & Load**: Persist your code and tests in the browser's local storage to continue your work later.
*   **Clear Output Separation**: Displays predicted output, predicted errors, and test results in separate, clearly labeled cards.
*   **Copy to Clipboard**: Easily copy the submitted code, predicted results, or suggestions with a single click.
*   **Modern UI**: A clean, responsive, dark-themed interface with syntax highlighting for excellent readability.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3, TypeScript
*   **AI Backend**: [Ollama](https://ollama.com/) running a local LLM (e.g., Llama 3).
*   **Syntax Highlighting**: [`highlight.js`](https://highlightjs.org/) for code block styling.
*   **Markdown Rendering**: [`marked`](https://marked.js.org/) to render Markdown responses from the API.
*   **Build Tool**: [`Vite`](https://vitejs.dev/) for a fast and modern development experience.

## 📁 Project Structure

```
.
├── src/                  # Main source code directory (Note: project uses root-level files)
├── index.tsx             # Main application logic
├── gemini.ts             # Handles communication with the Ollama API (legacy filename)
├── ui.ts                 # Functions for rendering UI components
├── prompts.ts            # Prompt templates for the Ollama model
├── index.css             # Styles for the application
├── index.html            # Main HTML entry point
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## 🐛 Troubleshooting

**Error: "Could not connect to Ollama..."**
*   This means the web application could not reach your local Ollama server.
*   Ensure the Ollama application is running on your machine.
*   Verify that it is accessible at `http://localhost:11434`. You can test this by visiting that URL in your browser.
*   If you are running Ollama in a container or on a different host, you may need to update the `OLLAMA_HOST` constant in `gemini.ts`.
