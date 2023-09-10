import { type ReactNode } from "react";
import StyledBox from "./StyledBox";
import { Box, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface ConfigCardProps {
  children: ReactNode;
  heading: string;
  completed: boolean;
}

const ConfigCard: React.FC<ConfigCardProps> = ({
  children,
  heading,
  completed,
}: ConfigCardProps) => {
  return (
    <StyledBox>
      <Box
        sx={{
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: completed ? "#17c618" : "#fa393c",
        }}
      >
        <Typography variant="h5" color="primary.contrastText">
          {heading}
        </Typography>
        {completed ? (
          <CheckCircleOutlineIcon
            sx={{ color: "white", width: "4.8rem", height: "4.8rem" }}
          />
        ) : (
          <HighlightOffIcon
            sx={{ color: "white", width: "4.8rem", height: "4.8rem" }}
          />
        )}
      </Box>
      <Box padding={2}>{children}</Box>
    </StyledBox>
  );
};

export default ConfigCard;
