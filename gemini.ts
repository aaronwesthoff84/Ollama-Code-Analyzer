/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Outcome } from '@google/genai';
import {
  createCodeExecutionAndReviewPrompt,
  createCodeFormattingPrompt,
} from './prompts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error('API_KEY is not set. Please follow the setup instructions.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * The structured response from the Gemini API call.
 */
export interface GeminiResponse {
  stdout?: string;
  stderr?: string;
  suggestion?: string;
  testResults?: string;
}

/**
 * Formats the user's code using the Gemini API.
 * @param code The code to format.
 * @param language The language of the code.
 * @returns A promise that resolves to the formatted code string.
 */
export async function formatCode(
  code: string,
  language: string,
): Promise<string> {
  const model = 'gemini-2.5-flash';
  const prompt = createCodeFormattingPrompt(language, code);

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const text = response.text;
  if (!text) {
    throw new Error('The model did not return any content.');
  }

  // Regex to extract code from a markdown block, tolerating missing language hint
  const codeBlockRegex = new RegExp('```(?:' + language + ')?\\n([\\s\\S]*?)\\n```');
  const match = text.match(codeBlockRegex);

  if (match && match[1]) {
    return match[1];
  }

  // Fallback if no markdown block is found, return the whole response trimmed.
  if (text.trim()) {
    return text.trim();
  }

  throw new Error("Could not extract formatted code from the model's response.");
}

/**
 * Runs the user's code using the Gemini API and parses the response.
 * @param code The code to execute.
 * @param language The language of the code.
 * @param tests Optional unit tests to run against the code.
 * @returns A promise that resolves to a structured response.
 */
export async function runCode(
  code: string,
  language: string,
  tests?: string,
): Promise<GeminiResponse> {
  const model = 'gemini-2.5-flash';
  const prompt = createCodeExecutionAndReviewPrompt(language, code, tests);

  if (language === 'markdown') {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const text = response.text;
    const codeBlockRegex = /```markdown\n([\s\S]*?)\n```/;
    const match = text.match(codeBlockRegex);
    if (match && match[1]) {
      return { suggestion: match[1].trim() };
    }
    return { suggestion: text.trim() };
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ codeExecution: {} }],
    },
  });

  const result: GeminiResponse = {};
  let textParts = '';

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.codeExecutionResult) {
        const { outcome, output } = part.codeExecutionResult;
        if (outcome !== Outcome.OUTCOME_OK) {
          result.stderr = output;
        } else {
          result.stdout = output;
        }
      } else if (part.text) {
        textParts += part.text;
      }
    }
  }

  if (textParts) {
    // Extract test results first
    const testResultsRegex = /### Test Results\s*([\s\S]*?)(?:\n###|\n```|$)/;
    const testMatch = textParts.match(testResultsRegex);
    if (testMatch && testMatch[1]) {
      result.testResults = testMatch[1].trim();
      // Remove the test results from textParts to avoid confusion
      textParts = textParts.replace(testResultsRegex, '').trim();
    }

    // Attempt to extract a code block from the remaining text part for the suggestion.
    const codeBlockRegex = new RegExp(
      '```' + language + '\\n([\\s\\S]*?)\\n```',
    );
    const match = textParts.match(codeBlockRegex);
    if (match && match[1]) {
      result.suggestion = match[1];
    }
  }

  // Fallback if no code execution part was found, but there's a text response.
  if (result.stdout === undefined && result.stderr === undefined && textParts) {
    // Don't override the suggestion if it was already found.
    if (!result.suggestion) {
      result.stdout = textParts;
    }
  }

  return result;
}