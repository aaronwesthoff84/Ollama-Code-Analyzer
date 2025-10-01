/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Creates a prompt for the Ollama model to format code.
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
      kotlin: 'Kotlin official style guide',
      gradle: 'standard Gradle conventions',
      dockerfile: 'standard best practices',
      yaml: 'standard YAML style',
      shell: 'Google Shell Style Guide',
    }[language] || 'standard style conventions';

  return `
You are an expert code formatter. Format the following ${language} content according to ${styleGuide}.

**Content to Format:**
\`\`\`${language}
${code}
\`\`\`

Respond with a single JSON object containing one key: "formattedCode". The value should be a string of the formatted code.
Do not include any other text, explanations, or markdown formatting in your response.
`;
}

/**
 * Creates a prompt for the Ollama model to review code and predict output.
 * @param language The programming language of the code.
 * @param code The code to be reviewed.
 * @param tests Optional unit tests to analyze.
 * @returns The generated prompt string.
 */
export function createCodeReviewPrompt(
  language: string,
  code: string,
  tests?: string,
): string {
  let prompt = `
You are a senior software engineer acting as a code analysis tool. Your task is to analyze the provided ${language} code, predict its output, and provide suggestions for improvement.

**Code to Analyze:**
\`\`\`${language}
${code}
\`\`\`
`;

  if (tests && tests.trim()) {
    prompt += `
**Unit Tests to Analyze:**
\`\`\`${language}
${tests}
\`\`\`
`;
  }

  prompt += `
**Instructions:**

1.  **Predict Output:** Analyze the code and predict what its standard output (stdout) and standard error (stderr) would be if it were executed. If there is no output or error, provide an empty string.
2.  **Analyze Tests:** If unit tests are provided, analyze them and predict their results. Format the results in a single string, with each test on a new line, starting with "PASS:" or "FAIL:".
3.  **Suggest Improvements:** Review the code for bugs, performance issues, or style violations. If you find areas for improvement, provide a corrected or enhanced version of the code. If the code is perfect, provide an empty string.

**Response Format:**
Respond with a single, raw JSON object (no markdown formatting) with the following exact structure:
{
  "stdout": "string",
  "stderr": "string",
  "testResults": "string",
  "suggestion": "string"
}
`;

  return prompt;
}
