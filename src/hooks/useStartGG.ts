import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { Startgg } from "../utils/startGG";
import { Sets, setSets } from "../redux/data";
import { RootState, store } from "../redux/LiveConfig/store";
import { setLastUpdate } from "../redux/LiveConfig/app";

const useStartGG = (refreshIntervalMs: number) => {
    const dispatch = useDispatch();

    const apiToken = useSelector((state: RootState) => state.app.apiToken);
    const eventId = useSelector((state: RootState) => state.data.startGGEvent.id);

    var timeoutId: ReturnType<typeof setTimeout>;

    useEffect(() => {
        if (eventId < 0 || !apiToken) {
            // Missing required inputs
            return;
        }

        const refreshData = async () => {
            // Add a 2 minute buffer to favor duplicates over missing data (completedAt vs updatedAfter is a little inconsistent)
            const queryTime = Math.floor(Date.now() / 1000) - 120;
            const results: Sets = await Startgg.getSets(apiToken, eventId, store.getState().app.lastUpdate);
            if (Object.keys(results).length !== 0) {
                dispatch(setSets(results));
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