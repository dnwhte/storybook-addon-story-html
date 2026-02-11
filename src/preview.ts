import type { ProjectAnnotations, Renderer } from 'storybook/internal/types';
import { PARAM_KEY } from './constants';
import { withHtml } from './withHtml';
import { canvasAction } from './canvas-action';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withHtml],
  parameters: {
    [PARAM_KEY]: {
      panelTitle: 'HTML',
      canvasToggleText: {
        opened: 'Hide HTML',
        closed: 'Show HTML',
      },
    },
    docs: {
      canvas: {
        additionalActions: [canvasAction],
      },
    },
  },
};

export default preview;
