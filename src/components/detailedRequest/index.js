import React from 'react';
import styles from './styles.scss';
import CopyIcon from '../../assets/svg/copy.svg';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DetailedRequest = props => {
  const { title, data } = props;
  const copyDataToClipboard = () => {
    navigator.clipboard.writeText(data);
  };

  return (
    <div className={styles.container}>
      <span>{title}</span>
      <div className={styles.body}>
        <div className={styles.copy_button} onClick={copyDataToClipboard}>
          Copy <CopyIcon />
        </div>
        <SyntaxHighlighter language="javascript" style={dark}>
         {data}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default DetailedRequest;
