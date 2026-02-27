import { copyToClipboard } from './helpers';
import type { Parameters } from './types';

type StoryData = {
  storyId: string;
  params: Parameters;
  html: string;
};

const instances = new Map<string, StoryData>();
const openContainers = new Map<HTMLElement, HTMLElement>();
let currentComponentId = '';

export function setStoryCanvasHtml(componentId: string, storyId: string, html: string, params: Parameters) {
  shouldResetInstances(componentId);
  const storyData = instances.get(storyId);
  const data = storyData ? { ...storyData, html: html } : { storyId: storyId, params: params, html: html };

  instances.set(storyId, data);
  initToggleButton(storyId, params);

  const htmlContainers = document.querySelectorAll<HTMLElement>(`.docs-story-html[data-story-id="${storyId}"]`);
  htmlContainers.forEach((container) => updateHtmlView(container, html));
}

export function updateHtmlView(el: HTMLElement, html: string) {
  el.innerHTML = generateInnerHtml(html);
  bindCopyButton(el);
}

// FIXME: this is a hacky way to find the button and set the default text.
// There's no guarantee this will actually be our button if user's add their own additionalActions
// Ideally we could access the user's configured parameters and set the text in the title on init.
function initToggleButton(storyId: string, params: Parameters) {
  const button = document.querySelector(
    `#anchor--${storyId} .docs-story > :last-child button:empty`,
  ) as HTMLElement | null;

  if (button) {
    button.textContent = params.canvasToggleText?.closed || 'Show HTML';

    if (params?.syncCanvasTogglesAsTabs) {
      const codeToggle = button.parentElement?.querySelector('.docblock-code-toggle') as HTMLElement | null;

      function handleCodeToggleClick() {
        if (button?.dataset.isOpen === 'true') {
          toggleOpenState(button);
          reset(button);
        }
      }

      function handleButtonClick() {
        if (codeToggle?.classList.contains('docblock-code-toggle--expanded')) {
          codeToggle.click();
        }
      }

      button.addEventListener('click', handleButtonClick);
      codeToggle?.addEventListener('click', handleCodeToggleClick);
    }
  }
}

export function removeCanvasToggleButton(storyId: string) {
  const button = document.querySelector(`#anchor--${storyId} .docs-story > :last-child button:empty`);
  button?.remove();
}

/**
 * Resets the instances map if the provided componentId is different from the currentComponent.
 * This ensures that HTML view state is isolated per component and we're not retaining old data.
 * Side effect: Updates currentComponentId and clears the instances map if a reset occurs.
 */
export function shouldResetInstances(componentId: string) {
  if (currentComponentId !== componentId) {
    currentComponentId = componentId;
    instances.clear();
    openContainers.clear();
  }
}

function createHtmlContainer(storyId: string, story: Element, html: string) {
  const div = document.createElement('div');
  div.dataset.storyId = storyId;
  div.classList.add('docs-story-html');
  div.classList.add('hljs');
  div.innerHTML = generateInnerHtml(html);
  story.querySelector('.docs-story')?.after(div);

  return div;
}

function initHtmlView(button: HTMLElement) {
  const story = button.closest('.sb-anchor');
  const storyId = story?.id.replace('anchor--', '');
  const storyData = instances.get(storyId);

  if (!storyId || !story || !storyData) {
    console.error('Story or storyId not found for HTML view initialization.');
    return;
  }

  const storyHtml = getStoryHtml(storyId);
  button.textContent = storyData.params.canvasToggleText.opened || 'Hide HTML';
  button.dataset.storyId = storyId;

  const htmlContainer = createHtmlContainer(storyId, story, storyHtml);
  bindCopyButton(htmlContainer);
  openContainers.set(button, htmlContainer);
}

function bindCopyButton(container: HTMLElement) {
  const copyBtn = container.querySelector<HTMLButtonElement>('.docs-story-html__copy-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeElement = container.querySelector('.docs-story-html__src');
      if (codeElement) {
        const textToCopy = codeElement.textContent || '';
        copyToClipboard(textToCopy, copyBtn);
      }
    });
  }
}

function generateInnerHtml(html: string) {
  return `
		<pre class="docs-story-html__src"><code>${html}</code></pre>
		<button class="docs-story-html__copy-btn" title="Copy to clipboard" aria-label="Copy to clipboard">
			Copy
		</button>
	`;
}

function getStoryHtml(storyId: string) {
  const storyData = instances.get(storyId);
  if (!storyData) return '';

  return storyData.html;
}

function reset(button: HTMLElement) {
  const instance = instances.get(button.dataset.storyId);
  button.textContent = instance?.params.canvasToggleText.closed || 'Show HTML';

  const htmlContainer = openContainers.get(button);
  htmlContainer?.remove();
  openContainers.delete(button);
}

function toggleOpenState(el: HTMLElement) {
  el.dataset.isOpen = el.dataset.isOpen?.toLowerCase() === 'true' ? 'false' : 'true';

  return el.dataset.isOpen === 'true';
}

async function handleOnClick(e: MouseEvent) {
  const button = e.target as HTMLElement;
  const isOpen = toggleOpenState(button);

  if (isOpen) {
    initHtmlView(button);
  } else {
    reset(button);
  }
}

export const canvasAction = {
  title: '', // FIXME: Find a better way to do this. Left blank to use in initToggleButton later
  onClick: handleOnClick,
};
