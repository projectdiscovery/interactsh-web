import React, { useState } from "react";

import { ReactComponent as ArrowRightIcon } from "assets/svg/arrow_right.svg";
import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import { ReactComponent as LoadingIcon } from "assets/svg/loader.svg";
import "./styles.scss";
import { register } from "lib";

import { defaultStoredData, getStoredData, writeStoredData } from "../../lib/localStorage";

interface CustomHostP {
  handleCloseDialog: () => void;
}

const CustomHost = ({ handleCloseDialog }: CustomHostP) => {
  const data = getStoredData();
  const { host, token } = data;
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState("");
  const [inputValue, setInputValue] = useState<string>(host === "oast.fun" ? "" : host);
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
      (inputValue !== "" && inputValue !== "oast.fun" && host !== inputValue) ||
      (inputValue !== "" && inputValue !== "oast.fun" && tokenInputValue !== token)
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
      register(defaultStoredData.host, defaultStoredData.token, true, false)
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
            You can point your self hosted oast.fun server below to connect with this web client.
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
            {host !== "oast.fun" && (
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
