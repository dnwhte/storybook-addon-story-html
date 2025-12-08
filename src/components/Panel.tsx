import React, { Fragment, memo, useState } from 'react';
import type { CodeUpdateData } from 'src/types';
import { AddonPanel } from 'storybook/internal/components';
import { Placeholder } from 'storybook/internal/components';
import { useChannel } from 'storybook/manager-api';
import { EVENTS } from '../constants';
import PanelContent from './PanelContent';

interface PanelProps {
  active?: boolean;
}

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props: PanelProps) {
  const [data, setData] = useState<CodeUpdateData>();

  useChannel({
    [EVENTS.CODE_UPDATE]: (data) => {
      setData(data);
    },
  });

  return (
    <AddonPanel active={props.active ?? false}>
      {data?.html ? (
        <PanelContent data={data} />
      ) : (
        <Placeholder>
          <Fragment>No HTML code available for this story.</Fragment>
        </Placeholder>
      )}
    </AddonPanel>
  );
});
