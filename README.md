# Gemini Code Execution & Review Tool

A web-based application that allows users to execute code using the Gemini API's code execution tool. The application not only runs the code but also leverages Gemini's intelligence to provide suggestions for improvement.

## 🚀 Quick Start & Setup

### 1. Get a Gemini API Key
You can get a key from [Google AI Studio](https://aistudio.google.com/).

### 2. Create an Environment File
In the root directory of the project, create a new file named `.env`. Open this file and add your API key as follows:

```
VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key.

### 3. Install Dependencies
Open your terminal in the project's root directory and run:
```bash
npm install
```

### 4. Run the Development Server
To start the application, run:
```bash
npm run dev
```

### 5. Open in Browser
Navigate to the local server address shown in the terminal (e.g., `http://localhost:3000`) in your web browser. The app will automatically reload if you make any changes to the code.

## ✨ Features

*   **Multi-Language Support**: Execute **Python**, **JavaScript**, **Kotlin**, **Gradle**, **Dockerfile**, **YAML**, and **Shell Script** code.
*   **Code Execution & Review**: Runs code in a secure sandbox via the Gemini API and provides AI-powered suggestions for improvement.
*   **Unit Testing**: Define and run unit tests alongside your code to verify correctness.
*   **Code Formatting**: Automatically format your code according to language-specific style guides.
*   **Save & Load**: Persist your code and tests in the browser's local storage to continue your work later.
*   **Clear Output Separation**: Displays standard output (`stdout`), standard error (`stderr`), and test results in separate, clearly labeled cards.
*   **Copy to Clipboard**: Easily copy the submitted code, execution results, or suggestions with a single click.
*   **Modern UI**: A clean, responsive, dark-themed interface with syntax highlighting for excellent readability.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3, TypeScript
*   **Gemini API**: The official [`@google/genai`](https://www.npmjs.com/package/@google/genai) library to interact with the `gemini-2.5-flash` model.
*   **Syntax Highlighting**: [`highlight.js`](https://highlightjs.org/) for code block styling.
*   **Markdown Rendering**: [`marked`](https://marked.js.org/) to render Markdown responses from the API.
*   **Build Tool**: [`Vite`](https://vitejs.dev/) for a fast and modern development experience.

## 📁 Project Structure

```
.
├── src/                  # Main source code directory
│   ├── main.tsx          # Main application logic
│   ├── gemini.ts         # Handles communication with the Gemini API
│   ├── ui.ts             # Functions for rendering UI components
│   ├── prompts.ts        # Prompt templates for the Gemini model
│   └── index.css         # Styles for the application
├── .env                  # **Local file for your API key (you create this)**
├── index.html            # Main HTML entry point
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript compiler configuration
└── README.md             # This file
```

## 🐛 Troubleshooting

**Error: "API_KEY is not set"**
*   This means the application could not find your Gemini API key. Ensure you have created a `.env` file in the project root and that it contains `VITE_API_KEY=...` with your valid key.

**API Errors**
*   If you receive other API errors, check the following:
    *   Your API key is valid and active.
    *   You have not exceeded your API quota.
    *   Check the browser's developer console for more detailed error messages.
