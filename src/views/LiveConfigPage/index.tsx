import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "../../styles.css";
import { store } from "../../redux/LiveConfig/store";
import LiveConfigPage from "./LiveConfigPage";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LiveConfigPage />
    </Provider>
  </React.StrictMode>,
);
