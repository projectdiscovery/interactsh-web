import React, { useEffect } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism-dark.css";
import "prismjs/components/prism-http";
import "prismjs/components/prism-dns-zone-file";

import { copyDataToClipboard } from "lib";
import Protocol from "lib/types/protocol";

import "./styles.scss";
import { ReactComponent as CopyIcon } from "../../assets/svg/copy.svg";

interface DetailedRequestP {
  title: string;
  data: string;
  view: string;
  protocol: Protocol;
}

const DetailedRequest = ({ title, data, view, protocol }: DetailedRequestP) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [data]);

  return (
    <div
      className="detailed_request_container"
      style={{
        width: view === "side_by_side" ? "48%" : "100%",
        marginBottom: view === "side_by_side" ? "0" : "3rem",
      }}
    >
      <span>{title}</span>
      <div className="body">
        <button type="button" className="copy_button" onClick={() => copyDataToClipboard(data)}>
          Copy <CopyIcon />
        </button>
        <div className="pre_wrapper">
          <pre>
            <code
              className={`${
                protocol === "http"
                  ? "language-http"
                  : protocol === "dns"
                  ? " default"
                  : protocol === "smtp" && " default"
              }`}
            >{`${data}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DetailedRequest;
