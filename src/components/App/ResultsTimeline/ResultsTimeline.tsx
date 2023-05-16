import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Set from "../Set";
import { Box } from "@mui/material";

const ResultsTimeline = () => {
    const sets = useSelector((state: RootState) => state.data.completedSets);
    const setData = Object.entries(sets).map(set => set[1]);

    return (
        <Box sx={{ display: "grid", margin:"2rem", gridTemplateColumns: "1fr 1fr", columnGap: "8rem", rowGap: "8rem" }}>
            {setData.map(set => <Set set={set} />)}
        </Box>
    )
}

export default ResultsTimeline;