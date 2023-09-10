import { ThemeProvider } from "@mui/material";

import LiveConfig from "../../components/LiveConfig";
import useStartGG from "../../hooks/useStartGG";
import useTwitchTheme from "../../hooks/useTwitchTheme";

const LiveConfigPage: React.FC = () => {
  useStartGG(30000);
  const theme = useTwitchTheme();

  return (
    <ThemeProvider theme={theme}>
      <LiveConfig />
    </ThemeProvider>
  );
};

export default LiveConfigPage;
