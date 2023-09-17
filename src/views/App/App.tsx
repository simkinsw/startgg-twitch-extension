import { ThemeProvider } from "@mui/material";

import VideoComponent from "../../components/App/VideoComponent";
import { useTwitchData, useTwitchTheme } from "@services/Twitch";

const App: React.FC = () => {
  const theme = useTwitchTheme();
  useTwitchData();

  return (
    <ThemeProvider theme={theme}>
      <div style={{ maxWidth: "1024px", maxHeight: "1152px" }}>
        <VideoComponent />
      </div>
    </ThemeProvider>
  );
};

export default App;
