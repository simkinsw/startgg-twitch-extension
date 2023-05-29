import { useSelector } from "react-redux";
import { RootState } from "../../../redux/VideoComponent/store";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { defaultFilters } from "./filters";
import SetBox from "../SetBox";
import FilterMenu from "../FilterMenu";

//TODO: this is too much in one place
const ResultsTimeline = () => {
    const sets = useSelector((state: RootState) => state.data.sets);
    const [filters, setFilters] = useState(defaultFilters);
    const phases = Array.from(new Set(Object.entries(sets).map(set => set[1].phaseName)));
    const getSetData = () => {
        let tempSets = Object.entries(sets)
            .map((set) => set[1])
            .reverse()
            .slice();
        if (filters.upset) {
            tempSets = tempSets.filter(
                (set) => set.winnerSeed > set.loserSeed
            );
        }
        if (filters.seeded) {
            //TODO: what's the cutoff for seeding?
            tempSets = tempSets.filter(
                (set) => set.winnerSeed <= 16 || set.loserSeed <= 16
            );
        }
        if (filters.phase !== "All Phases") {
            tempSets = tempSets.filter(
                (set) => set.phaseName === filters.phase
            );
        }
        return tempSets;
    }
    const setData = getSetData();

    return (
        <Box sx={{ overflow: "auto" }}>
            <FilterMenu phases={phases} filters={filters} setFilters={setFilters} />
            <Box
                sx={{
                    display: "grid",
                    margin: "2rem",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: "6rem",
                    rowGap: "6rem",
                    maxHeight: "100%",
                    overflow: "auto",
                    paddingBottom: "1rem"
                }}
            >
                {setData.map((set) => (
                    <SetBox
                        set={set}
                        key={set.winnerName + set.loserName + set.roundName}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ResultsTimeline;
