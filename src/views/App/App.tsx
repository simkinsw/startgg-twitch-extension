import { ThemeProvider } from "@mui/material";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import VideoComponent from "../../components/App/VideoComponent";
import { theme as muiTheme } from "../../mui-theme";
import { DataState, Sets, setSets, setStartGGEvent } from "../../redux/data";

const App = () => {
    const [theme, setTheme] = useState("light");
    const [isVisible, setIsVisible] = useState(true);
    const twitch = window.Twitch?.ext;

    const dispatch = useDispatch();

    useEffect(() => {
        const configure = async (config: string) => {
            const dataState: DataState = await import('../../utils/compression')
                .then(({ decompress }) => {
                    return decompress(config);
                });
            dispatch(setStartGGEvent(dataState.startGGEvent));
            dispatch(setSets(dataState.sets));
        }

        const addSets = async (compressedInput: string) => {
            const sets: Sets = await import('../../utils/compression')
                .then(({ decompress }) => {
                    return decompress(compressedInput);
                });
            dispatch(setSets(sets));
        }

        if (twitch) {
            // Get initial configuration from  config service
            twitch.configuration.onChanged(function() {
                if (twitch.configuration.broadcaster) {
                    configure(twitch.configuration.broadcaster.content);
                }
            });

            // Get updates from pubsub
            twitch.listen("broadcast", async (_target: string, _contentType: string, body: string) => {
                addSets(body);
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

        // Get updates from localStorage events
        const localStorageEventHandler = async (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === "message" && event.newValue) {
                if (event.newValue !== null) {
                    addSets(event.newValue);
                }
            }
        }

        if (process.env.NODE_ENV === "development") {
            // Get initial config from localStorage
            const initialState = localStorage.getItem('store');
            if (initialState) {
                configure(initialState);
            }

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
    }, [twitch, dispatch]);

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
