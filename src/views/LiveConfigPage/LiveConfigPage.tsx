import { Box, ThemeProvider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import LiveConfig from "../../components/LiveConfig";
import { darkTheme } from "../../mui-theme";
import { Startgg } from "../../utils/startGG";
import { SetData, Sets, setSets } from "../../redux/data";
import { RootState, store } from "../../redux/LiveConfig/store";
import { setLastUpdate } from "../../redux/LiveConfig/app";

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

    const token = useSelector((state: RootState) => state.app.apiToken);
    const eventId = useSelector((state: RootState) => state.data.startGGEvent.id);
    const sets = useSelector((state: RootState) => state.data.sets);

    const refreshInterval = 30000;
    var timeoutId: ReturnType<typeof setTimeout>;

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

        const refreshData = async () => {
            // Event ID not available yet
            if (eventId < 0 || !token) {
                return;
            }

            const input = (page: number, lastUpdate: number): Query => { 
                return {
                    "query": `query Query($eId: ID) { event(id: $eId) { id name sets(page: ${page}, perPage: 25, filters: { state: [3], updatedAfter: ${lastUpdate} }) { pageInfo { total totalPages page perPage sortBy filter } nodes { id completedAt fullRoundText state slots { entrant { initialSeedNum name } standing { stats { score { value } } } } phaseGroup { phase { name phaseOrder } bracketUrl } } } } } `,
                    "variables": {
                        "eId": eventId,
                    }
                }
            };
            try {
                // Add a 2 minute buffer to favor duplicates over missing data (completedAt vs updatedAfter is a little inconsistent)
                const time = Math.floor(Date.now() / 1000) - 120;
                var page = 1;
                var pages = 0;
                var results: Sets = {}
                do {
                    if (pages == 0) {
                        console.log(`Refreshing data`);
                    } else {
                        console.log(`Getting page ${page}/${pages}`);
                    }
                    const response: SetResponse = await Startgg.query(token, input(page, store.getState().app.lastUpdate));
                    pages = response.data.event.sets.pageInfo.totalPages;
                    response.data.event.sets.nodes.forEach((set) => {
                        const converted: SetData = convertSet(set);

                        if (converted) {
                            results[set.id] = converted;
                        }
                    })
                    page += 1;
                } while (page <= pages);

                // Update internal storage of sets
                updateReduxStore(time, results);
            } catch (error) {
                console.error(`Failed to refresh data: ${error}`);
            }

            timeoutId = setTimeout(refreshData, refreshInterval);
        }

        if(!!token) {
            refreshData();
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }, [eventId, token]);

    return (
        <ThemeProvider theme={darkTheme}>
            <LiveConfig />

            <Box sx={{ minHeight: "21rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {eventId && token && sets ? (
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
