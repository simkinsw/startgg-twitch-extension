import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import "../../styles.css";
import { store } from "../../redux/VideoComponent/store";
import VideoComponentPage from "./VideoComponentPage";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <VideoComponentPage />
    </Provider>
  </React.StrictMode>,
);
