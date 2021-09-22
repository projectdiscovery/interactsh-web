import React, { useState } from "react";

import { ReactComponent as ArrowRightIcon } from "assets/svg/arrow_right.svg";
import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import { ReactComponent as LoadingIcon } from "assets/svg/loader.svg";
import "./styles.scss";
import { register } from "lib";
import { StoredData } from "lib/types/storedData";

import { getStoredData, writeStoredData } from "../../lib/localStorage";

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
      https: true,
      smtp: true,
      arp: true,
    },
  };

  const data = getStoredData();
  const { host, token } = data;
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    if (
      (inputValue !== "" && inputValue !== "interact.sh" && host !== inputValue) ||
      (inputValue !== "" && inputValue !== "interact.sh" && tokenInputValue !== token)
    ) {
      setIsLoading(true);
      setTimeout(() => {
        register(
          inputValue.replace(/(^\w+:|^)\/\//, ""),
          tokenInputValue,
          true,
          inputValue === host && tokenInputValue !== token
        )
          .then((d) => {
            localStorage.clear();
            writeStoredData(d);
            setIsLoading(false);
            handleCloseDialog();
            setIsHostValid(true);
          })
          .catch(() => {
            setIsLoading(false);
            setIsHostValid(false);
          });
      }, 30);
    }
  };

  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      register(defaultStoredData.host, "", true, false)
        .then((d) => {
          localStorage.clear();
          writeStoredData(d);
          setIsLoading(false);
          handleCloseDialog();
          setIsHostValid(true);
        })
        .catch(() => {
          setIsLoading(false);
          setIsHostValid(false);
        });
    }, 30);
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
            <button
              type="button"
              className="delete_button"
              disabled={isLoading}
              onClick={handleDelete}
            >
              Delete {isLoading && <LoadingIcon />}
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
            <button
              type="button"
              className="submit_button"
              disabled={isLoading || (host === inputValue && token === tokenInputValue)}
              onClick={handleConfirm}
            >
              Confirm
              {isLoading ? <LoadingIcon /> : <ArrowRightIcon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomHost;
