import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";
import { defaultFilters } from "./filters";
import SetBox from "../SetBox";
import FilterMenu from "../FilterMenu";
import { SetData, selectAllSets } from "../../../redux/data";

//TODO: this is too much in one place
const ResultsTimeline = () => {
    const sets = useSelector(selectAllSets);
    const [prevSets, setPrevSets] = useState<SetData[]>([]);
    const [filters, setFilters] = useState(defaultFilters);

    const [loadingSets, setLoadingSets] = useState(false);

    const phases = useMemo(() => {
        return Array.from(new Set(sets.map((set) => set.phaseName)));
    }, [sets]);

    const setData = useMemo(() => {
        return sets.filter((set) => {
            return (!filters.upset || set.winnerSeed > set.loserSeed) &&
            (!filters.seeded || set.winnerSeed <= 16 || set.loserSeed <= 16) && 
            (filters.phase === "All Phases" || set.phaseName === filters.phase) &&
            (!filters.search || set.winnerName.toLowerCase().includes(filters.search) || set.loserName.toLowerCase().includes(filters.search))
        })
    }, [sets, filters]);

    useEffect(() => {
        if (Object.entries(prevSets).length === 0 || Object.entries(prevSets).length === Object.entries(sets).length) {
            setPrevSets(sets);
            return;
        }

        setPrevSets(sets);
        setLoadingSets(true);
        setTimeout(() => setLoadingSets(false), 1000);
    }, [sets, prevSets]);

    return (
        <Box sx={{ overflow: "auto" }}>
            <FilterMenu phases={phases} filters={filters} setFilters={setFilters} />
            {loadingSets && 
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "6rem"
                    }}
                >
                    <BeatLoader color="#68717a" size={20} />
                </Box>
            }
            <Box
                sx={{
                    display: "grid",
                    margin: "2rem",
                    marginTop: "5rem",
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
