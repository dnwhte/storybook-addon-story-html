import React, { Fragment, memo, useState } from 'react';
import type { CodeUpdateData } from 'src/types';
import { AddonPanel } from 'storybook/internal/components';
import { Placeholder } from 'storybook/internal/components';
import { useChannel, useStorybookState } from 'storybook/manager-api';
import { EVENTS, PANEL_ID } from '../constants';
import PanelContent from './PanelContent';

interface PanelProps {
  active?: boolean;
}

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props: PanelProps) {
  const [data, setData] = useState<CodeUpdateData>();
  const state = useStorybookState();
  const isSelected = state.selectedPanel === PANEL_ID;

  useChannel({
    [EVENTS.CODE_UPDATE]: (data) => {
      setData(data);
    },
  });

  return (
    <AddonPanel active={props.active ?? false}>
      {data?.html && isSelected ? (
        <PanelContent data={data} />
      ) : (
        <Placeholder>
          <Fragment>No HTML code available for this story.</Fragment>
        </Placeholder>
      )}
    </AddonPanel>
  );
});
