/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Outcome } from '@google/genai';
import { createCodeExecutionAndReviewPrompt } from './prompts';

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
}

/**
 * Runs the user's code using the Gemini API and parses the response.
 * @param code The code to execute.
 * @param language The language of the code.
 * @returns A promise that resolves to a structured response.
 */
export async function runCode(
  code: string,
  language: string,
): Promise<GeminiResponse> {
  const model = 'gemini-2.5-flash';
  const prompt = createCodeExecutionAndReviewPrompt(language, code);

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
        // FIX: Property 'OUTCOME_ERROR' does not exist on type 'Outcome'.
        // Instead, check for the success case and treat all other outcomes as an error.
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
    // Attempt to extract a code block from the text part for the suggestion.
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
