import { type Theme } from "@mui/material";
import { darkTheme, lightTheme } from "../mui-theme";
import { useEffect, useState } from "react";

const twitch = window.Twitch?.ext;

const useTwitchTheme = (): Theme => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const queryParams = new URLSearchParams(window.location.search);
      setName(queryParams.get("theme") ?? "none");
    } else if (twitch !== undefined) {
      twitch.onContext((context: any, delta: string[]) => {
        if (delta.includes("theme")) {
          setName(context.theme);
        }
      });
    }

    return () => {};
  }, [twitch]);

  return name === "dark" ? darkTheme : lightTheme;
};

export default useTwitchTheme;
