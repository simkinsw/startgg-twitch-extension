import { ThemeProvider } from "@mui/material";

import LiveConfig from "../../components/LiveConfig";
import { darkTheme } from "../../mui-theme";
import useStartGG from "../../hooks/useStartGG";

const LiveConfigPage: React.FC = () => {
  useStartGG(30000);

  return (
    <ThemeProvider theme={darkTheme}>
      <LiveConfig />
    </ThemeProvider>
  );
};

export default LiveConfigPage;
