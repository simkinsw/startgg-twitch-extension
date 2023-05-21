import { Box, Button, TextField, Typography } from "@mui/material";
import { theme } from "../../../mui-theme";
import { useState } from "react";
import { Startgg } from "../../../utils/startGG";
import { StartGGEvent } from "../../../types/StartGGEvent";
import { useDispatch } from "react-redux";
import { setStartGGEvent } from "../../../redux/data";

interface EventConfigProps {
    event?: StartGGEvent;
    token: string;
}

const EventConfig: React.FC<EventConfigProps> = ({ event, token }) => {
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
                dispatch(setStartGGEvent(ggEvent));
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
        <Box sx={{ minHeight: "21rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {event ? (
                <Box>
                    <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                        Currently Selected: {event!.tournament!} - {event!.event}
                    </Typography>
                    <br />
                    <Typography>
                        Enter a new start.gg URL below to select a different
                        event.
                    </Typography>
                </Box>
            ) : token ? (
                <Typography>
                    Paste the full start.gg link for the event you are
                    streaming.
                    <br />
                    Make sure your link includes the part after "/event/".
                </Typography>
            ) : (
                <Typography color="secondary.light">
                    You must set your start.gg API token before selecting an
                    event.
                </Typography>
            )}
            <form
                style={{
                    display: "flex",
                    gap: theme.spacing(1),
                    marginTop: theme.spacing(3),
                    marginBottom: theme.spacing(5),
                    height: "4.8rem",
                }}
                onSubmit={handleSubmit}
            >
                <TextField
                    id="event-input"
                    label="Event URL"
                    variant="outlined"
                    placeholder="http://start.gg/tournament/genesis-9-1/event/melee-singles"
                    sx={{ flex: "1" }}
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
                    sx={{
                        height: "7.2rem",
                        width: "13rem",
                    }}
                    disabled={!url || loading}
                >
                    {loading ? "Selecting..." : "Select"}
                </Button>
            </form>
        </Box>
    );
};

export default EventConfig;
