import startGGButton from "../../../assets/startGGButton.png";
import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/LiveConfig/store";

const TournamentBanner = () => {
    const tournament = useSelector((state: RootState) => state.data.tournament);
    const event = useSelector((state: RootState) => state.data.eventName);
    const imageUrl = useSelector((state: RootState) => state.data.imageUrl);
    const startggUrl = useSelector((state: RootState) => state.data.startggUrl);

    return (
        <Box 
            bgcolor="primary.main"
            sx={{ display: 'flex', alignItems: 'center' }}
        >
            <img 
                src={imageUrl}
                alt="" 
                style={{ 
                    width: "20rem", 
                    height: "20rem", 
                    borderBottomRightRadius: "1rem", 
                    marginRight: "4rem" 
                }}
            />
            <Box>
                <Typography variant="h1" color="primary.contrastText">{tournament}</Typography>
                <Typography variant="h2" color="primary.contrastText">{event}</Typography>
            </Box>
            <Button
                variant="contained"
                disableRipple
                href={startggUrl}
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
