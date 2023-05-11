import { Box, Typography } from "@mui/material";
import TokenConfig from "./TokenConfig";
import ConfigCard from "./ConfigCard";
import { getCookie } from "../../utils/cookieUtils";
import EventConfig from "./EventConfig";
import { useDispatch, useSelector } from "react-redux";
import { AppState, setApiToken } from "../../redux/store";
import { useEffect } from "react";

const LiveConfig: React.FC = () => {
    const dispatch = useDispatch();

    const cookieToken = getCookie("startGGAPIToken");
    const reduxToken = useSelector((state: AppState) => state.apiToken);

    const token = !!reduxToken ? reduxToken : cookieToken;
    const event = useSelector((state: AppState) => state.event);

    useEffect(() => {
        if (cookieToken && !reduxToken) {
            dispatch(setApiToken(cookieToken));
        }
    }, [cookieToken, reduxToken, dispatch]);

    const completedTasks = [!!token, !!event].filter(Boolean).length

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                display: "flex",
                flexDirection: "column",
                gap: "3rem",
                padding: "3rem",
            }}
        >
            <Box>
                <Typography variant="h4">
                    Configure %AppName%
                </Typography>
                <Typography variant="subtitle1">
                    {completedTasks} of 2 tasks completed
                </Typography>
            </Box>
            <ConfigCard heading="Set API Token" completed={!!token}>
                <TokenConfig token={token} />
            </ConfigCard>
            <ConfigCard heading="Select Event" completed={!!event}>
                <EventConfig event={event} token={token!} /> 
            </ConfigCard>
        </Box>
    );
};

export default LiveConfig;

