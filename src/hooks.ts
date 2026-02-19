import { useState, useEffect, useRef } from 'react';
import type { Renderer, StoryContext, PartialStoryFn as StoryFunction } from 'storybook/internal/types';
import type { Parameters, PrettyHtmlState } from './types';
import { injectThemeStylesheet } from './helpers';

export function useStoryHtml(storyFn: StoryFunction<Renderer>, context: StoryContext, params: Parameters) {
  const [html, setHtml] = useState('');
  const isInDocs = context.viewMode === 'docs';
  const retrievedHtml = typeof params.retrieveHtml === 'function' ? params.retrieveHtml(storyFn, context) : null; // positioned here (outside the useEffect) to avoid invalid hook errors in the retrieveHtml function

  // NOTE: This selector depends on Storybook's internal DOM structure and may break if Storybook changes its markup.
  function computeRootSelector() {
    const rootSuffix = ` ${(typeof params.root === 'function' ? params.root(storyFn, context) : params.root) || ''}`;
    const selector = isInDocs
      ? `[id*="story--${context.id}"][id*="-inner"]${rootSuffix ? rootSuffix : ''}`
      : `#storybook-root${rootSuffix ? rootSuffix : ''}, #root${rootSuffix ? rootSuffix : ''}`;

    return selector.trim();
  }

  function retrieveHtmlFromDom() {
    const selector = computeRootSelector();
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
    }, params.waitForRender || 0);

    return () => clearTimeout(timer);
  }, [context.args]);

  return html;
}

/**
 * Hook to format HTML using Prettier in a web worker with debouncing.
 * @param html - The raw HTML string to format.
 * @param params - Configuration parameters, including debounceDelay and prettierOptions.
 * @returns An object with prettyHtml (formatted string), loading (boolean), and error (string or null).
 */
export function usePrettyHtml(html: string, params: Parameters): PrettyHtmlState {
  const [state, setState] = useState<PrettyHtmlState>({ prettyHtml: '', loading: false, error: null });
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastProcessedHtmlRef = useRef<string>(''); // Track last processed HTML to avoid redundant work

  useEffect(() => {
    const trimmedHtml = html.trim();

    // Skip if HTML is empty or unchanged
    if (!trimmedHtml || trimmedHtml === lastProcessedHtmlRef.current) {
      setState((prev) => ({ ...prev, loading: false, error: null }));
      return;
    }

    // Clear previous timeout and abort any ongoing operation
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    // Create new abort controller for this invocation
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Set loading state
    setState((prev) => ({ ...prev, loading: true, error: null }));

    // Set new timeout to debounce the worker call
    debounceTimeoutRef.current = setTimeout(() => {
      if (abortController.signal.aborted) return;

      const worker = new Worker(new URL('./html.worker', import.meta.url), { type: 'module' });
      workerRef.current = worker;

      try {
        worker.postMessage({ code: html, prettierOptions: params.prettierOptions });
        worker.onmessage = function (event) {
          if (abortController.signal.aborted) return;
          const code = event.data.code;
          lastProcessedHtmlRef.current = trimmedHtml; // Update last processed
          setState({ prettyHtml: code, loading: false, error: null });
        };
        worker.onerror = function (error) {
          if (abortController.signal.aborted) return;
          console.error('Worker error:', error);
          setState((prev) => ({ ...prev, loading: false, error: 'Error formatting HTML' })); // Preserve previous prettyHtml
        };
      } catch (e) {
        if (abortController.signal.aborted) return;
        console.error('Error posting to worker:', e);
        setState((prev) => ({ ...prev, loading: false, error: 'Error formatting HTML' })); // Preserve previous prettyHtml
      }
    }, params.debounceDelay || 300);

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [html]); // Only html changes trigger re-runs

  return state; // { prettyHtml: string, loading: boolean, error: string | null }
}

export function useStyles(params: Parameters) {
  useEffect(() => {
    import('./styles/styles.css');

    if (params.theme) {
      injectThemeStylesheet(params.theme);
    } else {
      import('./styles/default-hljs-theme.css');
    }
  }, []);
}
