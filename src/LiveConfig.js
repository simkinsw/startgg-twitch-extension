import React from "react";
import { createRoot } from 'react-dom/client';
import LiveConfigPage from "./views/LiveConfigPage";

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <LiveConfigPage />
    </React.StrictMode>
);
