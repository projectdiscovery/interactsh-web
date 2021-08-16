import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NodeRSA from "node-rsa";
import { v4 as uuidv4 } from "uuid";
import xid from "xid-js";

import { ReactComponent as ArrowRightIcon } from "assets/svg/arrow_right.svg";
import { ReactComponent as CloseIcon } from "assets/svg/close.svg";

import "./styles.scss";

const CustomHost = (props) => {
  const { handleCloseDialog } = props;
  const host = localStorage.getItem("host");
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [isHostValid, setIsHostValid] = useState(true);
  const [inputValue, setInputValue] = useState(
    host == "interact.sh" ? "" : host
  );

  const handleDeleteConfirmationVisibility = () => {
    setIsDeleteConfirmationVisible(!isDeleteConfirmationVisible);
  };

  const handleInput = (e) => {
    setInputValue(e.target.value.replace(/(^\w+:|^)\/\//, ""));
  };

  const handleConfirm = () => {
    if (inputValue != "") {
      const key = new NodeRSA({ b: 2048 });
      const pub = key.exportKey("pkcs8-public-pem");
      const priv = key.exportKey("pkcs8-private-pem");
      const correlation = xid.next().toString();
      const secret = uuidv4().toString();

      const registerFetcherOptions = {
        "public-key": btoa(pub),
        "secret-key": secret,
        "correlation-id": correlation,
      };

      let response;
      const getResponse = async () => {
        response = await fetch(`https://${inputValue}/register`, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          referrerPolicy: "no-referrer",
          body: JSON.stringify(registerFetcherOptions),
        })
          .then((res) => {
            if (res.status == 200) {
              localStorage.clear();
              localStorage.setItem("host", inputValue);
              window.location.reload();
              handleCloseDialog();
              setIsHostValid(true);
              console.log("success!");
            } else {
              setIsHostValid(false);
            }
          })
          .catch((err) => {
            setIsHostValid(false);
          });
      };
      getResponse();
    }
  };

  const handleDelete = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="container">
      {isDeleteConfirmationVisible ? (
        <div className="dialog_box">
          <div className="header">
            <span>Remove Custom Host</span>
            <CloseIcon onClick={handleDeleteConfirmationVisibility} />
          </div>
          <span>
            Please confirm the action, this action can’t be undone and all the
            client data will be delete immediately.
          </span>
          <div className="buttons">
            <div className="delete_button" onClick={handleDelete}>
              Delete
            </div>
          </div>
        </div>
      ) : (
        <div className="dialog_box">
          <div className="header">
            <span>Custom Host</span>
            <CloseIcon onClick={handleCloseDialog} />
          </div>
          <span>
            You can point your self hosted interact.sh server with this hosted
            web client.
          </span>
          <input
            type="text"
            placeHolder="host"
            value={inputValue}
            onChange={handleInput}
          />
          {!isHostValid && (
            <div className="error">
              We failed to connect with your server, please try agian by
              clicking on confirm.
            </div>
          )}
          <div className="buttons">
            {host != "interact.sh" && (
              <div
                className="remove_button"
                onClick={handleDeleteConfirmationVisibility}
              >
                Remove Custom Host
              </div>
            )}
            <div className="submit_button" onClick={handleConfirm}>
              Confirm <ArrowRightIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomHost;
