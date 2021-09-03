import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import "./styles.scss";
import { ReactComponent as CopyIcon } from "../../assets/svg/copy.svg";

interface DetailedRequestP {
  title: string;
  data: string;
  view: string;
}

const DetailedRequest = ({ title, data, view }: DetailedRequestP) => {
  const copyDataToClipboard = () => {
    navigator.clipboard.writeText(data);
  };

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
        <button type="button" className="copy_button" onClick={copyDataToClipboard}>
          Copy <CopyIcon />
        </button>
        <div className="pre_wrapper">
          <SyntaxHighlighter language="javascript" style={dark}>
            {data}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default DetailedRequest;
