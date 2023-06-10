export type StartGGEvent = {
    id: number,
    event: string,
    tournament: string,
    entrantCount: number,
    imageUrl: string,
    startggUrl: string
}

export const emptyStartGGEvent = {
    id: -1,
    event: "",
    tournament: "",
    entrantCount: 0,
    imageUrl: "",
    startggUrl: "",
}