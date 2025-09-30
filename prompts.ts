/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Creates a prompt for the Gemini model to execute code and provide suggestions.
 * @param language The programming language of the code.
 * @param code The code to be executed.
 * @returns The generated prompt string.
 */
export function createCodeExecutionAndReviewPrompt(
  language: string,
  code: string,
): string {
  return `
Analyze and execute the following ${language} code.

**Instructions:**

1.  **Execute the code:** Run the code and provide the standard output or standard error.
2.  **Review the code:** After execution, analyze the code for any of the following:
    *   Bugs or potential errors.
    *   Opportunities for improvement (e.g., performance, readability, best practices).
    *   Enhancements or alternative approaches.
3.  **Provide suggestions:** If you find any areas for improvement, provide a corrected or enhanced version of the code inside a markdown code block. If the code is already perfect, state that no changes are needed.

**Code to Execute and Review:**

\`\`\`${language}
${code}
\`\`\`
`;
}
