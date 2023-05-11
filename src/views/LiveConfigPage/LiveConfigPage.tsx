import { useEffect, useState } from "react";
import LiveConfig from "../../components/LiveConfig";
import { theme as muiTheme } from "../../mui-theme";
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
        <ThemeProvider theme={muiTheme}>
            <div style={{width: "80rem"}}>
                <LiveConfig />
            </div>
        </ThemeProvider>
    );
};

export default LiveConfigPage;
