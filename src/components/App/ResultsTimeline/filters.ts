export interface Filters {
    upset: boolean;
    seeded: boolean;
}

export const defaultFilters: Filters = {
    upset: false,
    seeded: false
}