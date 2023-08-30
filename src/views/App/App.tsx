import { ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";

import VideoComponent from "../../components/App/VideoComponent";
import { theme as muiTheme } from "../../mui-theme";
import useTwitchData from "../../hooks/useTwitchData";
import { useDispatch } from "react-redux";
import { TransferState, setSets, setStartGGEvent } from "../../redux/data";

const App = () => {
    const [isVisible, setIsVisible] = useState(true);
    const twitch = window.Twitch?.ext;

    const dispatch = useDispatch();

    useEffect(() => {
        // NOTE: This is annoying. This logic used to be next to the pubsub code,
        // but twitch.configuration.onChanged wasn't triggering. To be investigated...
        const handleConfig = async (compressedConfig: string) => {
            await import('../../utils/message')
                .then(({ decompress }) => {
                    // Get inital config
                    const config: TransferState = decompress(compressedConfig);
                    dispatch(setStartGGEvent(config.startGGEvent));
                    dispatch(setSets(config.sets));
                });
        }
        if (twitch) {
            // Get initial config
            twitch.configuration.onChanged(() => {
                handleConfig(twitch.configuration.broadcaster.content);
            });

            twitch.onVisibilityChanged((isVisible: boolean, _c: any) => {
                setIsVisible(isVisible);
            });
        }

        // Config from localStorage
        if (process.env.NODE_ENV === "development") {
            // Use localStorage as a message bus
            const store: string = localStorage.getItem("store") || "";
            if (store) {
                handleConfig(store);
            }
        }
    }, [dispatch, twitch]);

    useTwitchData();

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
