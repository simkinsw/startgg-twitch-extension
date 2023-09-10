import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import "./styles.css";
import App from "./views/App";
import { store } from "./redux/VideoComponent/store";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
