import type { Preview, StoryContext, StoryFn } from '@storybook/react-vite';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Renderer, PartialStoryFn as StoryFunction } from 'storybook/internal/types';

const preview: Preview = {
  parameters: {
    docsHtml: {
      // panelTitle: 'HTML',
      // canvasToggleText: {
      //   opened: 'Hide HTML',
      //   closed: 'Show HTML',
      // },
      // root: '#my-custom-container',
      // theme: 'shades-of-purple',
      // disable: false,
      // retrieveHtml: (storyFn: StoryFunction<Renderer>, context: StoryContext) => {
      //   const renderedHtml = renderToStaticMarkup(storyFn(context));
      //   return renderedHtml;
      // },
      // transform: function (code: string) {
      //   return code;
      // },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  initialGlobals: {
    background: { value: 'light' },
  },
};

export default preview;
