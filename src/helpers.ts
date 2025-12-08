import { ADDON_ID, COPIED_TIMEOUT } from './constants';

export function injectThemeStylesheet(theme: string) {
  const selector = `${ADDON_ID}/theme`;
  const existingLink = global.document.getElementById(selector);

  if (!existingLink) {
    const link = document.createElement('link');
    link.id = selector;
    link.rel = 'stylesheet';
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/${theme}.min.css`;
    global.document.head.appendChild(link);
  }
}

export function copyToClipboard(text: string, btn: HTMLButtonElement) {
  navigator.clipboard.writeText(text).then(
    () => {
      btn.textContent = 'Copied';
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, COPIED_TIMEOUT);
    },
    (err) => {
      console.error('Could not copy text: ', err);
    },
  );
}
