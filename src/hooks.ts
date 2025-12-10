import { useState, useEffect } from 'react';
import type { Renderer, StoryContext, PartialStoryFn as StoryFunction } from 'storybook/internal/types';
import type { Parameters } from './types';
import { injectThemeStylesheet } from './helpers';

export function useStoryHtml(storyFn: StoryFunction<Renderer>, context: StoryContext, params: Parameters) {
  const [html, setHtml] = useState('');
  const isInDocs = context.viewMode === 'docs';
  const retrievedHtml = typeof params.retrieveHtml === 'function' ? params.retrieveHtml(storyFn, context) : null; // positioned here (outside the useEffect) to avoid invalid hook errors in the retrieveHtml function

  function getRootSelector() {
    const tail = ` ${(typeof params.root === 'function' ? params.root(storyFn, context) : params.root) || ''}`;
    const selector = isInDocs
      ? `[id*="story--${context.id}"][id*="-inner"]${tail}`
      : `#storybook-root${tail}, #root${tail}`;

    return selector.trim();
  }

  function retrieveHtmlFromDom() {
    const selector = getRootSelector();
    const el = document.querySelector(selector);
    const code = el ? el.innerHTML : `${selector} not found.`;

    return code;
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      let code = (await retrievedHtml) || retrieveHtmlFromDom() || '';

      if (typeof params.transform === 'function') {
        try {
          code = await params.transform(code);
        } catch (e) {
          console.error(e);
        }
      }

      setHtml(code);
    }, 0);

    return () => clearTimeout(timer);
  }, [context.args]);

  return html;
}

export function usePrettyHtml(html: string, params: Parameters) {
  const [prettyHtml, setPrettyHtml] = useState('');

  useEffect(() => {
    const worker = new Worker(new URL('./html.worker', import.meta.url), { type: 'module' });

    try {
      worker.postMessage({ code: html, prettierOptions: params.prettierOptions });
      worker.onmessage = function (event) {
        const code = event.data.code;
        setPrettyHtml(code);
      };
    } catch (e) {
      console.error(e);
    }

    return () => {
      worker.terminate();
    };
  }, [html]);

  return prettyHtml;
}

export function useStyles(params: Parameters) {
  useEffect(() => {
    import('./styles/styles.css');

    params.theme ? injectThemeStylesheet(params.theme) : import('./styles/default-hljs-theme.css');
  }, []);
}
