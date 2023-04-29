import { useEffect, useState } from "react";
import "./App.css";
import VideoComponent from "../../components/VideoComponent";

const App = () => {
    const [theme, setTheme] = useState("light");
    const [isVisible, setIsVisible] = useState(true);
    const twitch = window.Twitch?.ext;

    useEffect(() => {
        if (twitch) {
            twitch.listen("broadcast", (target, contentType, body) => {
                console.log(
                    `New PubSub message!\n${target}\n${contentType}\n${body}`
                );
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

            twitch.configuration.onChanged(function(){
                if(twitch.configuration.broadcaster){
                    console.log('Initial configuration');
                    console.log(twitch.configuration.broadcaster.content);
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
    }, [twitch]);

    return isVisible ? (
        <VideoComponent />
    ) : (
        <div className="App">
            <span className="">You shouldn't see this (App is hidden)</span>
        </div>
    );
};

export default App;
