import { ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";

import VideoComponent from "../../components/App/VideoComponent";
import { theme as muiTheme } from "../../mui-theme";
import useTwitchData from "../../hooks/useTwitchData";

const App = () => {
    const [isVisible, setIsVisible] = useState(true);
    const twitch = window.Twitch?.ext;

    useTwitchData();

    useEffect(() => {
        if (twitch) {
            twitch.onVisibilityChanged((isVisible, _c) => {
                setIsVisible(isVisible);
            });
        }
    }, [twitch]);


    return isVisible ? (
        <ThemeProvider theme={muiTheme}>
            <div style={{ maxWidth: "1024px", maxHeight: "1152px" }}>
                <VideoComponent />
            </div>
        </ThemeProvider>
    ) : (
        <div className="App">
            <span className="">You shouldn't see this (App is hidden)</span>
        </div>
    );
};

export default App;
