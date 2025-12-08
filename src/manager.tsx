import React from 'react';
import { addons, types, useParameter } from 'storybook/manager-api';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { Panel } from './components/Panel';
import type { Parameters } from './types';

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: () => {
      const params = useParameter<Parameters>(PARAM_KEY);
      return params?.panelTitle || 'HTML';
    },
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => <Panel active={active} />,
    paramKey: PARAM_KEY,
  });
});
