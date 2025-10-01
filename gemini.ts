/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * NOTE: This file has been modified to use the Ollama API instead of Gemini.
 */

import {
  createCodeFormattingPrompt,
  createCodeReviewPrompt,
} from './prompts';

const OLLAMA_HOST = 'http://localhost:11434';

/**
 * The structured response from the Ollama API call.
 */
export interface GeminiResponse {
  stdout?: string;
  stderr?: string;
  suggestion?: string;
  testResults?: string;
}

/**
 * Calls the Ollama API with a given prompt and expects a JSON response.
 * @param prompt The prompt to send to the model.
 * @returns The parsed JSON object from the model's response.
 */
async function callOllama(prompt: string): Promise<any> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        format: 'json',
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API responded with status ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`Ollama API error: ${data.error}`);
    }

    // The JSON response from the model is a string inside the `response` field.
    return JSON.parse(data.response);
  } catch (e) {
    if (e instanceof Error && e.message.includes('fetch')) {
      throw new Error(
        'Could not connect to Ollama. Please ensure Ollama is running and accessible at ' +
          OLLAMA_HOST,
      );
    }
    throw e; // Re-throw other errors
  }
}

/**
 * Formats the user's code using the Ollama API.
 * @param code The code to format.
 * @param language The language of the code.
 * @returns A promise that resolves to the formatted code string.
 */
export async function formatCode(
  code: string,
  language: string,
): Promise<string> {
  const prompt = createCodeFormattingPrompt(language, code);
  const response = await callOllama(prompt);

  if (response && response.formattedCode) {
    return response.formattedCode;
  }

  // Fallback for models that might not follow the JSON instruction perfectly
  if (typeof response === 'string') {
    const codeBlockRegex = new RegExp(
      '```(?:' + language + ')?\\n([\\s\\S]*?)\\n```',
    );
    const match = response.match(codeBlockRegex);
    if (match && match[1]) {
      return match[1];
    }
  }

  throw new Error("Could not extract formatted code from the model's response.");
}

/**
 * Analyzes the user's code using the Ollama API and parses the response.
 * @param code The code to analyze.
 * @param language The language of the code.
 * @param tests Optional unit tests to run against the code.
 * @returns A promise that resolves to a structured response.
 */
export async function runCode(
  code: string,
  language: string,
  tests?: string,
): Promise<GeminiResponse> {
  const prompt = createCodeReviewPrompt(language, code, tests);
  const response: GeminiResponse = await callOllama(prompt);

  // Ensure the object has the expected keys, even if the model omits them.
  const result: GeminiResponse = {
    stdout: response.stdout || '',
    stderr: response.stderr || '',
    suggestion: response.suggestion || '',
    testResults: response.testResults || '',
  };

  return result;
}