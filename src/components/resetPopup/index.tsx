/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";

import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import { ReactComponent as DeleteIcon } from "assets/svg/delete.svg";
import { ReactComponent as DownloadIcon } from "assets/svg/download.svg";
import { ReactComponent as LoadingIcon } from "assets/svg/loader.svg";
import "./styles.scss";
import { handleDataExport, register } from "lib";
import { getStoredData, writeStoredData } from "lib/localStorage";

interface CustomHostP {
  handleCloseDialog: () => void;
}

const ResetPopup = ({ handleCloseDialog }: CustomHostP) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = () => {
    setIsLoading(true);
    const currentStoredData = getStoredData();
    setTimeout(() => {
      register(currentStoredData.host, currentStoredData.token, true, false)
        .then((d) => {
          setIsLoading(false);
          localStorage.clear();
          writeStoredData(d);
          handleCloseDialog();
          window.location.reload();
        })
        .catch(() => {
          setIsLoading(false);
        });
    }, 50);
  };

  return (
    <div className="backdrop_container">
      <div className="dialog_box">
        <div className="header">
          <span>Reset interactsh.com</span>
          <CloseIcon onClick={handleCloseDialog} />
        </div>
        <span>
          Please confirm the action, this action can’t be undone and all the client data will be
          deleted immediately. You can download a copy of your data in JSON format by clicking the
          Export button below or in top right.
        </span>
        <div className="buttons">
          <button type="button" title="Export" className="button" onClick={handleDataExport}>
            Export <DownloadIcon />
          </button>
        </div>
        <div className="buttons">
          <button
            type="button"
            disabled={isLoading}
            className="confirm_button"
            onClick={handleConfirm}
          >
            Confirm {isLoading ? <LoadingIcon /> : <DeleteIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPopup;
