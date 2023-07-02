export interface Filters {
    upset: boolean;
    seeded: boolean;
    phase: string;
    search: string;
}

export const defaultFilters: Filters = {
    upset: false,
    seeded: false,
    phase: "All Phases",
    search: ""
}