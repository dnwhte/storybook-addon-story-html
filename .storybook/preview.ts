import type { Preview } from '@storybook/react-vite';
// import type { StoryContext, StoryFn } from '@storybook/react-vite';
// import { renderToStaticMarkup } from 'react-dom/server';
// import type { Renderer, PartialStoryFn as StoryFunction } from 'storybook/internal/types';

const preview: Preview = {
  parameters: {
    storyHtml: {
      // panelTitle: 'HTML',
      // canvasToggleText: {
      //   opened: 'Hide HTML',
      //   closed: 'Show HTML',
      // },
      // root: '#wrapper',
      // root: (storyFn: StoryFunction<Renderer>, context: StoryContext) => {
      //   return '#test';
      // },
      // theme: 'shades-of-purple',
      // disable: false,
      // waitForRender: 2000,
      // retrieveHtml: (storyFn: StoryFunction<Renderer>, context: StoryContext) => {
      //   const renderedHtml = renderToStaticMarkup(storyFn(context));
      //   return renderedHtml;
      // },
      // transform: function (code: string) {
      //   return `${code}`;
      // },
      // prettierOptions: {
      //   tabs: true,
      //   tabWidth: 2,
      //   bracketSameLine: true,
      //   endOfLine: 'lf',
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
