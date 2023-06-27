import { Box } from "@mui/material";
import ConfigCard from "../LiveConfig/ConfigCard";
import TokenConfig from "../LiveConfig/TokenConfig";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setApiToken } from "../../redux/LiveConfig/app";
import { RootState } from "../../redux/LiveConfig/store";
import { getLocalStorageItem } from "../../utils/localStorageUtils";

const Config = () => {
    const dispatch = useDispatch();

    const localStorageToken = getLocalStorageItem("startGGAPIToken");
    const reduxToken = useSelector((state: RootState) => state.app.apiToken);
    const token = !!reduxToken ? reduxToken : localStorageToken;

    useEffect(() => {
        if (localStorageToken && !reduxToken) {
            dispatch(setApiToken(localStorageToken));
        }
    }, [localStorageToken, reduxToken, dispatch]);

    return (
        <Box
            sx={{
                bgcolor: "white",
                padding: "3rem",
                minHeight: "100vh",
                maxWidth: "80rem"
            }}
        >
            <ConfigCard heading="Set API Token" completed={!!token}>
                <TokenConfig token={token} />
            </ConfigCard>
        </Box>
    );
};

export default Config;
