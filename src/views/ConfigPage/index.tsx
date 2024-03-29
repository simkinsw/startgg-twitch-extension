import React from "react";
import { createRoot } from "react-dom/client";
import "../../styles.css";
import { Provider } from "react-redux";
import { store } from "../../redux/LiveConfig/store";
import ConfigPage from "./ConfigPage";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigPage />
    </Provider>
  </React.StrictMode>,
);
