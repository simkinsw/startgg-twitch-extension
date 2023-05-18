import { Box, Divider, Typography } from "@mui/material";
import { SetData } from "../../../redux/data";

interface SetBoxProps {
    set: SetData;
}

const SetBox: React.FC<SetBoxProps> = ({ set }) => {
    const upset = set.winnerSeed > set.loserSeed;

    return (
        <Box
            sx={{
                borderRadius: ".5rem",
                overflow: "hidden",
            }}
            boxShadow={5}
        >
            <Box bgcolor="#000" padding={1.5}>
                <Typography
                    color="#fff"
                    variant="h5"
                    noWrap
                    textOverflow="ellipsis"
                    sx={{ maxWidth: "50rem" }}
                >
                    {set.phaseName} - {set.roundName}
                </Typography>
            </Box>
            <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
                <SetResult
                    tag={set.winnerName}
                    games={set.winnerGames}
                    won={true}
                    seed={set.winnerSeed <= 32 ? set.winnerSeed : undefined}
                />
                <Divider color="#333" />
                <SetResult
                    tag={set.loserName}
                    games={set.loserGames}
                    won={false}
                    seed={set.loserSeed <= 32 ? set.loserSeed : undefined}
                />
            </Box>
        </Box>
    );
};

interface SetResultProps {
    tag: string;
    games: number;
    won: boolean;
    seed?: number;
}

const SetResult: React.FC<SetResultProps> = ({ tag, games, won, seed }) => {
    if ((seed && tag.length > 16) || tag.length > 22) {
        if (tag.indexOf("|") !== -1) {
            tag = tag.slice(tag.indexOf("|") + 2);
        }
    }

    return (
        <Box sx={{ flex: "1", display: "flex" }}>
            <Box
                sx={{ flex: "1", display: "flex" }}
                padding={1.5}
                bgcolor="#fff"
            >
                <Typography
                    variant="h5"
                    fontWeight={won ? 600 : 400}
                    noWrap
                    textOverflow="ellipsis"
                    sx={seed ? { maxWidth: "37rem" } : { maxWidth: "42rem" }}
                >
                    {tag}
                </Typography>
                {seed && (
                    <Typography
                        variant="h5"
                        sx={{ paddingLeft: "1rem" }}
                        textAlign="right"
                        color="#68717a"
                    >
                        [{seed}]
                    </Typography>
                )}
            </Box>
            <Box
                paddingTop={1.5}
                sx={{ flex: "0 0 13%" }}
                bgcolor={won ? "#22b24c" : "#68717a"}
            >
                <Typography
                    variant="h5"
                    fontWeight={won ? 600 : 400}
                    color="#fff"
                    align="center"
                >
                    {games}
                </Typography>
            </Box>
        </Box>
    );
};

export default SetBox;
