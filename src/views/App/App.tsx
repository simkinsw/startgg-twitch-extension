import Buffer from "buffer";
import Pako from "pako";
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
        const localStorageEventHandler = (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === "message" && event.newValue) {
                const unzipped: Sets = JSON.parse(Pako.inflate(Buffer.Buffer.from(event.newValue, 'base64'), { to: 'string'}));
                dispatch(setSets(unzipped));
            }
        }

        if (twitch) {
            // Get initial configuration from  config service
            twitch.configuration.onChanged(function() {
                if (twitch.configuration.broadcaster) {
                    const unzipped: DataState = JSON.parse(Pako.inflate(Buffer.Buffer.from(twitch.configuration.broadcaster.content, 'base64'), { to: 'string'}));
                    dispatch(setStartGGEvent({id: -1, tournament: unzipped.tournament, name: unzipped.event, imageUrl: unzipped.imageUrl, startggUrl: unzipped.startggUrl }));
                    dispatch(setSets(unzipped.sets));
                }
            });

            // Get updates from pubsub
            twitch.listen("broadcast", (target, contentType, body) => {
                const unzipped: Sets = JSON.parse(Pako.inflate(Buffer.Buffer.from(body, 'base64'), { to: 'string'}));
                dispatch(setSets(unzipped));
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
                const unzipped: DataState = JSON.parse(Pako.inflate(Buffer.Buffer.from(initialState, 'base64'), { to: 'string'}));
                dispatch(setStartGGEvent({id: -1, tournament: unzipped.tournament, name: unzipped.event, imageUrl: unzipped.imageUrl, startggUrl: unzipped.startggUrl }));
                dispatch(setSets(unzipped.sets));
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
