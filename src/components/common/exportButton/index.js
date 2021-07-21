import React, { useEffect, useState } from "react";
import styles from "./styles.scss";
import { ReactComponent as ExportIcon } from "../../../assets/svg/export.svg";

const ExportButton = (props) => (
  <div className={styles.export_button}>
    Export
    <ExportIcon />
  </div>
);

export default ExportButton;
