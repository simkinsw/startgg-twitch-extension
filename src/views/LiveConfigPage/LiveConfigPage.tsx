// TODO: get/set initial data
// TODO: get/set updates
// TODO: publish updates
// TODO: use updatedAfter: Timestamp filter for updates 
import { useEffect, useState } from "react";
import LiveConfig from "../../components/LiveConfig";
import { darkTheme } from "../../mui-theme";
import { ThemeProvider } from "@mui/material";

const LiveConfigPage = () => {
    const [theme, setTheme] = useState("light");

    const twitch = window.Twitch?.ext;

    useEffect(() => {
        if (twitch) {
            twitch.listen("broadcast", (target, contentType, body) => {
                twitch.rig.log(
                    `New PubSub message!\n${target}\n${contentType}\n${body}`
                );
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
    }, [twitch]);

    return (
        <ThemeProvider theme={darkTheme}>
            <LiveConfig />
        </ThemeProvider>
    );
};

export default LiveConfigPage;
