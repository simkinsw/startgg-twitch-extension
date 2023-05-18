import Buffer from "buffer";
import Pako from "pako";
import { Box, ThemeProvider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import LiveConfig from "../../components/LiveConfig";
import { darkTheme } from "../../mui-theme";
import { Startgg } from "../../utils/startGG";
import { SetData, Sets, setSets } from "../../redux/data";
import { RootState, store } from "../../redux/store";
import { setLastUpdate } from "../../redux/app";

//TODO: move this to ./types
interface Query {
    query: string;
    variables: object;
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

interface Set {
    id: number,
    completedAt: number,
    fullRoundText: string,
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
    phaseGroup: {
        phase: {
            name: string,
            phaseOrder: number,
        }
        bracketUrl: string,
    }
}

const convertSet = (set: Set): SetData => { 
    var winner = 0;
    var loser = 1;
    if (set.slots[0].standing.stats.score.value < set.slots[1].standing.stats.score.value) {
        winner = 1;
        loser = 0;
    }
    
    // TODO: Handle byes

    return {
        winnerName:  set.slots[winner].entrant.name,
        winnerSeed:  set.slots[winner].entrant.initialSeedNum,
        winnerGames: set.slots[winner].standing.stats.score.value,
        loserName: set.slots[loser].entrant.name,
        loserSeed: set.slots[loser].entrant.initialSeedNum,
        loserGames: set.slots[loser].standing.stats.score.value, 
        roundName: set.fullRoundText,
        phaseName: set.phaseGroup.phase.name,
        url: set.phaseGroup.bracketUrl,
        // Somewhat hacky but cheap ordering
        order: set.phaseGroup.phase.phaseOrder * set.completedAt,
    }
}

const LiveConfigPage = () => {
    const [theme, setTheme] = useState("light");
    const twitch = window.Twitch?.ext;

    const dispatch = useDispatch();

    const event = useSelector((state: RootState) => state.app.event);
    const token = useSelector((state: RootState) => state.app.apiToken);
    const sets = useSelector((state: RootState) => state.data.sets);

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
        const updateReduxStore = (time: number, results: Sets) => {
            dispatch(setLastUpdate(time));
            dispatch(setSets(results));
        }

        const updateConfigStore = () => {
            const config =  { ...store.getState().data };

            // Grab the top 100 sets based on the "order" field, populated at query time
            config.sets = Object.fromEntries(Object.entries(config.sets).sort((a, b) => b[1].order - a[1].order).slice(0,100));

            const zipped = Buffer.Buffer.from(Pako.gzip(JSON.stringify(config)).buffer).toString('base64');
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

            const input = (page: number, lastUpdate: number): Query => { 
                return {
                    "query": `query Query($eId: ID) { event(id: $eId) { id name sets(page: ${page}, perPage: 25, filters: { state: [3], updatedAfter: ${lastUpdate} }) { pageInfo { total totalPages page perPage sortBy filter } nodes { id completedAt fullRoundText state slots { entrant { initialSeedNum name } standing { stats { score { value } } } } phaseGroup { phase { name phaseOrder } bracketUrl } } } } } `,
                    "variables": {
                        "eId": event.id,
                    }
                }
            };
            try {
                const time = Math.floor(Date.now() / 1000);
                var page = 1;
                var pages = 0;
                var results: Sets = {}
                do {
                    console.log(`Getting ${page}/${pages}`);
                    const response: SetResponse = await Startgg.query(token, input(page, store.getState().app.lastUpdate));
                    pages = response.data.event.sets.pageInfo.totalPages;
                    response.data.event.sets.nodes.forEach((set) => {
                        results[set.id] = convertSet(set);
                    })
                    page += 1;
                } while (page <= pages && page < 20); //TODO is this right?

                // Update internal storage of sets
                updateReduxStore(time, results);
                // Update base data for new viewers
                updateConfigStore();
                // Publish new sets for existing viewers
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
                {event && token && sets ? (
                    <Typography color="primary.light">
                        Doing stuff:
                        {JSON.stringify(sets, null, 2)}
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
