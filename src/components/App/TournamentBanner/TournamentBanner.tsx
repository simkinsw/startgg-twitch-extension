import startGGButton from "../../../assets/startGGButton.png";
import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/LiveConfig/store";

const TournamentBanner = () => {
    const tournament = useSelector((state: RootState) => state.data.startGGEvent.tournament);
    const event = useSelector((state: RootState) => state.data.startGGEvent.event);
    const imageUrl = useSelector((state: RootState) => state.data.startGGEvent.imageUrl);
    const startggUrl = useSelector((state: RootState) => state.data.startGGEvent.startggUrl);

    return (
        <Box 
            bgcolor="primary.main"
            sx={{ display: 'flex', alignItems: 'center', marginRight: "2rem" }}
        >
            <img 
                src={imageUrl}
                alt="" 
                style={{ 
                    flex: "0 0 20rem", 
                    height: "20rem", 
                    borderBottomRightRadius: "1rem", 
                    marginRight: "2rem" 
                }}
            />
            <Box width="72rem">
                <Typography variant="h1" noWrap color="primary.contrastText">{tournament}</Typography>
                <Typography variant="h3" noWrap color="primary.contrastText">{event}</Typography>
            </Box>
            <Button
                variant="contained"
                disableRipple
                href={startggUrl}
                disableElevation
                color="secondary"
                target="_blank"
                sx={{ padding: 2, marginLeft: 'auto' }}
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
