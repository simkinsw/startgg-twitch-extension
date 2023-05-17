import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { defaultFilters } from "./filters";
import { SetData } from "../../../redux/data";
import SetBox from "../SetBox";
import FilterMenu from "../FilterMenu";

//TODO: this is too much in one place
const ResultsTimeline = () => {
    const sets = useSelector((state: RootState) => state.data.sets);
    const [setData, setSetData] = useState<SetData[]>([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [phases, setPhases] = useState<string[]>([]);

    useEffect(() => {
        const phases = Object.entries(sets).map(set => set[1].phaseName);
        setPhases(Array.from(new Set(phases)));
    }, [sets])

    useEffect(() => {
        let filteredSets = Object.entries(sets)
            .map((set) => set[1])
            .reverse()
            .slice();
        if (filters.upset) {
            filteredSets = filteredSets.filter(
                (set) => set.winnerSeed > set.loserSeed
            );
        }
        if (filters.seeded) {
            //TODO: what's the cutoff for seeding?
            filteredSets = filteredSets.filter(
                (set) => set.winnerSeed <= 16 || set.loserSeed <= 16
            );
        }
        if (filters.phase !== "All Phases") {
            filteredSets = filteredSets.filter(
                (set) => set.phaseName === filters.phase
            );
        }
        setSetData(filteredSets);
    }, [filters, sets]);

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
