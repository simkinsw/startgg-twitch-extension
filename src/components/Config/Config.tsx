import { Box, Typography } from "@mui/material";
import ConfigCard from "../LiveConfig/ConfigCard";
import TokenConfig from "../LiveConfig/TokenConfig";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/LiveConfig/store";

const Config: React.FC = () => {
  const token = useSelector((state: RootState) => state.app.apiToken);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        padding: "3rem",
        minHeight: "100vh",
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
          <Typography variant="h5">Configuring QuickStartGG</Typography>
        </Box>

        <ConfigCard heading="Set API Token" completed={token !== ""}>
          <TokenConfig />
        </ConfigCard>
      </Box>
    </Box>
  );
};

export default Config;
