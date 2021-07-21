import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./styles.scss";
import { ReactComponent as CopyIcon } from "../../assets/svg/copy.svg";

const DetailedRequest = (props) => {
  const { title, data, view } = props;
  const copyDataToClipboard = () => {
    navigator.clipboard.writeText(data);
  };

  return (
    <div
      className={styles.container}
      style={{
        width: view == "side_by_side" ? "48%" : "100%",
        marginBottom: view == "side_by_side" ? "0" : "3rem",
      }}
    >
      <span>{title}</span>
      <div className={styles.body}>
        <div className={styles.copy_button} onClick={copyDataToClipboard}>
          Copy <CopyIcon />
        </div>
        <div className={styles.pre_wrapper}>
          <SyntaxHighlighter language="javascript" style={dark}>
            {data}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default DetailedRequest;
