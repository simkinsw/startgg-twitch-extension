import Buffer from "buffer";
import Pako from "pako";
import { ThemeProvider } from "@mui/material";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import VideoComponent from "../../components/App/VideoComponent";
import { theme as muiTheme } from "../../mui-theme";
import { Sets, setSets } from "../../redux/data";


const App = () => {
    const [theme, setTheme] = useState("light");
    const [isVisible, setIsVisible] = useState(true);
    const twitch = window.Twitch?.ext;

    const dispatch = useDispatch();

    useEffect(() => {
        const localStorageEventHandler = (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === "message" && event.newValue) {
                const unzipped: Sets = JSON.parse(Pako.inflate(Buffer.Buffer.from(event.newValue, 'base64'), { to: 'string'}));
                dispatch(setSets({ lastUpdate: -1, sets: unzipped}));
            }
        }

        if (twitch) {
            // Get initial configuration from  config service
            twitch.configuration.onChanged(function() {
                if (twitch.configuration.broadcaster) {
                    const unzipped: Sets = JSON.parse(Pako.inflate(Buffer.Buffer.from(twitch.configuration.broadcaster.content, 'base64'), { to: 'string'}));
                    dispatch(setSets({ lastUpdate: -1, sets: unzipped}));
                }
            });

            // Get updates from pubsub
            twitch.listen("broadcast", (target, contentType, body) => {
                const unzipped: Sets = JSON.parse(Pako.inflate(Buffer.Buffer.from(body, 'base64'), { to: 'string'}));
                dispatch(setSets({ lastUpdate: -1, sets: unzipped}));
            });

            twitch.onVisibilityChanged((isVisible, _c) => {
                setIsVisible(isVisible);
            });

            twitch.onContext((context, delta) => {
                console.log("onContext");
                if (delta.includes("theme")) {
                    setTheme(context.theme ?? "light");
                }
            });
        }

        if (process.env.NODE_ENV === "development") {
            // Get initial config from localStorage
            const initialState = localStorage.getItem('store');
            if (initialState) {
                const unzipped: Sets = JSON.parse(Pako.inflate(Buffer.Buffer.from(initialState, 'base64'), { to: 'string'}));
                dispatch(setSets({ lastUpdate: -1, sets: unzipped}));
            } else {
                dispatch(setSets({lastUpdate: -1, sets: {}}));
            }

            // Get updates from localStorage events
            window.addEventListener('storage', localStorageEventHandler);
        }

        return () => {
            if (twitch) {
                twitch.unlisten("broadcast", () =>
                    console.log("successfully unlistened")
                );
            }
            if (process.env.NODE_ENV === "development") {
                window.removeEventListener('storage', localStorageEventHandler);
            }
        };
    }, [twitch]);

    return isVisible ? (
        <ThemeProvider theme={muiTheme}>
            <VideoComponent />
        </ThemeProvider>
    ) : (
        <div className="App">
            <span className="">You shouldn't see this (App is hidden)</span>
        </div>
    );
};

export default App;
