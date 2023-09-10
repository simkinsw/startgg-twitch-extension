import React from "react";
import { createRoot } from "react-dom/client";
import LiveConfigPage from "./views/LiveConfigPage";
import { Provider } from "react-redux";
import "./styles.css";
import { store } from "./redux/LiveConfig/store";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LiveConfigPage />
    </Provider>
  </React.StrictMode>,
);
