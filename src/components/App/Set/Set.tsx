import { Box, Divider, Typography } from "@mui/material";
import { SetData } from "../../../redux/data";

interface SetProps {
    set: SetData;
}

const Set: React.FC<SetProps> = ({ set }) => {
    return (
        <Box sx={{ borderRadius: ".5rem", overflow: "hidden" }} boxShadow={5}>
            <Box bgcolor="#000" padding={1}>
                <Typography color="#fff" variant="h5" align="center">
                    {set.phaseName} - {set.roundName}
                </Typography>
            </Box>
            <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
                <SetResult tag={set.winnerName} games={set.winnerGames} won={true} />
                <Divider color="#333" />
                <SetResult tag={set.loserName} games={set.loserGames} won={false} />
            </Box>
        </Box>
    )
}

interface SetResultProps {
    tag: string;
    games: number;
    won: boolean;
}

const SetResult: React.FC<SetResultProps> = ({ tag, games, won }) => {
    return (
        <Box sx={{ flex: "1", display: "flex" }}>
            <Box sx={{flex: "1"}} padding={1.5} bgcolor="#fff">
                <Typography variant="h5" fontWeight={won ? 600 : 400}>
                    {tag}
                </Typography>
            </Box>
            <Box paddingTop={1.5} sx={{ flex: "0 0 13%" }} bgcolor={won ? "#22b24c" : "#68717a"}>
                <Typography variant="h5" fontWeight={won ? 600 : 400} color="#fff" align="center">
                    {games}
                </Typography>
            </Box>
        </Box>
    )
}

export default Set;