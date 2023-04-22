import { useEffect, useState } from "react";

const LiveConfigPage = () => {
    //fix this to work with tailwind
    const [theme, setTheme] = useState("light");
    const [apiToken, setApiToken] = useState('');
    const [validToken, setValidToken] = useState(false);
    const [apiTokenInput, setApiTokenInput] = useState('');
    const [data, setData] = useState('');
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
        if(validToken) {
            console.log("Grabbing initial data");
            refreshData();
            console.log("Starting polling loop");
            intervalId = setInterval(() => {
                refreshData();
            }, 30000);
        }
        return () => {
            if (intervalId) {
                console.log("Stopping polling loop");
                clearInterval(intervalId);
            }
        }
    }, [validToken]);

    useEffect(() => {
        if(apiToken) {
            console.log("New token received, validating...");
            validateApiToken();
        }
    }, [apiToken]);

    const validateApiToken = async () => {
        const input = { "query": "query { currentUser { id } }" };
        fetch("https://api.start.gg/gql/alpha", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify(input),
        })
        .then(async response => {
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Token validated, current user: ${data.data.currentUser.id}`);
            setValidToken(true);
        })
        .catch(error => console.error(`Failed to validate token: ${error.message}`));
    }

    const refreshData = async () => {
        const input = { 
            "query": "query GetSets($phaseId: ID) { phase(id: $phaseId) { id name sets(page: 1, perPage: 3) { nodes { id fullRoundText displayScore } } } }",
            "variables": {
                "phaseId": 1285345,
            }
        };
        fetch("https://api.start.gg/gql/alpha", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify(input),
        })
        .then(async response => {
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return response.json();
        })
        .then(data => {
            console.log(`New data: ${JSON.stringify(data.data)}`);
            setValidToken(true);
        })
        .catch(error => console.error(`Failed to refresh data: ${error.message}`));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidToken(false);
        setApiToken(apiTokenInput);
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
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    )
}

export default LiveConfigPage;