/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Creates a prompt for the Gemini model to format code.
 * @param language The programming language of the code.
 * @param code The code to be formatted.
 * @returns The generated prompt string.
 */
export function createCodeFormattingPrompt(
  language: string,
  code: string,
): string {
  const styleGuide =
    {
      python: 'PEP 8',
      javascript: 'Prettier',
      dockerfile: 'standard best practices',
      yaml: 'standard YAML style',
      shell: 'Google Shell Style Guide',
    }[language] || 'standard style conventions';

  return `
Please format the following ${language} code according to the ${styleGuide}.

**Instructions:**
1.  Do not change the logic or functionality of the code.
2.  Only apply formatting changes (e.g., indentation, spacing, line breaks).
3.  Return **only** the formatted code inside a single markdown code block. Do not include any explanations or other text outside the code block.

**Code to Format:**
\`\`\`${language}
${code}
\`\`\`
`;
}

/**
 * Creates a prompt for the Gemini model to execute code and provide suggestions.
 * @param language The programming language of the code.
 * @param code The code to be executed.
 * @param tests Optional unit tests to run against the code.
 * @returns The generated prompt string.
 */
export function createCodeExecutionAndReviewPrompt(
  language: string,
  code: string,
  tests?: string,
): string {
  let prompt = `
Analyze and execute the following ${language} code.

**Instructions:**

1.  **Execute the code:** Run the code and provide the standard output or standard error.
`;

  if (tests && tests.trim()) {
    prompt += `
2.  **Run Unit Tests:** After the initial execution, run the provided unit tests against the code. For Python, assume standard testing libraries like \`unittest\` are available. For JavaScript, assume a simple \`assert\` function is available.
3.  **Format Test Results:** Report the test results in a dedicated markdown section starting with the heading "### Test Results". On the first line of this section, provide a summary (e.g., "Passed: 2/3"). Then, list each test case on a new line, starting with "PASS:" for successful tests or "FAIL:" for failed tests, followed by a brief explanation.
4.  **Review the code:** After execution and testing, analyze the code for bugs, improvements, or alternative approaches.
5.  **Provide suggestions:** If you find areas for improvement, provide a corrected or enhanced version of the code inside a markdown code block. Ensure the suggested code is well-formatted according to standard style guides (e.g., PEP 8 for Python, Prettier for JavaScript). If the code is already perfect, state that no changes are needed.
`;
  } else {
    prompt += `
2.  **Review the code:** After execution, analyze the code for any of the following:
    *   Bugs or potential errors.
    *   Opportunities for improvement (e.g., performance, readability, best practices).
    *   Enhancements or alternative approaches.
3.  **Provide suggestions:** If you find any areas for improvement, provide a corrected or enhanced version of the code inside a markdown code block. Ensure the suggested code is well-formatted according to standard style guides (e.g., PEP 8 for Python, Prettier for JavaScript). If the code is already perfect, state that no changes are needed.
`;
  }

  prompt += `
**Code to Execute and Review:**

\`\`\`${language}
${code}
\`\`\`
`;

  if (tests && tests.trim()) {
    prompt += `
**Unit Tests to Run:**

\`\`\`${language}
${tests}
\`\`\`
`;
  }

  return prompt;
}