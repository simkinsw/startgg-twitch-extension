import { Box, Typography } from "@mui/material";
import TokenConfig from "./TokenConfig";
import ConfigCard from "./ConfigCard";
import EventConfig from "./EventConfig";
import Admin from "./Admin";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/LiveConfig/store";
import { type StartGGEvent, useStartGG } from "@services/StartGG";

const LiveConfig: React.FC = () => {
  const status = useStartGG(30000);
  const token = useSelector((state: RootState) => state.app.apiToken);
  const event: StartGGEvent | undefined = useSelector(
    (state: RootState) => state.data.startGGEvent,
  );

  const completedTasks = [token !== "", event?.event !== undefined].filter(
    Boolean,
  ).length;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        padding: "3rem",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          maxWidth: "80rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <Box>
          <Typography variant="h5">Configuring QuickStartGG</Typography>
          <Typography variant="subtitle1">
            {completedTasks} of 2 tasks completed
          </Typography>
          <Typography variant="subtitle1">
            NOTE: KEEP THIS WINDOW OPEN
          </Typography>
        </Box>

        <ConfigCard heading="Set API Token" completed={token !== ""}>
          <TokenConfig />
        </ConfigCard>

        <ConfigCard
          heading="Select Event"
          completed={event?.event !== undefined}
        >
          <EventConfig />
        </ConfigCard>

        <ConfigCard
          heading="Set Data"
          completed={status.isSuccess && !status.isError}
        >
          <Typography variant="subtitle1">
            <pre>{JSON.stringify(status, null, 2)}</pre>
          </Typography>
        </ConfigCard>

        {process.env.NODE_ENV === "development" ? (
          <ConfigCard heading="Admin" completed={true}>
            <Admin />
          </ConfigCard>
        ) : null}
      </Box>
    </Box>
  );
};

export default LiveConfig;
