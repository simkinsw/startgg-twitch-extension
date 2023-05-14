import { useEffect, useState } from "react";
import LiveConfig from "../../components/LiveConfig";
import { darkTheme } from "../../mui-theme";
import { Box, ThemeProvider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Startgg } from "../../utils/startGG";
import { SetData, Sets, setCompletedSets } from "../../redux/data";

import pako from 'pako';
import buffer from 'buffer';
import { RootState } from "../../redux/store";

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
            // this should append
            dispatch(setCompletedSets(results));
        }

        const updateConfigStore = (results: Sets) => {
            if (twitch) {
                //const unzipped = JSON.parse(pako.inflate(buffer.Buffer.from(zipped, 'base64'), { to: 'string'}));
                const zipped = buffer.Buffer.from(pako.gzip(JSON.stringify(results)).buffer).toString('base64');
                // This should be (state + new) filtered for top 150 "interesting" (maybe just latest)
                twitch.configuration.set("broadcaster", "1", zipped);
            }
        }

        const updatePubSub = (results: Sets) => {
            if (twitch) {
                const zipped = buffer.Buffer.from(pako.gzip(JSON.stringify(results)).buffer).toString('base64');
                // this should be only new
                twitch.send("broadcast", "text/plain", zipped);
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
            //intervalId = setInterval(() => {
            //    refreshData();
            //}, 30000);
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
