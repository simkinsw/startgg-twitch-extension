import { useDispatch } from "react-redux";
import { type EffectCallback, useEffect } from "react";
import {
  type DataActionObjects,
  type TransferState,
  setSets,
  setStartGGEvent,
} from "../../redux/data";

const twitch = window.Twitch?.ext;

declare global {
  interface Window {
    Twitch?: any;
  }
}

const useTwitchData = (): void => {
  const dispatch = useDispatch();
  const controller = new AbortController();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return useLocalData();
    } else if (twitch !== undefined) {
      return useConfigServiceAndPubsub();
    }

    return () => {};
  }, [dispatch]);

  const handleConfig = async (compressedConfig: string): Promise<void> => {
    try {
      await import("../../utils/compression").then(({ decompress }) => {
        const config: TransferState = decompress(compressedConfig);
        dispatch(setStartGGEvent(config.startGGEvent));
        dispatch(setSets(config.sets));
      });
    } catch (error) {
      console.log("Failed to process initial config");
    }
  };

  const storageEventListener = async (event: StorageEvent): Promise<void> => {
    if (event.storageArea === localStorage && event.key === "message") {
      try {
        await import("../../utils/compression").then(({ decompress }) => {
          if (event.newValue !== null) {
            dispatch(decompress<DataActionObjects>(event.newValue));
          }
        });
      } catch (error) {
        console.log("Failed to handle localStorageEvent");
      }
    }
  };

  const pubsubEventListener = async (
    _target: string,
    _contentType: string,
    body: string,
  ): Promise<void> => {
    try {
      await import("../../utils/compression").then(({ decompress }) => {
        dispatch(decompress<DataActionObjects>(body));
      });
    } catch (error) {
      console.log("Failed to handle pubsub event");
    }
  };

  const useLocalData: EffectCallback = () => {
    // Get initial config from local storage
    const store: string | null = localStorage.getItem("store");
    if (store !== null) {
      void handleConfig(store);
    }

    // Listen for updates in local storage
    window.addEventListener(
      "storage",
      // TODO: test if this is really required or should just be suppressed from linting
      (event) => {
        void storageEventListener(event);
      },
      {
        signal: controller.signal,
      },
    );
    return () => {
      controller.abort();
    };
  };

  const useConfigServiceAndPubsub: EffectCallback = () => {
    // Get initial config from twitch
    twitch.configuration.onChanged(() => {
      void handleConfig(twitch.configuration.broadcaster.content);
    });

    // Listen for updates on twitch pubsub
    twitch.listen("broadcast", pubsubEventListener);

    return () => {
      twitch.unlisten("broadcast", pubsubEventListener);
    };
  };
};

export default useTwitchData;
