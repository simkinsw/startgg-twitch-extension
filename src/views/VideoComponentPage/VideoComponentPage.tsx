import { ThemeProvider } from "@mui/material";

import VideoComponent from "../../components/VideoComponent";
import { useTwitchData, useTwitchTheme } from "@services/Twitch";

const VideoComponentPage: React.FC = () => {
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

export default VideoComponentPage;
