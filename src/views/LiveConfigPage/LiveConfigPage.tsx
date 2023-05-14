import Buffer from "buffer";
import Pako from "pako";
import { Box, ThemeProvider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import LiveConfig from "../../components/LiveConfig";
import { darkTheme } from "../../mui-theme";
import { Startgg } from "../../utils/startGG";
import { SetData, Sets, setCompletedSets } from "../../redux/data";
import { RootState, store } from "../../redux/store";

interface Query {
    query: string;
    variables: object;
}


interface Set {
    id: number,
    state: number,
    slots: [
        {
            entrant: {
                initialSeedNum: number,
                name: string,
            }
            standing: {
                stats: {
                    score: {
                        value: number,
                    }
                }
            }
        }
    ]
}

const convertSet = (set: Set): SetData => { 
    return {
        winnerName:  set.slots[0].entrant.name,
        winnerSeed:  set.slots[0].entrant.initialSeedNum,
        winnerGames: set.slots[0].standing.stats.score.value,
        loserName: set.slots[1].entrant.name,
        loserSeed: set.slots[1].entrant.initialSeedNum,
        loserGames: set.slots[1].standing.stats.score.value, 
    }
}

interface SetResponse {
    data: {
        event: {
            id: number,
            sets: {
                pageInfo: {
                    totalPages: number,
                }
                nodes: [Set]
            }
        }
    }
}

const LiveConfigPage = () => {
    const [theme, setTheme] = useState("light");
    const twitch = window.Twitch?.ext;

    const dispatch = useDispatch();

    const event = useSelector((state: RootState) => state.app.event);
    const token = useSelector((state: RootState) => state.app.apiToken);
    const completedSets = useSelector((state: RootState) => state.data.completedSets);

    useEffect(() => {
        if (twitch) {
            twitch.onContext((context, delta) => {
                if (delta.includes("theme")) {
                    setTheme(context.theme ?? "light");
                }
            });
        }
    }, [twitch]);

    useEffect(() => {
        const updateReduxStore = (results: Sets) => {
            dispatch(setCompletedSets(results));
        }

        // Ignore "results" input, we are going to take directly from the already updated state
        const updateConfigStore = (results: Sets) => {
            // Get "interesting" sets
            const trimmedSets = Object.fromEntries(Object.entries(store.getState().data.completedSets).slice(0, 2));
            const zipped = Buffer.Buffer.from(Pako.gzip(JSON.stringify(trimmedSets)).buffer).toString('base64');
            if (twitch) {
                twitch.configuration.set("broadcaster", "1", zipped);
            }
            if (process.env.NODE_ENV === "development") {
                // Use localStorage as a message bus
                localStorage.setItem("store", zipped);
            }
        }

        const updatePubSub = (results: Sets) => {
            const zipped = Buffer.Buffer.from(Pako.gzip(JSON.stringify(results)).buffer).toString('base64');
            if (twitch) {
                twitch.send("broadcast", "text/plain", zipped);
            }

            if (process.env.NODE_ENV === "development") {
                // Use localStorage as a message bus
                // Force it to reprocess every time
                localStorage.removeItem("message");
                localStorage.setItem("message", zipped);
            }
        }

        const refreshData = async () => {
            // Event ID not available yet
            if (!event || !token) {
                return;
            }

            const input = (page: number): Query => { 
                return {
                    "query": `query Query($eId: ID) { event(id: $eId) { id name sets(page: ${page}, perPage: 50, sortType: CALL_ORDER, filters: {state: [3]}) { pageInfo { total totalPages page perPage sortBy filter } nodes { id state slots { entrant { initialSeedNum name } standing { stats { score { value } } } } } } } } `,
                    "variables": {
                        "eId": event.id,
                    }
                }
            };
            try {
                var page = 1;
                var pages = 0;
                var results: Sets = {}
                do {
                    console.log(`Getting ${page}/${pages}`);
                    const response: SetResponse = await Startgg.query(token, input(page));
                    pages = response.data.event.sets.pageInfo.totalPages;
                    response.data.event.sets.nodes.forEach((set) => {
                        results[set.id] = convertSet(set);
                    })
                    page += 1;
                } while (page <= 4 && page <= pages);
                updateReduxStore(results);
                updateConfigStore(results);
                updatePubSub(results);
            } catch (error) {
                console.error(`Failed to refresh data: ${error}`);
            }
        }

        let intervalId: ReturnType<typeof setInterval>;
        if(!!token) {
            refreshData();
            intervalId = setInterval(() => {
                refreshData();
            }, 30000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [event, token]);

    return (
        <ThemeProvider theme={darkTheme}>
            <LiveConfig />

            <Box sx={{ minHeight: "21rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {event && token && completedSets ? (
                    <Typography color="primary.light">
                        Doing stuff:
                        {JSON.stringify(completedSets, null, 2)}
                    </Typography>
                ) : (
                    <Typography color="primary.light">
                        Waiting for configs
                    </Typography>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default LiveConfigPage;
