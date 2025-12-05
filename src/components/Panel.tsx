import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import type { CodeUpdateData, Parameters, Result } from 'src/types';
import { AddonPanel } from 'storybook/internal/components';
import { Button, Placeholder, TabsState } from 'storybook/internal/components';
import { useChannel } from 'storybook/manager-api';
// import './styles.module.css';

// import '@highlightjs/cdn-assets/styles/shades-of-purple.min.css';
// import 'highlight.js/styles/shades-of-purple.css';
// import 'highlight.js/styles/github-dark-dimmed.css';

import { COPIED_TIMEOUT, EVENTS } from '../constants';
import { useStyles } from 'src/hooks';
// import { useStyles } from 'src/hooks';
interface PanelProps {
  active?: boolean;
}
interface PanelContentProps {
  data: CodeUpdateData;
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

function PanelContent(props: PanelContentProps) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const { data } = props;

  useStyles(data.params);

  function copyToClipboard() {
    if (!btnRef.current || !preRef.current || !navigator.clipboard) return;

    const el = preRef.current;
    const btn = btnRef.current;
    const text = el.textContent || '';
    navigator.clipboard.writeText(text).then(
      () => {
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, COPIED_TIMEOUT);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      },
    );
  }

  return (
    <div className="docs-story-html">
      <pre ref={preRef} className="docs-story-html__src hljs">
        <code dangerouslySetInnerHTML={{ __html: data.html }} />
      </pre>
      <button
        ref={btnRef}
        className="docs-story-html__copy-btn"
        title="Copy to clipboard"
        aria-label="Copy to clipboard"
        onClick={copyToClipboard}
      >
        Copy
      </button>
    </div>
  );
}

// import React, { Fragment, memo, useCallback, useState } from 'react';
// import type { Result } from 'src/types';
// import { AddonPanel } from 'storybook/internal/components';
// import { Button, Placeholder, TabsState } from 'storybook/internal/components';
// import { useChannel } from 'storybook/manager-api';
// import { styled, useTheme } from 'storybook/theming';

// import { EVENTS } from '../constants';
// import { List } from './List';

// interface PanelProps {
//   active?: boolean;
// }

// export const RequestDataButton = styled(Button)({
//   marginTop: '1rem',
// });

// export const Panel: React.FC<PanelProps> = memo(function MyPanel(props: PanelProps) {
//   const theme = useTheme();

//   // https://storybook.js.org/docs/react/addons/addons-api#useaddonstate
//   const [{ divs, styled }, setState] = useState<Result>({
//     divs: [],
//     styled: [],
//   });

//   // https://storybook.js.org/docs/react/addons/addons-api#usechannel
//   const emit = useChannel({
//     [EVENTS.RESULT]: (newResults) => {
//       setState(newResults);
//     },
//   });

//   const fetchData = useCallback(() => {
//     emit(EVENTS.REQUEST);
//   }, [emit]);

//   return (
//     <AddonPanel active={props.active ?? false}>
//       <TabsState initial="overview" backgroundColor={theme.background.hoverable}>
//         <div id="overview" title="Overview" color={theme.color.positive}>
//           <Placeholder>
//             <Fragment>
//               Addons can gather details about how a story is rendered. This is panel uses a tab pattern. Click the
//               button below to fetch data for the other two tabs.
//             </Fragment>
//             <Fragment>
//               <RequestDataButton onClick={fetchData}>Request data</RequestDataButton>
//             </Fragment>
//           </Placeholder>
//         </div>
//         <div id="div" title={`${divs.length} Divs`} color={theme.color.negative}>
//           {divs.length > 0 ? (
//             <Placeholder>
//               <p>The following divs have less than 2 childNodes</p>
//               <List
//                 items={divs.map((item, index) => ({
//                   title: `item #${index}`,
//                   description: JSON.stringify(item, null, 2),
//                 }))}
//               />
//             </Placeholder>
//           ) : (
//             <Placeholder>
//               <p>No divs found</p>
//             </Placeholder>
//           )}
//         </div>
//         <div id="all" title={`${styled.length} All`} color={theme.color.warning}>
//           {styled.length > 0 ? (
//             <Placeholder>
//               <p>The following elements have a style attribute</p>
//               <List
//                 items={styled.map((item, index) => ({
//                   title: `item #${index}`,
//                   description: JSON.stringify(item, null, 2),
//                 }))}
//               />
//             </Placeholder>
//           ) : (
//             <Placeholder>
//               <p>No styled elements found</p>
//             </Placeholder>
//           )}
//         </div>
//       </TabsState>
//     </AddonPanel>
//   );
// });
