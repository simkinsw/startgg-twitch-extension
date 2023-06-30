import { Box } from "@mui/material";
import ConfigCard from "../LiveConfig/ConfigCard";
import TokenConfig from "../LiveConfig/TokenConfig";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/LiveConfig/store";

const Config = () => {
    const token = useSelector((state: RootState) => state.app.apiToken);

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
                <TokenConfig />
            </ConfigCard>
        </Box>
    );
};

export default Config;
