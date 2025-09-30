/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatCode, runCode } from './gemini';
import { renderCard, renderSpinner } from './ui';
import hljs from 'highlight.js/lib/core';

/**
 * Simple debounce function.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 * @returns A debounced function.
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Handles the end-to-end process of executing code.
 * @param code The code to execute.
 * @param language The language of the code.
 * @param tests The unit tests to run.
 * @param resultsContainer The container to render results into.
 */
async function handleCodeExecution(
  code: string,
  language: string,
  tests: string,
  resultsContainer: HTMLElement,
) {
  if (!resultsContainer) return;
  resultsContainer.innerHTML = ''; // Clear previous results

  // 1. Input Validation
  if (!code.trim()) {
    renderCard(
      'Input Error',
      `Please enter some ${language} content to process.`,
      resultsContainer,
      { type: 'error' },
    );
    return;
  }

  // 2. Render Spinner
  renderSpinner(resultsContainer);

  try {
    // 3. Call API
    const result = await runCode(code, language, tests);

    // 4. Clear Spinner
    resultsContainer.innerHTML = '';

    // 5. Render Submitted Content
    const submittedContentMarkdown = '```' + language + '\n' + code + '\n```';
    renderCard(
      `Submitted ${language === 'markdown' ? 'Markdown' : 'Code'}`,
      submittedContentMarkdown,
      resultsContainer,
      {
        showCopyButton: true,
        rawContent: code,
        language,
      },
    );

    // 6. Handle Markdown Review
    if (language === 'markdown') {
      if (result.suggestion) {
        renderCard(
          'Review & Suggestions',
          '```markdown\n' + result.suggestion + '\n```',
          resultsContainer,
          {
            showCopyButton: true,
            rawContent: result.suggestion,
            language: 'markdown',
          },
        );
      } else {
        renderCard(
          'Model Response',
          'The model did not provide any suggestions.',
          resultsContainer,
        );
      }
      return; // End here for markdown
    }

    // 7. Render Code Execution Results
    if (tests.trim()) {
      const submittedTestsMarkdown = '```' + language + '\n' + tests + '\n```';
      renderCard('Submitted Tests', submittedTestsMarkdown, resultsContainer, {
        showCopyButton: true,
        rawContent: tests,
        language,
      });
    }

    let hasOutput = false;
    if (result.testResults) {
      hasOutput = true;
      renderCard('Test Results', result.testResults, resultsContainer);
    }

    if (result.stderr) {
      hasOutput = true;
      const stderrMarkdown = '```\n' + result.stderr + '\n```';
      renderCard('Debug Output', stderrMarkdown, resultsContainer, {
        type: 'error',
        showCopyButton: true,
        rawContent: result.stderr,
      });
    }

    if (result.stdout) {
      hasOutput = true;
      const stdoutMarkdown = '```\n' + result.stdout + '\n```';
      renderCard('Execution Result', stdoutMarkdown, resultsContainer, {
        showCopyButton: true,
        rawContent: result.stdout,
      });
    }

    if (result.suggestion) {
      hasOutput = true;
      const suggestionMarkdown =
        '```' + language + '\n' + result.suggestion + '\n```';
      renderCard('Suggested Code', suggestionMarkdown, resultsContainer, {
        showCopyButton: true,
        rawContent: result.suggestion,
        language,
      });
    }

    if (!hasOutput) {
      renderCard(
        'Model Response',
        'The code executed without producing any output, and no suggestions were provided.',
        resultsContainer,
      );
    }
  } catch (e) {
    resultsContainer.innerHTML = '';
    renderCard(
      'API Error',
      `An error occurred: ${(e as Error).message}`,
      resultsContainer,
      { type: 'error' },
    );
  }
}

/**
 * Main application entry point.
 */
function main() {
  const executeBtn = document.getElementById(
    'execute-btn',
  ) as HTMLButtonElement;
  const resultsContainer = document.getElementById('results');
  const languageSelect = document.getElementById(
    'language-select',
  ) as HTMLSelectElement;
  const toggleTestsBtn = document.getElementById(
    'toggle-tests-btn',
  ) as HTMLButtonElement;
  const testInputContainer = document.getElementById('test-input-container');
  const codeInput = document.getElementById('code-input') as HTMLTextAreaElement;
  const testInput = document.getElementById('test-input') as HTMLTextAreaElement;
  const formatBtn = document.getElementById('format-btn') as HTMLButtonElement;
  const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
  const loadBtn = document.getElementById('load-btn') as HTMLButtonElement;

  const placeholders: Record<string, string> = {
    python: "print('Hello, Gemini!')",
    javascript: "console.log('Hello, Gemini!');",
    dockerfile:
      'FROM python:3.9-slim\nWORKDIR /app\nCOPY . .\nCMD ["python", "app.py"]',
    yaml: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-pod',
    shell: 'echo "Hello from a shell script!"',
    markdown: '# My Document\n\nStart writing your markdown here.',
  };
  const testPlaceholders: Record<string, string> = {
    python: `# Example using standard assert\ndef test_my_function():\n    assert my_function(2) == 4`,
    javascript: `// Example: Assume a global 'assert' object\nassert.strictEqual(myFunction(2), 4);`,
    dockerfile: `# Example: check if a specific port is exposed\nRUN grep "EXPOSE 8080" Dockerfile`,
    yaml: `# Example: check for a required key using a shell command\nyaml_lint my_file.yaml || exit 1`,
    shell: `# Example: test if a command succeeds\nif my_script.sh --version; then\n  echo "PASS: version command successful"\nelse\n  echo "FAIL: version command failed"\nfi`,
    markdown: '',
  };

  if (
    executeBtn &&
    resultsContainer &&
    languageSelect &&
    toggleTestsBtn &&
    testInputContainer &&
    codeInput &&
    testInput &&
    formatBtn &&
    saveBtn &&
    loadBtn
  ) {
    const handleLanguageChange = () => {
      const selectedLanguage = languageSelect.value;
      codeInput.placeholder = placeholders[selectedLanguage];
      testInput.placeholder = testPlaceholders[selectedLanguage];

      if (selectedLanguage === 'markdown') {
        executeBtn.textContent = 'Review Markdown';
        toggleTestsBtn.style.display = 'none';
        testInputContainer.style.display = 'none';
        testInput.value = '';
      } else {
        executeBtn.textContent = 'Execute Code';
        toggleTestsBtn.style.display = 'inline-block';
        if (toggleTestsBtn.textContent === 'Remove Tests') {
          testInputContainer.style.display = 'block';
        }
      }
    };

    const handleAutoDetect = () => {
      const code = codeInput.value;
      if (code.trim().length < 20) return;
      const result = hljs.highlightAuto(code, [
        'python',
        'javascript',
        'dockerfile',
        'yaml',
        'shell',
        'markdown',
      ]);
      if (
        result.language &&
        result.relevance > 10 &&
        languageSelect.value !== result.language
      ) {
        languageSelect.value = result.language;
        handleLanguageChange();
      }
    };

    const debouncedAutoDetect = debounce(handleAutoDetect, 500);
    codeInput.addEventListener('input', debouncedAutoDetect);
    languageSelect.addEventListener('change', handleLanguageChange);

    toggleTestsBtn.addEventListener('click', () => {
      const isHidden = testInputContainer.style.display === 'none';
      if (isHidden) {
        testInputContainer.style.display = 'block';
        toggleTestsBtn.textContent = 'Remove Tests';
      } else {
        testInputContainer.style.display = 'none';
        toggleTestsBtn.textContent = 'Add Tests';
        testInput.value = '';
      }
    });

    executeBtn.addEventListener('click', () => {
      const code = codeInput.value;
      const tests =
        testInputContainer.style.display === 'none' ? '' : testInput.value;
      handleCodeExecution(code, languageSelect.value, tests, resultsContainer);
    });

    const handleCodeFormatting = async () => {
      const code = codeInput.value;
      if (!code.trim()) return; // Don't format empty code

      formatBtn.textContent = 'Formatting...';
      formatBtn.disabled = true;
      try {
        const formattedCode = await formatCode(code, languageSelect.value);
        codeInput.value = formattedCode;
      } catch (e) {
        console.error('Formatting failed:', e);
        alert(`Code formatting failed: ${(e as Error).message}`);
      } finally {
        formatBtn.textContent = 'Format Code';
        formatBtn.disabled = false;
      }
    };

    formatBtn.addEventListener('click', handleCodeFormatting);

    const handleSaveCode = () => {
      const state = {
        code: codeInput.value,
        tests: testInput.value,
        language: languageSelect.value,
        testsVisible: testInputContainer.style.display !== 'none',
      };
      localStorage.setItem('geminiCodeExecution.savedState', JSON.stringify(state));
      saveBtn.textContent = 'Saved!';
      loadBtn.disabled = false; // Enable load button after saving
      setTimeout(() => {
        saveBtn.textContent = 'Save Code';
      }, 2000);
    };

    const handleLoadCode = () => {
      const savedStateJSON = localStorage.getItem('geminiCodeExecution.savedState');
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        codeInput.value = savedState.code || '';
        testInput.value = savedState.tests || '';
        languageSelect.value = savedState.language || 'python';

        if (savedState.testsVisible && savedState.language !== 'markdown') {
          testInputContainer.style.display = 'block';
          toggleTestsBtn.textContent = 'Remove Tests';
        } else {
          testInputContainer.style.display = 'none';
          toggleTestsBtn.textContent = 'Add Tests';
        }
        handleLanguageChange(); // Update UI based on loaded language
      } else {
        alert('No saved code found.');
      }
    };

    saveBtn.addEventListener('click', handleSaveCode);
    loadBtn.addEventListener('click', handleLoadCode);

    // Set initial placeholders and UI state
    handleLanguageChange();

    // Set initial state for load button
    if (!localStorage.getItem('geminiCodeExecution.savedState')) {
      loadBtn.disabled = true;
    }
  }
}

main();