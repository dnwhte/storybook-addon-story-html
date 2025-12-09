import hljs from 'highlight.js';
import xml from 'highlight.js/lib/languages/xml';
import { format } from 'prettier/standalone';
import * as parserHtml from 'prettier/plugins/html';
import type { Parameters } from './types';
import type { Options } from 'prettier';

const ctx: Worker = self as any;
hljs.registerLanguage('xml', xml);

ctx.onmessage = async (event) => {
  if (event.data.code) {
    const code = event.data.code;
    const prettierOptions = event.data.prettierOptions;
    const formattedCode = await formatHtml(code, prettierOptions);
    const highlightedCode = highlightHtml(formattedCode);
    const response = {
      code: highlightedCode,
    };

    ctx.postMessage(response);
  }
};

function highlightHtml(code: string) {
  return hljs.highlight(code, { language: 'xml' }).value;
}

async function formatHtml(code: string, prettierOptions: Options) {
  try {
    const options = {
      ...prettierOptions,
      parser: 'html',
      plugins: prettierOptions?.plugins?.concat(parserHtml) || [parserHtml],
    };

    return format(code, options);
  } catch (error) {
    console.error('Error formatting code as HTML:', error);
    return code; // Return the original code if formatting fails
  }
}
