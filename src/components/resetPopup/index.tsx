import React, { useState } from "react";

import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import { ReactComponent as DeleteIcon } from "assets/svg/delete.svg";
import { ReactComponent as DownloadIcon } from "assets/svg/download.svg";
import { ReactComponent as LoadingIcon } from "assets/svg/loader.svg";
import "./styles.scss";
import {
  deregister,
  generateRegistrationParams,
  generateUrl,
  handleDataExport,
  register,
} from "lib";
import { defaultStoredData, StoredData, writeStoredData } from "lib/localStorage";
import Tab from "lib/types/tab";

interface CustomHostP {
  handleCloseDialog: () => void;
  storedData: StoredData;
}

const ResetPopup = ({ handleCloseDialog, storedData }: CustomHostP) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const handleConfirm = () => {
  //   handleReset();
  // };

  const handleConfirm = () => {
    setIsLoading(true);
    const { pub, priv, correlation, secret } = generateRegistrationParams();
    register(pub, secret, correlation, storedData.host, storedData.token)
      .then(() => {
        deregister(
          storedData.secretKey,
          storedData.correlationId,
          storedData.host,
          storedData.token
        ).then(() => {
          window.location.reload();
        });
        localStorage.clear();
        const { url, uniqueId } = generateUrl(correlation, 1, storedData.host);
        const tabData: Tab[] = [
          {
            "unique-id": uniqueId,
            correlationId: correlation,
            name: (1).toString(),
            url,
            note: "",
          },
        ];
        writeStoredData({
          ...defaultStoredData,
          privateKey: priv,
          publicKey: pub,
          correlationId: correlation,
          secretKey: secret,
          increment: 1,
          theme: storedData.theme,
          view: storedData.view,
          host: storedData.host,
          token: storedData.token,
          tabs: tabData,
          selectedTab: tabData[0],
        });
        setIsLoading(false);
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
          <button type="button" disabled={isLoading} className="confirm_button" onClick={handleConfirm}>
            Confirm {isLoading ? <LoadingIcon /> : <DeleteIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPopup;
