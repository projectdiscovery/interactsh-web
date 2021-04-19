import React, { useEffect, useState } from 'react';
import styles from './styles.scss';
import ExportIcon from '../../../assets/svg/export.svg';

const ExportButton = props => {
  return (
    <div className={styles.export_button}>
      Export
      <ExportIcon />
    </div>
  );
};

export default ExportButton;
