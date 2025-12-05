/**
 * A decorator is a way to wrap a story in extra “rendering” functionality. Many addons define decorators
 * in order to augment stories:
 * - with extra rendering
 * - gather details about how a story is rendered
 *
 * When writing stories, decorators are typically used to wrap stories with extra markup or context mocking.
 *
 * https://storybook.js.org/docs/react/writing-stories/decorators
 */
import type {
  ProjectAnnotations,
  Renderer,
  StoryContext,
  PartialStoryFn as StoryFunction,
} from 'storybook/internal/types';

import { KEY, PARAM_KEY } from './constants';
import { withGlobals } from './withGlobals';
import { withRoundTrip } from './withRoundTrip';
import { withHtml } from './withHtml';
import { canvasAction } from './canvas-action';
// import './styles.module.css';

/**
 * Note: if you want to use JSX in this file, rename it to `preview.tsx`
 * and update the entry prop in tsup.config.ts to use "src/preview.tsx",
 */
const preview: ProjectAnnotations<Renderer> = {
  decorators: [withGlobals, withRoundTrip, withHtml],
  parameters: {
    [PARAM_KEY]: {
      panelTitle: 'CODE',
      canvasToggleText: {
        opened: 'Hide CODE',
        closed: 'Show CODE',
      },
      // retrieveHtml: (storyFn: StoryFunction<Renderer>, context: StoryContext) => {
      //   return '<p>No HTML retrieved yet. Please make sure to run this in a story.</p>';
      // },
    },
    docs: {
      canvas: {
        additionalActions: [canvasAction],
      },
    },
  },
  initialGlobals: {
    [KEY]: false,
  },
};

export default preview;
