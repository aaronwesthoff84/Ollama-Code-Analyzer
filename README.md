# Gemini Code Execution & Review Tool

A web-based application that allows users to execute code using the Gemini API's code execution tool. The application not only runs the code but also leverages Gemini's intelligence to provide suggestions for improvement.

## Features

*   **Multi-Language Support**: Execute **Python**, **JavaScript**, **Dockerfile**, **YAML**, and **Shell Script** code.
*   **Advanced Code Editor**: Powered by CodeMirror for a superior editing experience with syntax highlighting and line numbers.
*   **Automatic Language Detection**: The application intelligently analyzes the input code to detect the language and pre-selects the appropriate option.
*   **Code Execution**: Runs code in a secure sandbox via the Gemini API.
*   **Unit Testing**: Define and run unit tests alongside your code to verify correctness.
*   **Clear Output Separation**: Displays standard output (`stdout`) and standard error (`stderr`) in separate, clearly labeled cards for easy debugging.
*   **AI-Powered Code Review**: Gemini analyzes the submitted code and provides a "Suggested Code" card with improvements, bug fixes, or best-practice enhancements.
*   **Copy to Clipboard**: Easily copy the submitted code, execution results, or suggestions with a single click.
*   **Modern UI**: A clean, responsive, dark-themed interface with syntax highlighting for excellent readability.

## Tech Stack

*   **Frontend**: HTML5, CSS3, TypeScript
*   **Gemini API**: The official [`@google/genai`](https://www.npmjs.com/package/@google/genai) library to interact with the `gemini-2.5-flash` model and its code execution capabilities.
*   **Code Editor**: [`CodeMirror`](https://codemirror.net/) provides a robust in-browser editing experience.
*   **Syntax Highlighting**: [`highlight.js`](https://highlightjs.org/) is used for both syntax highlighting in the UI and for automatic language detection.
*   **Markdown Rendering**: [`marked`](https://marked.js.org/) is used to render Markdown responses from the API, enabling formatted code blocks.
*   **Project Structure**: The project follows a standard `src`/`public` structure, compiled with TypeScript.
*   **Dependencies**: Uses `npm` for dependency management.

## Setup and Running

1.  **Get an API Key**: You need a Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/).

2.  **Set Environment Variable**: The application expects the API key to be available as an environment variable named `API_KEY` in the execution environment where you serve the files.

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Build the Project**: Compile the TypeScript source code into JavaScript.
    ```bash
    npm run build
    ```

5.  **Run the Server**: Start a local web server that serves the `public` directory.
    ```bash
    npm start
    ```

6.  **Open in Browser**: Navigate to the local server address shown in the terminal (e.g., `http://localhost:3000`) in your web browser.
