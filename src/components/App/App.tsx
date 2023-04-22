import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
    //fix this to work with tailwind
    const [theme, setTheme] = useState("light");
    const [isVisible, setIsVisible] = useState(true);
    const twitch = window.Twitch?.ext;

    useEffect(() => {
        if (twitch) {
            twitch.listen("broadcast", (target, contentType, body) => {
                twitch.rig.log(
                    `New PubSub message!\n${target}\n${contentType}\n${body}`
                );
            });

            twitch.onVisibilityChanged((isVisible, _c) => {
                setIsVisible(isVisible);
            });

            twitch.onContext((context, delta) => {
                if (delta.includes("theme")) {
                    setTheme(context.theme ?? "light");
                }
            });
        }

        return () => {
            if (twitch) {
                twitch.unlisten("broadcast", () =>
                    console.log("successfully unlistened")
                );
            }
        };
    });

    return isVisible ? (
        <div className="App">
            <div className="text">This is the video component</div>
        </div>
    ) : (
        <div className="App">
            <span className="">THIS SHOULD BE INVISIBLE</span>
        </div>
    );
};

export default App;
