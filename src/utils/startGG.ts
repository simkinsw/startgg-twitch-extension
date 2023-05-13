import { StartGGEvent } from "../types/StartGGEvent";

interface Query {
    query: string;
    variables?: object;
}

interface ApiResponse {
    data: object;
}

export class Startgg {
    static api = "https://api.start.gg/gql/alpha";

    public static async query<T>(apiToken: string, query: Query): Promise<T> {
        const response = await fetch(this.api, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify(query),
        });

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
                query: "query GetEventID($slug: String) { event(slug: $slug) { id, name, tournament { name } } }",
                variables: { slug }
            };

            const response = await this.query(apiToken, input) as any;

            return {
                tournament: response.data.event.tournament.name,
                name: response.data.event.name,
                id: response.data.event.id
            } as StartGGEvent;
        } catch {
            return undefined;
        }
    }
}

