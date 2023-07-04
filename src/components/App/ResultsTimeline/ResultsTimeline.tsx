import { useSelector } from "react-redux";
import { RootState } from "../../../redux/VideoComponent/store";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { defaultFilters } from "./filters";
import SetBox from "../SetBox";
import FilterMenu from "../FilterMenu";
import { BeatLoader } from "react-spinners";
import { Sets, SetData } from "../../../redux/data";

//TODO: this is too much in one place
const ResultsTimeline = () => {
    const sets = useSelector((state: RootState) => state.data.sets);
    const [prevSets, setPrevSets] = useState<Sets>([]);
    const [setData, setSetData] = useState<SetData[]>([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [loadingSets, setLoadingSets] = useState(false);

    const phases = Array.from(new Set(Object.entries(sets).map(set => set[1].phaseName)));
    useEffect(() => {
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
        if (filters.search) {
            tempSets = tempSets.filter(
                (set) => set.winnerName.toLowerCase().includes(filters.search) 
                        || set.loserName.toLowerCase().includes(filters.search)
            );
        }
        setSetData(tempSets.sort((a,b) => b.order - a.order));
    }, [sets, filters])

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
