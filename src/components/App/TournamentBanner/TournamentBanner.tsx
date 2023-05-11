import { FC } from "react";
import startGGButton from "../../../assets/startGGButton.png";
import { Box, Button, Typography } from "@mui/material";

type TournamentBannerProps = {
    tournamentInfo: {
        tournamentName: string;
        eventName: string;
        imageUrl: string;
        startGGUrl: string;
    }
};

const TournamentBanner: FC<TournamentBannerProps> = ({ tournamentInfo }) => {
    return (
        <Box 
            bgcolor="primary.main"
            sx={{ display: 'flex', alignItems: 'center' }}
        >
            <img 
                src={tournamentInfo.imageUrl} 
                alt="" 
                style={{ 
                    width: "20rem", 
                    height: "20rem", 
                    borderBottomRightRadius: "1rem", 
                    marginRight: "4rem" 
                }}
            />
            <Box>
                <Typography variant="h1" color="primary.contrastText">{tournamentInfo.tournamentName}</Typography>
                <Typography variant="h2" color="primary.contrastText">{tournamentInfo.eventName}</Typography>
            </Box>
            <Button
                variant="contained"
                disableRipple
                href={tournamentInfo.startGGUrl}
                disableElevation
                color="secondary"
                target="_blank"
                sx={{ padding: 2, marginRight: 2, marginLeft: 'auto' }}
            >
                <img
                    src={startGGButton}
                    alt="startgg"
                    style={{ height: "4rem" }}
                />
            </Button>
        </Box>
    );
};

export default TournamentBanner;
