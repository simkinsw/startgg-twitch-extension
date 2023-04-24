import React from "react";
import { createRoot } from 'react-dom/client';
import LiveConfigPage from "./components/LiveConfigPage";

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <LiveConfigPage />
    </React.StrictMode>
);
