import { useEffect, useState } from "react";

const LiveConfigPage = () => {
    //fix this to work with tailwind
    const [theme, setTheme] = useState("light");
    const [apiToken, setApiToken] = useState('');
    const [apiTokenInput, setApiTokenInput] = useState('');
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
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then(data => console.log(`Token validated, current user: ${data.data.currentUser.id}`))
        .catch(error => console.error(`Failed to validate token: ${error.message}`));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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