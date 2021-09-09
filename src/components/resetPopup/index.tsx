import React, { useState } from "react";

import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import { ReactComponent as DeleteIcon } from "assets/svg/delete.svg";
import { ReactComponent as DownloadIcon } from "assets/svg/download.svg";
import { ReactComponent as LoadingIcon } from "assets/svg/loader.svg";
import "./styles.scss";
import { deregister, handleDataExport, registert } from "lib";
import { getStoredData, writeStoredData } from "lib/localStorage";

interface CustomHostP {
  handleCloseDialog: () => void;
}

const ResetPopup = ({ handleCloseDialog }: CustomHostP) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = () => {
    const currentStoredData = getStoredData();
    setIsLoading(true);
    registert({ ...currentStoredData, host: currentStoredData.host }, currentStoredData.token)
      .then((d) => {
        deregister(
          currentStoredData.secretKey,
          currentStoredData.correlationId,
          currentStoredData.host,
          currentStoredData.token
        ).then(() => {
          window.location.reload();
        });
        localStorage.clear();
        writeStoredData(d);
        setIsLoading(false);
        handleCloseDialog();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="backdrop_container">
      <div className="dialog_box">
        <div className="header">
          <span>Reset interact.sh</span>
          <CloseIcon onClick={handleCloseDialog} />
        </div>
        <span>
          Please confirm the action, this action can’t be undone and all the client data will be
          deleted immediately. You can download a copy of your data in JSON format by clicking the
          Export button below or in header.
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
