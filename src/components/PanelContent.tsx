import React, { useRef } from 'react';
import type { CodeUpdateData } from 'src/types';
import { useStyles } from 'src/hooks';
import { copyToClipboard } from 'src/helpers';

interface PanelContentProps {
  data: CodeUpdateData;
}

export default function PanelContent(props: PanelContentProps) {
  const { data } = props;
  const preRef = useRef<HTMLPreElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useStyles(data.params);

  function copyText() {
    if (!btnRef.current || !preRef.current || !navigator.clipboard) return;

    const el = preRef.current;
    const btn = btnRef.current;
    const text = el.textContent || '';
    copyToClipboard(text, btn);
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
        onClick={copyText}
      >
        Copy
      </button>
    </div>
  );
}
