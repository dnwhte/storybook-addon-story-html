// import { global } from '@storybook/global';

import { ADDON_ID } from './constants';

// export const clearStyles = (selector: string | string[]) => {
//   const selectors = Array.isArray(selector) ? selector : [selector];
//   selectors.forEach(clearStyle);
// };

// const clearStyle = (input: string | string[]) => {
//   const selector = typeof input === 'string' ? input : input.join('');
//   const element = global.document.getElementById(selector);
//   if (element && element.parentElement) {
//     element.parentElement.removeChild(element);
//   }
// };

// export const addStyles = (selector: string, css: string) => {
//   const existingStyle = global.document.getElementById(selector);
//   if (existingStyle) {
//     if (existingStyle.innerHTML !== css) {
//       existingStyle.innerHTML = css;
//     }
//   } else {
//     const style = global.document.createElement('style');
//     style.setAttribute('id', selector);
//     style.innerHTML = css;
//     global.document.head.appendChild(style);
//   }
// };

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
