import { Box, Typography } from "@mui/material";
import TokenConfig from "./TokenConfig";
import ConfigCard from "./ConfigCard";
import EventConfig from "./EventConfig";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getLocalStorageItem } from "../../utils/localStorageUtils";
import { RootState } from "../../redux/store";
import { setApiToken } from "../../redux/app";

const LiveConfig: React.FC = () => {
    const dispatch = useDispatch();

    const localStorageToken = getLocalStorageItem("startGGAPIToken");
    const reduxToken = useSelector((state: RootState) => state.app.apiToken);

    const token = !!reduxToken ? reduxToken : localStorageToken;
    const event = useSelector((state: RootState) => state.app.event);

    useEffect(() => {
        if (localStorageToken && !reduxToken) {
            dispatch(setApiToken(localStorageToken));
        }
    }, [localStorageToken, reduxToken, dispatch]);

    const completedTasks = [!!token, !!event].filter(Boolean).length;

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                padding: "3rem",
                minHeight: "100vh"
            }}
        >
            <Box
                sx={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                }}
            >
                <Box>
                    <Typography variant="h5">Configuring %AppName%</Typography>
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
        </Box>
    );
};

export default LiveConfig;
