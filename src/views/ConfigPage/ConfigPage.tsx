import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { theme as muiTheme } from "../../mui-theme";
import Config from "../../components/Config";

const ConfigPage = () => {
    const [theme, setTheme] = useState("light");
    
    const twitch = window.Twitch?.ext;

    useEffect(() => {
        // do config page setup as needed here
        if(twitch){
    
            twitch.onContext((context, delta) => {
                if(delta.includes('theme')){
                    setTheme(context.theme ?? "light")
                }
            });
        }
    });


    return (
        <ThemeProvider theme={muiTheme}>
            <Config />
        </ThemeProvider>
    )
}

export default ConfigPage;