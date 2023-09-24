import { ThemeProvider } from "@mui/material";

import LiveConfig from "../../components/LiveConfig";
import { useTwitchTheme } from "@services/Twitch";

const LiveConfigPage: React.FC = () => {
  const theme = useTwitchTheme();

  return (
    <ThemeProvider theme={theme}>
      <LiveConfig />
    </ThemeProvider>
  );
};

export default LiveConfigPage;
