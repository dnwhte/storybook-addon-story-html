import hljs from 'highlight.js';
import xml from 'highlight.js/lib/languages/xml';
import { format } from 'prettier/standalone';
import * as parserHtml from 'prettier/plugins/html';

const ctx: Worker = self as any;
hljs.registerLanguage('xml', xml);

ctx.onmessage = async (event) => {
  if (event.data.code) {
    const code = event.data.code;
    const formattedCode = await formatHtml(code);
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

async function formatHtml(code: string) {
  try {
    return format(code, {
      parser: 'html',
      plugins: [parserHtml],
    });
  } catch (error) {
    console.error('Error formatting code as HTML:', error);
    return code; // Return the original code if formatting fails
  }
}
