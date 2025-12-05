import { useState, useEffect } from 'react';
import type { Renderer, PartialStoryFn as StoryFunction } from 'storybook/internal/types';
import { type StoryContext } from '@storybook/react-vite';
import type { Parameters } from './types';
import { addStyles, clearStyles } from './helpers';
import stylesCSS from './styles';
import { ADDON_ID } from './constants';

export function useStoryHtml(storyFn: StoryFunction<Renderer>, context: StoryContext, params: Parameters) {
  const [html, setHtml] = useState('');

  function retrieveHtmlFromDom() {
    const scopedSelector =
      context.viewMode === 'docs' ? `[id*="story--${context.id}"][id*="-inner"]` : '#storybook-root, #root';
    const rootSelector = params.root ? `${scopedSelector} ${params.root}` : scopedSelector;
    const rootEl = document.querySelector(rootSelector);

    let code: string = rootEl ? rootEl.innerHTML : `${rootSelector} not found.`;

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

export function useStyles(location: 'decorator' | 'panel', viewMode?: string) {
  useEffect(() => {
    if (location === 'decorator' && viewMode !== 'docs') return; // don't load for story if not docs view

    const selector = ADDON_ID + '-styles';
    // import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css');
    addStyles(selector, stylesCSS());

    return () => {
      clearStyles(selector);
    };
  }, []);
}
