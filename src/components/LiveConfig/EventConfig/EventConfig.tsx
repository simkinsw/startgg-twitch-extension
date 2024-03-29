import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { type StartGGEvent, getEvent } from "@services/StartGG";
import { useDispatch, useSelector } from "react-redux";
import { setStartGGEvent } from "../../../redux/data";
import { setLastUpdate } from "../../../redux/LiveConfig/app";
import { type RootState } from "../../../redux/LiveConfig/store";
import { useTheme } from "@mui/material/styles";

// TODO: Clear errors on new entry
const EventConfig: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  const token = useSelector((state: RootState) => state.app.apiToken);
  const event: StartGGEvent | undefined = useSelector(
    (state: RootState) => state.data.startGGEvent,
  );

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    try {
      const ggEvent = await getEvent(token, url);
      dispatch(setLastUpdate(0));
      dispatch(setStartGGEvent(ggEvent));
    } catch (error) {
      setError(`${error as string}`);
    }
    setUrl("");
    setLoading(false);
  };

  const handleUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setUrl(event.target.value);
  };

  return (
    <Box
      sx={{
        minHeight: "21rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {event?.event !== undefined ? (
        <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            Currently Selected: {event.tournament} - {event.event}
          </Typography>
          <br />
          <Typography>
            Enter a new start.gg URL below to select a different event.
          </Typography>
        </Box>
      ) : token !== "" ? (
        <Typography>
          Paste the full start.gg link for the event you are streaming.
          <br />
          Make sure your link includes the part after &quot;/event/&quot;.
        </Typography>
      ) : (
        <Typography color="secondary.light">
          You must set your start.gg API token before selecting an event.
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
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <TextField
          id="event-input"
          label="Event URL"
          variant="outlined"
          placeholder="http://start.gg/tournament/genesis-9-1/event/melee-singles"
          sx={{ flex: "1" }}
          value={url}
          onChange={handleUrlChange}
          error={error !== ""}
          helperText={error}
          disabled={token === ""}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            height: "7.2rem",
            width: "13rem",
          }}
          disabled={url === "" || loading}
        >
          {loading ? "Selecting..." : "Select"}
        </Button>
      </form>
    </Box>
  );
};

export default EventConfig;
