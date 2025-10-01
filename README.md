# Gemini Code Execution & Review Tool

A web-based application that allows users to execute code using the Gemini API's code execution tool. The application not only runs the code but also leverages Gemini's intelligence to provide suggestions for improvement.

## 🚀 Quick Start & Setup

1.  **Get a Gemini API Key**: You can get one from [Google AI Studio](https://aistudio.google.com/).

2.  **Set Environment Variable**: The application expects the API key to be available as an environment variable named `API_KEY` in the execution environment where you serve the files.

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run the Server**: This command will serve the project on a local web server.
    ```bash
    npm start
    ```

5.  **Open in Browser**: Navigate to the local server address shown in the terminal (e.g., `http://localhost:8080`) in your web browser.

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

## 📁 Project Structure

```
.
├── index.html          # Main HTML file
├── index.tsx           # Main application logic (TypeScript)
├── index.css           # Styles for the application
├── gemini.ts           # Handles communication with the Gemini API
├── ui.ts               # Functions for rendering UI components
├── prompts.ts          # Prompt templates for the Gemini model
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript compiler configuration
├── README.md           # This file
└── ROADMAP.md          # Future development plans
```

## 🔧 Requirements

### For Users
*   A modern web browser (Chrome, Firefox, Safari, Edge).

### For Developers
*   A [Gemini API key](https://aistudio.google.com/).
*   [Node.js](https://nodejs.org/) and npm (for running the project locally).

## 🚀 Usage

1.  **Select Language**: Choose the programming language from the dropdown.
2.  **Enter Code**: Write or paste your code into the main editor.
3.  **Add Tests (Optional)**: Click "Add Tests" to open a second editor for unit tests.
4.  **Execute**: Click the "Execute Code" button.
5.  **View Results**: The application will display the submitted code, execution output, test results, and AI-powered suggestions in separate cards.
6.  **Additional Actions**: Use the secondary buttons to Save, Load, Clear, or Format your code.

## 🛡️ Safety & Security

*   **Sandboxed Execution**: All code is executed in a secure, isolated sandbox environment provided by the Gemini API's code execution tool. This prevents the code from affecting the user's local machine or the server environment.

## 🐛 Troubleshooting

**Error: "API_KEY is not set"**
*   This means the application could not find your Gemini API key. Ensure you have set the `API_KEY` environment variable in the terminal session where you are running the server.

**API Errors**
*   If you receive other API errors, check the following:
    *   Your API key is valid and active.
    *   You have not exceeded your API quota.
    *   Check the browser's developer console for more detailed error messages.

## 🤝 Contributing

Contributions are welcome! If you have suggestions or find a bug, please open an issue.

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes.
4.  Submit a pull request with a clear description of your changes.

## 📄 License

This project is licensed under the Apache-2.0 License. See the `package.json` for details.
