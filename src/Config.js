import React from "react";
import { createRoot } from "react-dom/client";
import ConfigPage from "./views/ConfigPage";

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ConfigPage />
    </React.StrictMode>
);
