/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { runCode } from './gemini';
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
 * @param resultsContainer The container to render results into.
 */
async function handleCodeExecution(
  code: string,
  language: string,
  resultsContainer: HTMLElement,
) {
  if (!resultsContainer) return;
  resultsContainer.innerHTML = ''; // Clear previous results

  // 1. Input Validation
  if (!code.trim()) {
    renderCard(
      'Input Error',
      `Please enter some ${language} code to execute.`,
      resultsContainer,
      { type: 'error' },
    );
    return;
  }

  // 2. Render Spinner
  renderSpinner(resultsContainer);

  try {
    // 3. Call API
    const result = await runCode(code, language);

    // 4. Clear Spinner
    resultsContainer.innerHTML = '';

    // 5. Render Submitted Code Card
    const submittedCodeMarkdown = '```' + language + '\n' + code + '\n```';
    renderCard('Submitted Code', submittedCodeMarkdown, resultsContainer, {
      showCopyButton: true,
      rawContent: code,
      language,
    });

    // 6. Render Result Cards
    let hasOutput = false;
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
  const executeBtn = document.getElementById('execute-btn');
  const codeInput = document.getElementById(
    'code-input',
  ) as HTMLTextAreaElement;
  const resultsContainer = document.getElementById('results');
  const languageSelect = document.getElementById(
    'language-select',
  ) as HTMLSelectElement;

  const placeholders: Record<string, string> = {
    python: "print('Hello, Gemini!')",
    javascript: "console.log('Hello, Gemini!');",
  };

  if (executeBtn && codeInput && resultsContainer && languageSelect) {
    const handleLanguageChange = () => {
      codeInput.placeholder = placeholders[languageSelect.value];
    };

    // Set initial placeholder
    handleLanguageChange();

    // Update placeholder on language change
    languageSelect.addEventListener('change', handleLanguageChange);

    // Auto-detect language on input
    const handleAutoDetect = () => {
      const code = codeInput.value;
      // Don't run on very short snippets
      if (code.trim().length < 20) {
        return;
      }
      const result = hljs.highlightAuto(code, ['python', 'javascript']);

      // Only change if a language was confidently detected (relevance > 10)
      // and it's different from the current selection.
      if (
        result.language &&
        result.relevance > 10 &&
        languageSelect.value !== result.language
      ) {
        languageSelect.value = result.language;
        handleLanguageChange(); // Update placeholder
      }
    };

    codeInput.addEventListener('input', debounce(handleAutoDetect, 500));

    // Execute code on button click
    executeBtn.addEventListener('click', () => {
      handleCodeExecution(
        codeInput.value,
        languageSelect.value,
        resultsContainer,
      );
    });
  }
}

main();
