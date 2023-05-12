import { Box, Button, TextField, Typography } from "@mui/material";
import { theme } from "../../../mui-theme";
import { useEffect, useState } from "react";
import { Startgg } from "../../../utils/startGG";
import { StartGGEvent } from "../../../types/StartGGEvent";
import { setEvent } from "../../../redux/store";
import { useDispatch } from "react-redux";

import pako from 'pako';
import buffer from 'buffer';

interface SmallSet {
    state: number,
    winnerName: string,
    winnerSeed: number,
    winnerGames: number,
    loserName: string,
    loserSeed: number,
    loserGames: number,
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

const convertSet = (set: Set): SmallSet => { 
    return {
        state: set.state,
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

interface SetStreamProps {
    event: StartGGEvent | null;
    token: string;
}

interface Query {
    query: string;
    variables: object;
}

const SetStream: React.FC<SetStreamProps> = ({event, token}) => {

    const [data, setData] = useState("");

    useEffect(() => {
        const refreshData = async () => {
            // Event ID not available yet
            if (!event) {
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
                var results: {[key: number]: object} = {}
                do {
                    console.log(`Getting ${page}/${pages}`);
                    const response = await Startgg.query(token, input(page));
                    var setResponse: SetResponse = JSON.parse(JSON.stringify(response));
                    pages = setResponse.data.event.sets.pageInfo.totalPages;
                    setResponse.data.event.sets.nodes.forEach((set) => {
                        results[set.id] = convertSet(set);
                    })
                    page += 1;
                } while (page <= 4 && page <= pages);
                const zipped = buffer.Buffer.from(pako.gzip(JSON.stringify(results)).buffer).toString('base64');
                console.log(zipped);
                const unzipped = JSON.parse(pako.inflate(buffer.Buffer.from(zipped, 'base64'), { to: 'string'}));
                setData(unzipped);
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
        <Box sx={{ minHeight: "21rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {event && token ? (
                <Box>
                    <Typography>
                        Doing stuff:
                        {JSON.stringify(data, 2)}
                    </Typography>
                </Box>
            ) : (
                <Typography color="secondary.light">
                    Waiting for configs
                </Typography>
            )}
        </Box>
    );
};

export default SetStream;
