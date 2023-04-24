import React from "react";
import { createRoot } from "react-dom/client";
import ConfigPage from "./components/ConfigPage";

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ConfigPage />
    </React.StrictMode>
);
