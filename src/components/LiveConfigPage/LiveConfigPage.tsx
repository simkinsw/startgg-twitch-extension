import { useEffect, useState } from "react";
import { Startgg } from "../util/Startgg/Startgg";

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
    const [validToken, setValidToken] = useState(Validation.Empty);
    const [apiTokenInput, setApiTokenInput] = useState('');

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
        if(validToken === Validation.Valid) {
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
    }, [validToken]);

    const validateApiToken = async (token: string) => {
        const input = { "query": "query { currentUser { id } }" };
        setValidToken(Validation.Validating);
        try {
            await Startgg.query(token, input);
            setApiToken(token);
            setValidToken(Validation.Valid);
        } catch (error) {
            setValidToken(Validation.Invalid)
            console.error(`Failed to validate token: ${error}`);
        }
    }

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
        } catch (error) {
            console.error(`Failed to refresh data: ${error}`);
            setValidData(Validation.Invalid);
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        validateApiToken(apiTokenInput);
        setApiTokenInput("");
    }

    const handleApiTokenInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiTokenInput(event.target.value);
    }
    
    return (
        <div className="LiveConfigPage">
            <div className={theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'} >
                <form onSubmit={handleSubmit}>
                    <label>
                        Enter your startgg api token:
                        <input type="password" value={apiTokenInput} onChange={handleApiTokenInputChange}/>
                    </label>
                    <br></br>
                    <button type="submit">Save</button>
                    {validToken}
                </form>
                <h2>API Data {validData}</h2>
                <pre>
                {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default LiveConfigPage;