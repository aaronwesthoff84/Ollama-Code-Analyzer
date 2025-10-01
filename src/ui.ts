/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import yaml from 'highlight.js/lib/languages/yaml';
import shell from 'highlight.js/lib/languages/shell';
import kotlin from 'highlight.js/lib/languages/kotlin';
import groovy from 'highlight.js/lib/languages/groovy';

// Setup syntax highlighting
hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('gradle', groovy); // Use Groovy for Gradle

const renderer = new marked.Renderer();
// Custom renderer for code blocks to handle syntax highlighting.
renderer.code = ({ text: code, lang }) => {
  const language = lang || '';
  // If a language is specified and supported by highlight.js, apply highlighting.
  if (language && hljs.getLanguage(language)) {
    const highlightedCode = hljs.highlight(code, {
      language,
      ignoreIllegals: true,
    }).value;
    return `<pre><code class="hljs language-${language}">${highlightedCode}</code></pre>`;
  }
  // For plaintext or unknown languages, just render as plain text within pre/code tags
  // without applying syntax highlighting. Manually escape HTML entities.
  const escapedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  return `<pre><code>${escapedCode}</code></pre>`;
};

marked.setOptions({
  renderer,
});

type CardType = 'normal' | 'error';
interface CardOptions {
  type?: CardType;
  showCopyButton?: boolean;
  rawContent?: string;
  language?: string;
}

/**
 * Renders a card with a title and content to a specified container.
 * @param title The title of the card.
 * @param content The main content of the card (Markdown).
 * @param container The HTML element to append the card to.
 * @param options Additional options for the card.
 */
export function renderCard(
  title: string,
  content: string,
  container: HTMLElement,
  options: CardOptions = {},
) {
  const {
    type = 'normal',
    showCopyButton = false,
    rawContent = content,
    language = '',
  } = options;

  if (!container) return;

  const card = document.createElement('div');
  card.className = `card ${type}`;

  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';

  const cardTitle = document.createElement('h2');
  cardTitle.className = 'card-title';
  cardTitle.textContent = title;
  cardHeader.appendChild(cardTitle);

  if (showCopyButton) {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => {
      // Use the raw, unformatted content for copying, removing markdown fences.
      const contentToCopy = rawContent.replace(
        new RegExp('^```' + language + '\\n|\\n```$', 'g'),
        '',
      );
      navigator.clipboard.writeText(contentToCopy).then(() => {
        copyButton.textContent = 'Copied!';
        copyButton.disabled = true;
        setTimeout(() => {
          copyButton.textContent = 'Copy';
          copyButton.disabled = false;
        }, 2000);
      });
    });
    cardHeader.appendChild(copyButton);
  }

  card.appendChild(cardHeader);

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  let htmlContent = marked.parse(content) as string;

  // Add special formatting for test results
  if (title === 'Test Results') {
    htmlContent = htmlContent
      .replace(/<p>PASS:/g, '<p class="test-pass">✅ PASS:')
      .replace(/<p>FAIL:/g, '<p class="test-fail">❌ FAIL:');
  }

  cardBody.innerHTML = htmlContent;
  card.appendChild(cardBody);

  container.appendChild(card);
}

/**
 * Renders a loading spinner into a container.
 * @param container The HTML element to render the spinner in.
 */
export function renderSpinner(container: HTMLElement) {
  if (!container) return;
  container.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
  `;
}