import React from 'react';
import styles from './styles.scss';
import CopyIcon from '../../assets/svg/copy.svg';

const DetailedRequest = props => {
  const { title, data } = props;

  return (
    <div className={styles.container}>
      <span>{title}</span>
      <div className={styles.body}>
        <div className={styles.copy_button}>
          Copy <CopyIcon />
        </div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{data}</pre>
      </div>
    </div>
  );
};

export default DetailedRequest;
