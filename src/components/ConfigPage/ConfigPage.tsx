import { useEffect, useState } from "react";
import "./ConfigPage.css";

const ConfigPage = () => {
    //fix this to work with tailwind
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
        <div className="Config">
            <div className="text">
                There is no configuration needed for this extension!
            </div>
        </div>
    )
}

export default ConfigPage;