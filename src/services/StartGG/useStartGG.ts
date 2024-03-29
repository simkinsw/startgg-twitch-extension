import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { type SetData, setSets } from "../../redux/data";
import { type RootState, store } from "../../redux/LiveConfig/store";
import { setLastUpdate } from "../../redux/LiveConfig/app";
import { getSets } from "@services/StartGG";
import {
  type StatusState,
  setError,
  setStartedTimeStamp,
  setSuccess,
} from "../../redux/status";

const useStartGG = (refreshIntervalMs: number): StatusState => {
  const dispatch = useDispatch();

  const apiToken = useSelector((state: RootState) => state.app.apiToken);
  const eventId: string | undefined = useSelector(
    (state: RootState) => state.data.startGGEvent?.id,
  );

  let timeoutId: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (eventId === undefined || apiToken === "") {
      // Missing required inputs
      return;
    }

    const refreshData = async (): Promise<void> => {
      // Add a 2 minute buffer to favor duplicates over missing data (completedAt vs updatedAfter is a little inconsistent)
      try {
        const queryTime = Math.floor(Date.now() / 1000) - 120;
        dispatch(setStartedTimeStamp());
        const results: SetData[] = await getSets(
          apiToken,
          eventId,
          store.getState().app.lastUpdate,
        );

        dispatch(setSuccess(true));
        dispatch(setLastUpdate(queryTime));

        // Slowly add results to store to avoid exceeding PubSub limits
        if (results.length > 0) {
          const batchSize = 100;
          const delayMs = 1000;
          let i = 0;
          while (i < results.length) {
            const batch: SetData[] = results.slice(i, i + batchSize);
            dispatch(setSets(batch));
            i += batchSize;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
      } catch (error) {
        dispatch(setError(error as string));
      }

      // Kick off another refresh after a brief sleep
      timeoutId = setTimeout(() => {
        void refreshData();
      }, refreshIntervalMs);
    };

    void refreshData();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [apiToken, eventId]);

  return useSelector((state: RootState) => state.status);
};

export default useStartGG;
