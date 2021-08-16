import React, { useEffect, useState } from "react";
import "./styles.scss";
import { ReactComponent as ExportIcon } from "assets/svg/export.svg";

const ExportButton = (props) => (
  <div className="export_button">
    Export
    <ExportIcon />
  </div>
);

export default ExportButton;
