import { ThemeProvider } from "@mui/material";
import Config from "../../components/Config";
import useTwitchTheme from "../../hooks/useTwitchTheme";

const ConfigPage: React.FC = () => {
  const theme = useTwitchTheme();

  return (
    <ThemeProvider theme={theme}>
      <Config />
    </ThemeProvider>
  );
};

export default ConfigPage;
