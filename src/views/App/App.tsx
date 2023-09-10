import { ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";

import VideoComponent from "../../components/App/VideoComponent";
import useTwitchData from "../../hooks/useTwitchData";
import { useDispatch } from "react-redux";
import { type TransferState, setSets, setStartGGEvent } from "../../redux/data";
import useTwitchTheme from "../../hooks/useTwitchTheme";

declare global {
  interface Window {
    Twitch?: any;
  }
}

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const twitch = window.Twitch?.ext;
  const theme = useTwitchTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    // NOTE: This is annoying. This logic used to be next to the pubsub code,
    // but twitch.configuration.onChanged wasn't triggering. To be investigated...
    const handleConfig = async (compressedConfig: string): Promise<void> => {
      await import("../../utils/message").then(({ decompress }) => {
        // Get inital config
        const config: TransferState = decompress(compressedConfig);
        dispatch(setStartGGEvent(config.startGGEvent));
        dispatch(setSets(config.sets));
      });
    };
    if (twitch !== undefined) {
      // Get initial config
      twitch.configuration.onChanged(() => {
        void handleConfig(twitch.configuration.broadcaster.content);
      });

      twitch.onVisibilityChanged((isVisible: boolean, _c: any) => {
        setIsVisible(isVisible);
      });
    }

    // Config from localStorage
    if (process.env.NODE_ENV === "development") {
      // Use localStorage as a message bus
      const store: string = localStorage.getItem("store") ?? "";
      if (store !== "") {
        void handleConfig(store);
      }
    }
  }, [dispatch, twitch]);

  useTwitchData();

  return isVisible ? (
    <ThemeProvider theme={theme}>
      <div style={{ maxWidth: "1024px", maxHeight: "1152px" }}>
        <VideoComponent />
      </div>
    </ThemeProvider>
  ) : (
    <div className="App">
      <span className="">You shouldn&apost see this (App is hidden)</span>
    </div>
  );
};

export default App;
