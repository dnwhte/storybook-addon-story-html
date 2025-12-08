import { useState, useEffect } from 'react';
import type { Renderer, PartialStoryFn as StoryFunction } from 'storybook/internal/types';
import { type StoryContext } from '@storybook/react-vite';
import type { Parameters } from './types';
import { injectThemeStylesheet } from './helpers';

export function useStoryHtml(storyFn: StoryFunction<Renderer>, context: StoryContext, params: Parameters) {
  const [html, setHtml] = useState('');
  const isInDocs = context.viewMode === 'docs';

  function getRootSelector() {
    const tail = ` ${params.root || ''}`;
    const selector = isInDocs
      ? `[id*="story--${context.id}"][id*="-inner"]${tail}`
      : `#storybook-root${tail}, #root${tail}`;

    return selector.trim();
  }

  function retrieveHtmlFromDom() {
    const selector = getRootSelector();
    const rootEl = document.querySelector(selector);

    let code: string = rootEl ? rootEl.innerHTML : `${selector} not found.`;

    return code;
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      let code = params.retrieveHtml ? await params.retrieveHtml(storyFn, context) : retrieveHtmlFromDom();

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

export function usePrettyHtml(html: string) {
  const [prettyHtml, setPrettyHtml] = useState('');

  useEffect(() => {
    const worker = new Worker(new URL('./html.worker', import.meta.url), { type: 'module' });
    worker.postMessage({ code: html });
    worker.onmessage = function (event) {
      const code = event.data.code;
      setPrettyHtml(code);
    };

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
