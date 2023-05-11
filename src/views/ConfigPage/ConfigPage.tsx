import { useEffect, useState } from "react";
import "./ConfigPage.css";
import { StartggToken } from "../../components/LiveConfig/Startgg/Startgg";

const ConfigPage = () => {
    const [theme, setTheme] = useState("light");
    const [valid, setValid] = useState(false);
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

    const handleApiToken = (token: string) => {
        setValid(token.length > 0);
    }

    return (
        <div className="Config">
            <div className="text">
                <p>Please create a Startgg api token here: <a href="https://start.gg/admin/profile/developer">https://start.gg/admin/profile/developer</a></p>
                <p>Use the box below to validate the connection</p>
                <StartggToken onApiToken={handleApiToken}/>
                <p>{valid ? "Connected!" : "Waiting for api token"}</p>
            </div>
        </div>
    )
}

export default ConfigPage;