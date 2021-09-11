import React from "react";

import "./styles.scss";

const AppLoader = ({ isRegistered }: { isRegistered: boolean }) => (
  <div
    className="loader_container"
    style={{ opacity: isRegistered ? 0 : 1, visibility: isRegistered ? "hidden" : "visible" }}
  >
    Interact
  </div>
);
export default AppLoader;
