import React, { useState } from "react";

import NodeRSA from "node-rsa";
import { v4 as uuidv4 } from "uuid";
import xid from "xid-js";

import { ReactComponent as ArrowRightIcon } from "assets/svg/arrow_right.svg";
import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import "./styles.scss";
import { clearIntervals, deregister, generateUrl, register } from "lib";
import Tab from "lib/types/tab";

import { getStoredData, StoredData, writeStoredData } from "../../lib/localStorage";

interface CustomHostP {
  handleCloseDialog: () => void;
}

const CustomHost = ({ handleCloseDialog }: CustomHostP) => {
  const defaultStoredData: StoredData = {
    theme: "dark",
    privateKey: "",
    publicKey: "",
    correlationId: "",
    secretKey: "",
    data: [],
    aesKey: "",
    notes: [],
    view: "up_and_down",
    increment: 1,
    host: "interact.sh",
    tabs: [],
    token: "",
    selectedTab: {
      "unique-id": "",
      correlationId: "",
      name: "1",
      url: "",
      note: "",
    },
    filter: {
      dns: true,
      http: true,
      smtp: true,
    },
  };

  const data = getStoredData();
  const { host, token, correlationId, secretKey } = data;
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [isHostValid, setIsHostValid] = useState(true);
  const [inputValue, setInputValue] = useState<string>(host === "interact.sh" ? "" : host);
  const [tokenInputValue, setTokenInputValue] = useState<string>(token === "" ? "" : token);

  const handleDeleteConfirmationVisibility = () => {
    setIsDeleteConfirmationVisible(!isDeleteConfirmationVisible);
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.name === "custom_host") {
      setInputValue(e.target.value);
    } else {
      setTokenInputValue(e.target.value);
    }
  };

  const handleConfirm = () => {
    if (inputValue !== "" && inputValue !== "interact.sh" && host !== inputValue) {
      const key = new NodeRSA({ b: 2048 });
      const pub = key.exportKey("pkcs8-public-pem");
      const priv = key.exportKey("pkcs8-private-pem");
      const correlation = xid.next().toString();
      const secret = uuidv4().toString();

      register(pub, secret, correlation, inputValue.replace(/(^\w+:|^)\/\//, ""), tokenInputValue)
        .then(() => {
          deregister(secretKey, correlationId, host).then(() => {
            window.location.reload();
          });
          localStorage.clear();
          const { url, uniqueId } = generateUrl(
            correlation,
            1,
            inputValue.replace(/(^\w+:|^)\/\//, "")
          );
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
            host: inputValue.replace(/(^\w+:|^)\/\//, ""),
            token: tokenInputValue,
            tabs: tabData,
            selectedTab: tabData[0],
          });
          clearIntervals();
          handleCloseDialog();
          setIsHostValid(true);
        })
        .catch(() => {
          setIsHostValid(false);
        });
    }
  };

  const handleDelete = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="backdrop_container">
      {isDeleteConfirmationVisible ? (
        <div className="dialog_box">
          <div className="header">
            <span>Remove Custom Host</span>
            <CloseIcon onClick={handleDeleteConfirmationVisibility} />
          </div>
          <span>
            Please confirm the action, this action can’t be undone and all the client data will be
            delete immediately.
          </span>
          <div className="buttons">
            <button type="button" className="delete_button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="dialog_box">
          <div className="header">
            <span>Custom Host</span>
            <CloseIcon onClick={handleCloseDialog} />
          </div>
          <span>
            You can point your self hosted interact.sh server with this hosted web client.
          </span>
          <input
            type="text"
            name="custom_host"
            placeholder="Host"
            value={inputValue}
            onChange={handleInput}
          />
          <input
            type="text"
            name="token"
            placeholder="Token (optional)"
            disabled={inputValue === ""}
            value={tokenInputValue}
            onChange={handleInput}
          />
          {!isHostValid && (
            <div className="error">
              We failed to connect with your server, please try agian by clicking on confirm.
            </div>
          )}
          <div className="buttons">
            {host !== "interact.sh" && (
              <button
                type="button"
                className="remove_button"
                onClick={handleDeleteConfirmationVisibility}
              >
                Remove Custom Host
              </button>
            )}
            <button type="button" className="submit_button" onClick={handleConfirm}>
              Confirm <ArrowRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomHost;
