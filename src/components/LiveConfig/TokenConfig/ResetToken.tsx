import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Typography,
  TextField,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../../../mui-theme";
import { setApiToken } from "../../../redux/LiveConfig/app";
import { type RootState } from "../../../redux/LiveConfig/store";

const ResetToken: React.FC = () => {
  const [showToken, setShowToken] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.app.apiToken);
  const resetToken = (): void => {
    dispatch(setApiToken({ apiToken: "", store: false }));
  };

  const handleClickShowToken = (): void => {
    setShowToken((show) => !show);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        height: "24rem",
      }}
    >
      <Typography>
        You have successfully added an API token.
        <br />
        Hit Reset to clear all cookies and enter a new token.
      </Typography>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: "1rem",
          marginTop: theme.spacing(3),
        }}
      >
        <FormControl sx={{ width: "100%" }}>
          <TextField
            id="token"
            label="Saved Token"
            value={token}
            type={showToken ? "text" : "password"}
            variant="standard"
            InputProps={{
              readOnly: true,
              style: { height: "5rem" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowToken}>
                    {showToken ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <Button
          onClick={resetToken}
          color="primary"
          type="submit"
          variant="contained"
          sx={{ alignSelf: "center", height: "6rem", width: "13rem" }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default ResetToken;
