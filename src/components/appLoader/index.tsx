import React from "react";

import { ReactComponent as Logo } from "../../assets/svg/logo.svg";

import "./styles.scss";

interface AppLoaderP {
  isRegistered: boolean;
  mode: string;
}

const AppLoader = ({ isRegistered, mode }: AppLoaderP) => (
  <div
    className="loader_container"
    style={{ opacity: isRegistered ? 0 : 1, visibility: isRegistered ? "hidden" : "visible", zIndex: (mode === "loading") ? 110 : 10}}
  >
    <div className="loader_content">
      {mode === "loading" ? (
        <>
          <Logo />{" "}
          <span>
            <span>interact</span>.sh
          </span>
        </>
      ) : (
        "Server Unavailable..."
      )}
    </div>
  </div>
);
export default AppLoader;
