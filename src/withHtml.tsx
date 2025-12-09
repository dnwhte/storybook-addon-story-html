import { useEffect } from 'react';
import { type StoryContext } from '@storybook/react-vite';
import type { Renderer, PartialStoryFn as StoryFunction } from 'storybook/internal/types';
import { useChannel } from 'storybook/preview-api';
import { EVENTS, PARAM_KEY } from './constants';
import { removeCanvasToggleButton, setStoryCanvasHtml } from './canvas-action';
import type { Parameters } from './types';
import { useStoryHtml, usePrettyHtml, useStyles } from './hooks';

export function withHtml(storyFn: StoryFunction<Renderer>, context: StoryContext) {
  const params: Parameters = context.parameters[PARAM_KEY] || {};

  if (params?.disable) {
    removeCanvasToggleButton(context.id);
    return storyFn();
  }

  return render(storyFn, context, params);
}

function render(storyFn: StoryFunction<Renderer>, context: StoryContext, params: Parameters) {
  const emit = useChannel({});
  useStyles(params);

  // retrieve html
  const html = useStoryHtml(storyFn, context, params);

  // prettify html
  const prettyHtml = usePrettyHtml(html, params);

  // emit event to update addon panel
  emit(EVENTS.CODE_UPDATE, {
    id: context.id,
    html: prettyHtml,
    params: params,
  });

  // set html for the docs canvas story
  useEffect(() => {
    if (context.viewMode !== 'docs') return;

    setStoryCanvasHtml(context.componentId, context.id, prettyHtml, params);
  }, [prettyHtml]);

  return storyFn();
}
