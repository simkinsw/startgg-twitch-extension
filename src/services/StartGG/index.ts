import { type SetData } from "../../redux/data";
import {
  type CurrentUserQuery,
  type CurrentUserQueryVariables,
  type GetEventQuery,
  type GetEventQueryVariables,
  type GetSetsQuery,
  type GetSetsQueryVariables,
} from "./gql/types-and-hooks";
import { gql } from "graphql-request";
export { default as useStartGG } from "./useStartGG";

interface Query<T> {
  query: string;
  variables: T;
}

interface Data<T> {
  data: T;
}

export interface StartGGEvent {
  id: string;
  event: string;
  tournament: string;
  entrantCount: number;
  imageUrl: string;
  startggUrl: string;
}

const api = "https://api.start.gg/gql/alpha";

export const query = async <T, Q>(
  apiToken: string,
  query: Query<Q>,
): Promise<Data<T>> => {
  return await queryWithRetry(apiToken, query, 30000, 3);
};

export const queryWithRetry = async <T, Q>(
  apiToken: string,
  query: Query<Q>,
  delay: number,
  retries: number,
): Promise<Data<T>> => {
  const response = await fetch(api, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(query),
  });

  if (response.status === 429 && retries > 0) {
    // Sleep for a bit
    await new Promise((resolve) => setTimeout(resolve, delay));
    return await queryWithRetry(apiToken, query, delay, retries - 1);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

export const validateToken = async (token: string): Promise<boolean> => {
  const input: Query<CurrentUserQueryVariables> = {
    query: gql`
      query CurrentUser {
        currentUser {
          id
        }
      }
    `,
    variables: {},
  };

  try {
    // If dummy query processes successfully, token is valid
    await query<CurrentUserQuery, CurrentUserQueryVariables>(token, input);
    return true;
  } catch (err) {
    return false;
  }
};

// https://www.start.gg/tournament/midlane-melee-80/event/melee-singles
export const getEvent = async (
  apiToken: string,
  url: string,
): Promise<StartGGEvent | undefined> => {
  try {
    // TODO: I have the feeling that this could be improved...
    const index = url.indexOf("tournament");
    let slug = url.slice(index);
    slug = slug.split("/").slice(0, 4).join("/");

    console.log(slug);

    const input: Query<GetEventQueryVariables> = {
      query: gql`
        query GetEvent($slug: String) {
          event(slug: $slug) {
            id
            name
            tournament {
              name
              images {
                type
                url
              }
            }
            entrants(query: { page: 1, perPage: 1 }) {
              pageInfo {
                totalPages
              }
            }
          }
        }
      `,
      variables: { slug },
    };

    const response = await query<
      DeepNonNullable<GetEventQuery>,
      GetEventQueryVariables
    >(apiToken, input);

    const imageUrl =
      response.data.event.tournament.images.find(
        (image: any) => image.type === "profile",
      )?.url ?? "";

    return {
      tournament: response.data.event.tournament.name,
      event: response.data.event.name,
      id: response.data.event.id,
      entrantCount: response.data.event.entrants.pageInfo.totalPages,
      imageUrl,
      startggUrl: url,
    } satisfies StartGGEvent;
  } catch (error) {
    console.error("Error while fetching event:", error);
    return undefined;
  }
};

export const getSets = async (
  apiToken: string,
  eventId: string,
  lastUpdate: number,
): Promise<SetData[]> => {
  const queryString = gql`
    query GetSets($eventId: ID!, $page: Int!, $lastUpdate: Timestamp!) {
      event(id: $eventId) {
        id
        name
        sets(
          page: $page
          perPage: 25
          filters: { state: [3], updatedAfter: $lastUpdate }
        ) {
          pageInfo {
            total
            totalPages
            page
            perPage
            sortBy
            filter
          }
          nodes {
            id
            completedAt
            fullRoundText
            state
            slots {
              entrant {
                initialSeedNum
                name
              }
              standing {
                stats {
                  score {
                    value
                  }
                }
              }
            }
            round
            phaseGroup {
              phase {
                name
                phaseOrder
              }
              bracketUrl
            }
          }
        }
      }
    }
  `;
  const results: SetData[] = [];
  try {
    // Add a 2 minute buffer to favor duplicates over missing data (completedAt vs updatedAfter is a little inconsistent)
    let page = 1;
    let pages = 0;
    do {
      if (pages === 0) {
        console.log(`Refreshing data`);
      } else {
        console.log(`Getting page ${page}/${pages}`);
      }

      const input: Query<GetSetsQueryVariables> = {
        query: queryString,
        variables: {
          eventId,
          lastUpdate,
          page,
        },
      };

      const response = await query<
        DeepNonNullable<GetSetsQuery>,
        GetSetsQueryVariables
      >(apiToken, input);
      pages = response.data.event.sets.pageInfo.totalPages;
      response.data.event.sets.nodes.forEach((set) => {
        const converted: SetData = convertSet(set);

        results.push(converted);
      });
      page += 1;
    } while (page <= pages);
  } catch (error) {
    console.error(`Failed to refresh data: ${error as string}`);
  }
  return results;
};

type SetType = DeepNonNullable<GetSetsQuery>["event"]["sets"]["nodes"][number];
const convertSet = (set: SetType): SetData => {
  let winner = 0;
  let loser = 1;
  if (
    set.slots[0].standing.stats.score.value <
    set.slots[1].standing.stats.score.value
  ) {
    winner = 1;
    loser = 0;
  }

  // Build a number to sort sets
  // (phase) + (3 digits round) + (12 digits seconds since epoch)
  // ex. (4)(012)(001234567890)
  // round logic follow below ordering pattern:
  // 1/-3 < -4 < 2/-5 < -6 < 3/-7 < -8 < 4/-9 < -10 < 5...
  const sortPhaseOrder = set.phaseGroup.phase.phaseOrder * 1e15;
  const sortRound = (set.round > 0 ? set.round : (set.round + 1) / -2) * 1e12;
  const sortOrder = sortPhaseOrder + sortRound + set.completedAt;

  return {
    id: set.id,
    winnerName: set.slots[winner].entrant.name,
    winnerSeed: set.slots[winner].entrant.initialSeedNum,
    winnerGames: set.slots[winner].standing.stats.score.value,
    loserName: set.slots[loser].entrant.name,
    loserSeed: set.slots[loser].entrant.initialSeedNum,
    loserGames: set.slots[loser].standing.stats.score.value,
    roundName: set.fullRoundText,
    phaseName: set.phaseGroup.phase.name,
    url: set.phaseGroup.bracketUrl,
    order: sortOrder,
  };
};

// StartGG's GraphQL schema does not include any enforcement of fields being non-null.
// This causes the result of the code gen to be 'type | null' for every field (see types-and-hooks.ts)
// This utility type removes all those nulls.
// It's a bit aggressive, but we won't know how to handle errors until we see a real example where it fails
type DeepNonNullable<T> =
  // Array case
  T extends Array<infer U>
    ? Array<DeepNonNullable<U>>
    : // Object case
    T extends object
    ? { [K in keyof T]: DeepNonNullable<T[K]> }
    : // Primitive case
      NonNullable<T>;
