import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Set from "../Set";
import { Box, Button, ToggleButton } from "@mui/material";
import { useEffect, useState } from "react";
import { defaultFilters } from "./filters";
import { BsLightningCharge } from "react-icons/bs";
import { TbCrown } from "react-icons/tb";
import CustomToggleButton from "./ToggleButton";
import { SetData } from "../../../redux/data";

const ResultsTimeline = () => {
    const sets = useSelector((state: RootState) => state.data.completedSets);
    const [setData, setSetData] = useState<SetData[]>([]);
    const [filters, setFilters] = useState(defaultFilters);

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
        setSetData(filteredSets);
    }, [filters, sets]);

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "2rem",
                    margin: "2rem",
                    marginBottom: "4rem",
                }}
            >
                <CustomToggleButton
                    value="upsets"
                    selected={filters.upset}
                    onChange={() =>
                        setFilters({ ...filters, upset: !filters.upset })
                    }
                    disableRipple
                >
                    <BsLightningCharge style={{ paddingRight: "4px" }} />
                    Upsets
                </CustomToggleButton>
                <CustomToggleButton
                    value="seeded"
                    selected={filters.seeded}
                    onChange={() =>
                        setFilters({ ...filters, seeded: !filters.seeded })
                    }
                    disableRipple
                >
                    <TbCrown style={{ paddingRight: "4px" }} />
                    Top Players
                </CustomToggleButton>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    margin: "2rem",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: "8rem",
                    rowGap: "8rem",
                }}
            >
                {setData.map((set) => (
                    <Set set={set} key={set.winnerName+set.loserName+set.roundName} />
                ))}
            </Box>
        </Box>
    );
};

export default ResultsTimeline;
