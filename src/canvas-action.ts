// import "@highlightjs/cdn-assets/styles/shades-of-purple.min.css";
// import 'highlight.js/styles/github.css';
// import './_styles.css';
import { COPIED_TIMEOUT } from './constants';
import type { Parameters } from './types';

const instances = new Map();
let currentComponentId = '';

export function setStoryCanvasHtml(componentId: string, storyId: string, html: string, params: Parameters) {
  shouldResetInstances(componentId);
  const storyData = instances.get(storyId);
  const data = storyData ? { ...storyData, html: html } : { storyId: storyId, params: params, html: html };

  instances.set(storyId, data);

  if (storyData?.htmlContainer) {
    updateHtmlView(storyData.htmlContainer, html);
  }
}

export function updateHtmlView(el: HTMLElement, html: string) {
  el.innerHTML = generateInnerHtml(html);
  bindCopyButton(el);
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
  }
}

function createHtmlContainer(storyId: string, story: Element, html: string) {
  const div = document.createElement('div');
  div.id = `html-viewer--${storyId}`;
  div.classList.add('docs-story-html');
  div.innerHTML = generateInnerHtml(html);
  story.after(div);

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
  button.textContent = `Hide ${storyData.params.title || 'HTML'}`;
  button.dataset.storyId = storyId;

  const htmlContainer = createHtmlContainer(storyId, story, storyHtml);
  bindCopyButton(htmlContainer);

  instances.set(storyId, {
    ...storyData,
    htmlContainer: htmlContainer,
  });
}

function bindCopyButton(container: HTMLElement) {
  const copyBtn = container.querySelector<HTMLButtonElement>('.docs-story-html__copy-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeElement = container.querySelector('.docs-story-html__src');
      if (codeElement) {
        const textToCopy = codeElement.textContent || '';
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = 'Copy';
            }, COPIED_TIMEOUT);
          })
          .catch((err) => {
            console.error('Failed to copy text: ', err);
          });
      }
    });
  }
}

function generateInnerHtml(html: string) {
  return `
		<pre class="docs-story-html__src hljs"><code>${html}</code></pre>
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
  button.textContent = 'Show HTML';

  const instance = instances.get(button.dataset.storyId);

  if (instance) {
    instance.htmlContainer?.remove();
  }
}

function toggleOpenState(el: HTMLElement) {
  el.dataset.isOpen = el.dataset.isOpen?.toLowerCase() === 'true' ? 'false' : 'true';

  return el.dataset.isOpen === 'true';
}

async function handleOnClick(e: any) {
  const button = e.target as HTMLElement;
  const isOpen = toggleOpenState(button);

  if (isOpen) {
    initHtmlView(button);
  } else {
    reset(button);
  }
}

export const canvasAction = {
  // TODO: How to access config value here?
  title: 'Show HTML',
  onClick: handleOnClick,
};
