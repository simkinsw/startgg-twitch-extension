import { useState } from "react";
import { Startgg } from "../../../utils/startGG";

enum Validation {
    Empty = '',
    Validating = '?',
    Valid = '\u{2705}',
    Invalid = '\u{274c}',
}

type StartggTokenProps = {
    onApiToken: (token: string) => void,
};

const StartggToken = ({
    onApiToken
}: StartggTokenProps) => {
    const [apiTokenInput, setApiTokenInput] = useState('');
    const [validToken, setValidToken] = useState(Validation.Empty);

    const validateApiToken = async (token: string) => {
        const input = { "query": "query { currentUser { id } }" };
        setValidToken(Validation.Validating);
        try {
            await Startgg.query(token, input);
            onApiToken(token);
            setValidToken(Validation.Valid);
        } catch (error) {
            setValidToken(Validation.Invalid)
            onApiToken('');
            console.error(`Failed to validate token: ${error}`);
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
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter your startgg api token:
                    <input type="password" value={apiTokenInput} onChange={handleApiTokenInputChange}/>
                </label>
                <br></br>
                <button type="submit">Save</button>
                {validToken}
            </form>
        </div>
    )
}



export { StartggToken };