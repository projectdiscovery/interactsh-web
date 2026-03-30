'use client';

import React, { useEffect, useRef, memo, useCallback } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-dark.css';
import 'prismjs/components/prism-http';
import { CopyIcon } from '@/components/icons';
import { copyDataToClipboard } from '@/lib';
import { Protocol } from '@/lib/types/protocol';
import { View } from '@/lib/types/view';
import './styles.scss';

interface DetailedRequestP {
  title: string;
  data: string;
  view: View;
  protocol: Protocol;
}

const DetailedRequest = memo(({ title, data, view, protocol }: DetailedRequestP) => {
  const codeRef = useRef<HTMLElement>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Debounce Prism highlighting to prevent blocking during rapid selection
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    
    highlightTimeoutRef.current = setTimeout(() => {
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    }, 100);

    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [data]);

  const handleCopy = useCallback(() => {
    copyDataToClipboard(data);
  }, [data]);

  return (
    <div
      className="detailed_request_container"
      style={{
        width: view === 'side_by_side' ? '48%' : '100%',
        marginBottom: view === 'side_by_side' ? '0' : '3rem',
      }}
    >
      <span>{title}</span>
      <div className="body">
        <button type="button" className="copy_button" onClick={handleCopy}>
          Copy <CopyIcon />
        </button>
        <div className="pre_wrapper">
          <pre className={protocol === 'http' || protocol === 'https' ? 'language-http' : 'default'}>
            <code
              ref={codeRef}
              className={protocol === 'http' || protocol === 'https' ? 'language-http' : 'default'}
            >
              {data}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
});

export default DetailedRequest;
