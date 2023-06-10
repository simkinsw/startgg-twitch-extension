import { SetData, Sets } from "../redux/data";
import { StartGGEvent } from "../types/StartGGEvent";

export interface Query {
    query: string;
    variables?: object;
}

export class Startgg {
    static api = "https://api.start.gg/gql/alpha";

    public static async query<T>(apiToken: string, query: Query): Promise<T> {
        return this.queryWithRetry(apiToken, query, 30000, 3);
    }

    static async queryWithRetry<T>(apiToken: string, query: Query, delay: number, retries: number): Promise<T> {
        const response = await fetch(this.api, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify(query),
        });

        if (response.status === 429 && retries > 0) {
            // Sleep for a bit
            await (new Promise(resolve => setTimeout(resolve, delay)));
            return this.queryWithRetry(apiToken, query, delay, retries - 1);
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return response.json();

    }

    static async validateToken(token: string) {
        const input: Query = { 
            query: "query GetSets($phaseId: ID) { phase(id: $phaseId) { id name sets(page: 1, perPage: 3) { nodes { id fullRoundText displayScore } } } }",
            variables: {
                phaseId: 1285345,
            }
        };

        try {
            await this.query(token, input);
            return true;
        } catch (err) {
            return false;
        }
    }

    //https://www.start.gg/tournament/midlane-melee-80/event/melee-singles
    static async getEvent(apiToken: string, url: string) {
        try {
            const index = url.indexOf("tournament");
            const slug = url.slice(index);

            const input: Query = {
                query: "query GetEventID($slug: String) { event(slug: $slug) { id, name, tournament { name, images { type, url } } entrants(query: {page: 1, perPage: 1}) { pageInfo { totalPages } } } }",
                variables: { slug }
            };

            const response = await this.query(apiToken, input) as any;
            const imageUrl = response.data.event.tournament.images.find((image: any) => image.type === "profile").url

            return {
                tournament: response.data.event.tournament.name,
                event: response.data.event.name,
                id: response.data.event.id,
                entrantCount: response.data.event.entrants.pageInfo.totalPages,
                imageUrl: imageUrl,
                startggUrl: url
            } as StartGGEvent;
        } catch {
            return undefined;
        }
    }

    static async getSets(apiToken: string, eventId: number, lastUpdate: number): Promise<Sets> {
        const input = (page: number): Query => {
            return {
                "query": `query { event(id: ${eventId}) { id name sets(page: ${page}, perPage: 25, filters: { state: [3], updatedAfter: ${lastUpdate} }) { pageInfo { total totalPages page perPage sortBy filter } nodes { id completedAt fullRoundText state slots { entrant { initialSeedNum name } standing { stats { score { value } } } } phaseGroup { phase { name phaseOrder } bracketUrl } } } } } `,
            }
        }

        var results: Sets = {}
        try {
            // Add a 2 minute buffer to favor duplicates over missing data (completedAt vs updatedAfter is a little inconsistent)
            var page = 1;
            var pages = 0;
            do {
                if (pages == 0) {
                    console.log(`Refreshing data`);
                } else {
                    console.log(`Getting page ${page}/${pages}`);
                }
                const response: SetResponse = await Startgg.query(apiToken, input(page));
                pages = response.data.event.sets.pageInfo.totalPages;
                response.data.event.sets.nodes.forEach((set) => {
                    const converted: SetData = convertSet(set);

                    if (converted) {
                        results[set.id] = converted;
                    }
                })
                page += 1;
            } while (page <= pages);
        } catch (error) {
            console.error(`Failed to refresh data: ${error}`);
        }
        return results;
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