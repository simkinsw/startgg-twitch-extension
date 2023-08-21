import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { Startgg } from "../utils/startGG";
import { SetData, setSets } from "../redux/data";
import { RootState, store } from "../redux/LiveConfig/store";
import { setLastUpdate } from "../redux/LiveConfig/app";

const useStartGG = (refreshIntervalMs: number) => {
    const dispatch = useDispatch();

    const apiToken = useSelector((state: RootState) => state.app.apiToken);
    const eventId = useSelector((state: RootState) => state.data.startGGEvent.id);

    var timeoutId: ReturnType<typeof setTimeout>;

    useEffect(() => {
        if (!eventId || !apiToken) {
            // Missing required inputs
            return;
        }

        const refreshData = async () => {
            // Add a 2 minute buffer to favor duplicates over missing data (completedAt vs updatedAfter is a little inconsistent)
            const queryTime = Math.floor(Date.now() / 1000) - 120;
            const results: SetData[] = await Startgg.getSets(apiToken, eventId, store.getState().app.lastUpdate);
            if (results.length > 0) {
                const batchSize = 100;
                const delayMs = 1000;
                let i = 0;
                while (i < results.length) {
                    const batch: SetData[] = results.slice(i, i + batchSize);
                    dispatch(setSets(batch));
                    i += batchSize;
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }

                dispatch(setLastUpdate(queryTime));
            }

            // Kick off another refresh after a brief sleep
            timeoutId = setTimeout(refreshData, refreshIntervalMs);
        }

        refreshData();
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }, [apiToken, eventId])
}

export default useStartGG;