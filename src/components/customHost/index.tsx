import React, { useState } from "react";

import { ReactComponent as ArrowRightIcon } from "assets/svg/arrow_right.svg";
import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import { ReactComponent as LoadingIcon } from "assets/svg/loader.svg";
import "./styles.scss";
import { register } from "lib";
import { defaultFilter } from "lib/types/filter";
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
    telegram: {
      enabled: false,
      botToken: '',
      chatId: '',
    },
    slack: {
      enabled: false,
      hookKey: '',
      channel: '',
    },
    discord: {
      enabled: false,
      webhook: '',
      channel: '',
    },
    selectedTab: {
      "unique-id": "",
      correlationId: "",
      name: "1",
      url: "",
      note: "",
    },
    filter: defaultFilter,
  };

  const data = getStoredData();
  const { host, token } = data;
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState("");
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
          inputValue !== host && tokenInputValue === token,
          inputValue === host && tokenInputValue !== token
        )
          .then((d) => {
            localStorage.clear();
            writeStoredData(d);
            setIsLoading(false);
            handleCloseDialog();
            setErrorText("");
          })
          .catch((err) => {
            if (err.message === "auth failed") {
              setIsLoading(false);
              setErrorText("Authentication failed, token not valid.");
            } else {
              setIsLoading(false);
              setErrorText(
                "We were unable to establish a connection with your server; please try again by clicking on confirm."
              );
            }
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
          setErrorText("");
        })
        .catch((err) => {
          if (err.message === "auth failed") {
            setIsLoading(false);
            setErrorText("Authentication failed, token not valid.");
          } else {
            setIsLoading(false);
            setErrorText(
              "We were unable to establish a connection with your server; please try again by clicking on confirm."
            );
          }
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
            You can point your self hosted interact.sh server below to connect with this web client.
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
          {errorText !== "" && <div className="error">{errorText}</div>}
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
