import React from "react";
import { createRoot } from "react-dom/client";
import ConfigPage from "./views/ConfigPage";
import "./styles.css";
import { Provider } from "react-redux";
import { store } from "./redux/LiveConfig/store";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigPage />
    </Provider>
  </React.StrictMode>,
);
