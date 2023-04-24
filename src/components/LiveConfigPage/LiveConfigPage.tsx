import { useEffect, useState } from "react";
import { Startgg, StartggToken } from "../util/Startgg/Startgg";

enum Validation {
    Empty = '',
    Validating = '?',
    Valid = '\u{2705}',
    Invalid = '\u{274c}',
}

const LiveConfigPage = () => {
    //fix this to work with tailwind
    const [theme, setTheme] = useState("light");

    // Token Input/Validation
    const [apiToken, setApiToken] = useState('');

    // Response data
    const [data, setData] = useState({});
    const [validData, setValidData] = useState(Validation.Empty);

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
    }, []);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if(apiToken.length > 0) {
            refreshData();
            intervalId = setInterval(() => {
                refreshData();
            }, 30000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [apiToken]);

    const refreshData = async () => {
        const input = { 
            "query": "query GetSets($phaseId: ID) { phase(id: $phaseId) { id name sets(page: 1, perPage: 3) { nodes { id fullRoundText displayScore } } } }",
            "variables": {
                "phaseId": 1285345,
            }
        };
        setValidData(Validation.Validating);
        try {
            const response = await Startgg.query(apiToken, input);
            setData(response.data);
            setValidData(Validation.Valid);

            // Update config for new clients, and publish to pubsub for existing ones
            twitch.configuration.set("broadcaster", "1", JSON.stringify(response.data));
            twitch.send("broadcast", "text/plain", JSON.stringify(response.data));
        } catch (error) {
            console.error(`Failed to refresh data: ${error}`);
            setValidData(Validation.Invalid);
        }
    }

    return (
        <div className="LiveConfigPage">
            <div className={theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'} >
                <StartggToken onApiToken={setApiToken}/>
                <h2>API Data {validData}</h2>
                <pre>
                {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default LiveConfigPage;