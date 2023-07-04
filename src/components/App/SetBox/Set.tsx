import { Box, Divider, Typography } from "@mui/material";
import { SetData } from "../../../redux/data";
import { BsLightningCharge } from "react-icons/bs";

interface SetBoxProps {
    set: SetData;
}

const SetBox: React.FC<SetBoxProps> = ({ set }) => {
    const upset = set.winnerSeed > set.loserSeed;

    let round = set.roundName;
    round = round.replace("Round ", "R");
    round = round.replace("Quarter-Final", "QF");
    round = round.replace("Semi-Final", "SF");

    return (
        <Box
            sx={{
                borderRadius: ".5rem",
                overflow: "hidden",
            }}
            boxShadow={5}
        >
            <Box bgcolor="#000" padding={1.5} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                    color="#fff"
                    variant="h5"
                    noWrap
                    textOverflow="ellipsis"
                    sx={{ maxWidth: "46.5rem" }}
                >
                    {set.phaseName} - {round}
                </Typography>
                {upset && <BsLightningCharge color="white" fontSize={"4.5rem"} />}
            </Box>
            {
                set.winnerSeed < set.loserSeed ?
                <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
                    <SetResult
                        tag={set.winnerName}
                        games={set.winnerGames}
                        won={true}
                        upset={upset}
                        seed={set.winnerSeed <= 32 ? set.winnerSeed : undefined}
                    />
                    <Divider color="#333" />
                    <SetResult
                        tag={set.loserName}
                        games={set.loserGames}
                        won={false}
                        upset={upset}
                        seed={set.loserSeed <= 32 ? set.loserSeed : undefined}
                    />
                </Box>
                :
                <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
                    <SetResult
                        tag={set.loserName}
                        games={set.loserGames}
                        won={false}
                        upset={upset}
                        seed={set.loserSeed <= 32 ? set.loserSeed : undefined}
                    />
                    <Divider color="#333" />
                    <SetResult
                        tag={set.winnerName}
                        games={set.winnerGames}
                        won={true}
                        upset={upset}
                        seed={set.winnerSeed <= 32 ? set.winnerSeed : undefined}
                    />
                </Box>
            }
        </Box>
    );
};

interface SetResultProps {
    tag: string;
    games: number;
    won: boolean;
    seed?: number;
    upset: boolean;
}

const SetResult: React.FC<SetResultProps> = ({ tag, games, won, seed, upset }) => {
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
