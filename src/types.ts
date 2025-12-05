import { type StoryContext, type StoryFn } from '@storybook/react-vite';

export interface Parameters {
  theme?: string;
  root?: string;
  panelTitle?: string;
  canvasToggleText?: { opened: string; closed: string };
  retrieveHtml?: (StoryFn: StoryFn, context: StoryContext) => string | Promise<string>;
  transform?: (code: string) => string | Promise<string>;
}

export interface CodeUpdateData {
  id: string;
  html: string;
  params: Parameters;
}

// TODO: Delete
export interface Result {
  divs: DOMRect[];
  styled: DOMRect[];
}
