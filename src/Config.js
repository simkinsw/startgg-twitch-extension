import React from "react";
import { createRoot } from "react-dom/client";
import ConfigPage from "./views/ConfigPage";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ConfigPage />
    </React.StrictMode>
);
