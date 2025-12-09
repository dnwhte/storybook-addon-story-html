import { type StoryContext, type StoryFn } from '@storybook/react-vite';
import type { Options } from 'prettier';

export interface Parameters {
  root?: string | ((StoryFn: StoryFn, context: StoryContext) => string);
  panelTitle?: string;
  canvasToggleText?: { opened: string; closed: string };
  theme?: string;
  disable?: boolean;
  retrieveHtml?: (StoryFn: StoryFn, context: StoryContext) => string | Promise<string>;
  transform?: (code: string) => string | Promise<string>;
  prettierOptions?: Options;
}

export interface CodeUpdateData {
  id: string;
  html: string;
  params: Parameters;
}
