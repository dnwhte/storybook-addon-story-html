import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    docsHtml: {
      panelTitle: 'CUSTOM HTML',
      canvasToggleText: {
        opened: 'CUSTOM Hide HTML',
        closed: 'CUSTOM Show HTML',
      },
      // theme: 'shades-of-purple',
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
