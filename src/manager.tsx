import React from 'react';
import { addons, types, useParameter } from 'storybook/manager-api';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { Panel } from './components/Panel';
import type { Parameters } from './types';
// import './styles.module.css';
// import sheet from './styles.module.css' assert { type: 'css' };
// document.adoptedStyleSheets = [sheet];
// shadowRoot.adoptedStyleSheets = [sheet];

// Register the addon
addons.register(ADDON_ID, (api) => {
  // const params = useParameter<Parameters>(PARAM_KEY);
  // console.log('Addon parameters:', params);

  // Register a panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: () => {
      const params = useParameter<Parameters>(PARAM_KEY);
      return params?.title || 'HTML';
    },
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => <Panel active={active} />,
    paramKey: PARAM_KEY,
  });
});

// addons.getChannel().on('my-addon-event', (data) => {
//   console.log('Received my-addon-event with data:', data);
// });

addons.getChannel().emit('my-addon-event', { data: 'test' });

// async function loadCss(p) {
//   const s = await import(p, { assert: { type: 'css' } });
//   console.log(s);
// }

// loadCss('./styles.module.css?url');
// loadCss('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css?url');
