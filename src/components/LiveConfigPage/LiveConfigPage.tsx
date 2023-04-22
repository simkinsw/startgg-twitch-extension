import { useEffect, useState } from "react";

const LiveConfigPage = () => {
    //fix this to work with tailwind
    const [theme, setTheme] = useState("light");
    const twitch = window.Twitch?.ext;

    useEffect(() => {
        if(twitch){
            twitch.listen('broadcast',(target, contentType, body) => {
                twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)

            });

            twitch.onContext((context,delta) => {
                if(delta.includes('theme')){
                    setTheme(context.theme ?? "light")
                }
            });
        }

        return () => {
            if(twitch){
                twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
            }
        }
    });
    
    return (
        <div className="LiveConfigPage">
            <div className={theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'} >
                <p>Hello world!</p>
                <p>This is the live config page! </p>
            </div>
        </div>
    )
}

export default LiveConfigPage;