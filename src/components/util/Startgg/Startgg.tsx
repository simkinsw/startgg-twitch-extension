interface Query {
    query: string;
    variables?: object;
}

interface ApiResponse {
    data: object;
}

class Startgg {
    static api = "https://api.start.gg/gql/alpha";

    public static async query(apiToken: string, query: Query): Promise<ApiResponse> {
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
}

export { Startgg };