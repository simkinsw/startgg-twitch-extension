// TODO: get/set initial data
// TODO: get/set updates
// TODO: publish updates
// TODO: use updatedAfter: Timestamp filter for updates 
import { useEffect, useState } from "react";
import LiveConfig from "../../components/LiveConfig";
import { darkTheme } from "../../mui-theme";
import { ThemeProvider } from "@mui/material";

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

const LiveConfigPage = () => {
    const [theme, setTheme] = useState("light");

    const twitch = window.Twitch?.ext;

    useEffect(() => {
        if (twitch) {
            twitch.listen("broadcast", (target, contentType, body) => {
                twitch.rig.log(
                    `New PubSub message!\n${target}\n${contentType}\n${body}`
                );
            });

            twitch.onContext((context, delta) => {
                if (delta.includes("theme")) {
                    setTheme(context.theme ?? "light");
                }
            });
        }

        return () => {
            if (twitch) {
                twitch.unlisten("broadcast", () =>
                    console.log("successfully unlistened")
                );
            }
        };
    }, [twitch]);

    //useEffect(() => {
    //    const refreshData = async () => {
    //        // Event ID not available yet
    //        if (eventId <= 0) {
    //            return;
    //        }

    //        const input = (page: number): Query => { 
    //            return {
    //                "query": `query Query($eId: ID) { event(id: $eId) { id name sets(page: ${page}, perPage: 50, sortType: CALL_ORDER, filters: {state: [3]}) { pageInfo { total totalPages page perPage sortBy filter } nodes { id state slots { entrant { initialSeedNum name } standing { stats { score { value } } } } } } } } `,
    //                "variables": {
    //                    "eId": eventId,
    //                }
    //            }
    //        };
    //        setValidData(Validation.Validating);
    //        try {
    //            var page = 1;
    //            var pages = 0;
    //            var results: {[key: number]: object} = {}
    //            do {
    //                console.log(`Getting ${page}/${pages}`);
    //                const response = await Startgg.query(apiToken, input(page));
    //                var setResponse: SetResponse = JSON.parse(JSON.stringify(response));
    //                pages = setResponse.data.event.sets.pageInfo.totalPages;
    //                setResponse.data.event.sets.nodes.forEach((set) => {
    //                    results[set.id] = convertSet(set);
    //                })
    //                page += 1;
    //            } while (page <= 4 && page <= pages);
    //            const zipped = buffer.Buffer.from(pako.gzip(JSON.stringify(results)).buffer).toString('base64');
    //            console.log(zipped);
    //            const unzipped = JSON.parse(pako.inflate(buffer.Buffer.from(zipped, 'base64'), { to: 'string'}));
    //            setData(unzipped);
    //            setValidData(Validation.Valid);
    
    //            // Update config for new clients, and publish to pubsub for existing ones
    //            //twitch.configuration.set("broadcaster", "1", JSON.stringify(response.data));
    //            //twitch.send("broadcast", "text/plain", JSON.stringify(response.data));
    //        } catch (error) {
    //            console.error(`Failed to refresh data: ${error}`);
    //            setValidData(Validation.Invalid);
    //        }
    //    }

    //    let intervalId: ReturnType<typeof setInterval>;
    //    if(apiToken.length > 0) {
    //        refreshData();
    //        intervalId = setInterval(() => {
    //            refreshData();
    //        }, 30000);
    //    }
    //    return () => {
    //        if (intervalId) {
    //            clearInterval(intervalId);
    //        }
    //    }
    //}, [apiToken, eventId, twitch]);

    return (
        <ThemeProvider theme={darkTheme}>
            <LiveConfig />
        </ThemeProvider>
    );
};

export default LiveConfigPage;
