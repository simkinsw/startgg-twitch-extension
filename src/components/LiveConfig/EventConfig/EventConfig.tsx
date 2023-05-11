import { Button, TextField, Typography } from "@mui/material";
import { theme } from "../../../mui-theme";
import { makeStyles } from "@material-ui/core";
import { useState } from "react";
import { Startgg } from "../../../utils/startGG";
import { StartGGEvent } from "../../../types/StartGGEvent";
import { setEvent } from "../../../redux/store";
import { useDispatch } from "react-redux";


const useStyles = makeStyles((theme) => ({
    form: {
        display: "flex",
        alignItems: "start",
        gap: theme.spacing(1),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(5),
        height: "4.8rem"
    },
    input: {
        marginBottom: theme.spacing(2),
        flex: "1",
        padding: theme.spacing(1)
    },
    button: {
        height: "7.2rem",
        width: "13rem"
    },
}));

interface EventConfigProps {
    event: StartGGEvent | null;
    token: string;
}

const EventConfig: React.FC<EventConfigProps> = ({ event, token }) => {
    const classes = useStyles(theme);
    const [url, setUrl] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const ggEvent = await Startgg.getEvent(token, url!);
            if (ggEvent) {
                dispatch(setEvent(ggEvent));
            } else {
                setError("Invalid URL");
            }
        } catch (error) {
            setError("Invalid URL");
        }
        setUrl("");
        setLoading(false);
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    return (
        <>
            {
            event ?
                <>
                    <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                        Currently Selected: {event!.tournament!} - {event!.name}
                    </Typography>
                    <br />
                    <Typography>
                        Enter a new start.gg URL below to select a different event.
                    </Typography>
                </>
                :
                token ? 
                    <Typography>
                        Paste the full start.gg link for the event you are streaming.
                        <br/>
                        Make sure your link includes the part after "/event/".
                    </Typography>
                    :
                    <Typography color="secondary.light">
                        You must set your start.gg API token above before you select an event.
                    </Typography>
                
            }
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    id="event-input"
                    label="Event URL"
                    variant="outlined"
                    placeholder="http://start.gg/tournament/genesis-9-1/event/melee-singles"
                    className={classes.input}
                    value={url}
                    onChange={handleUrlChange}
                    error={!!error}
                    helperText={error}
                    disabled={!token}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                    disabled={!url || loading}
                >
                    {loading ? "Selecting..." : "Select"}
                </Button>
            </form>
        </>
    );
};

export default EventConfig;
