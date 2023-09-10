import { ThemeProvider } from "@mui/material";
import { theme as muiTheme } from "../../mui-theme";
import Config from "../../components/Config";

const ConfigPage: React.FC = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <Config />
    </ThemeProvider>
  );
};

export default ConfigPage;
