import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import StyledTooltip from "../StyledTooltip";
import { useDispatch } from "react-redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setApiToken } from "../../../redux/LiveConfig/app";
import { validateToken } from "../../../utils/startGG";
import { useTheme } from "@mui/material/styles";

const EnterToken: React.FC = () => {
  const [token, setToken] = useState("");
  const [storeToken, setStoreToken] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const theme = useTheme();

  const handleClickShowToken = (): void => {
    setShowToken((show) => !show);
  };

  const dispatch = useDispatch();

  const handleTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setToken(event.target.value);
  };

  const handleStoreTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setStoreToken(event.target.checked);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    setLoading(true);
    try {
      const isValid = await validateToken(token);
      if (isValid) {
        dispatch(setApiToken({ apiToken: token, store: storeToken }));
      } else {
        setError("Invalid token");
      }
    } catch (error) {
      setError("An error occurred while validating the token");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        height: "24rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography>
        You need a start.gg API token to use QuickStartGG.
        <br />
        You can generate one{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://start.gg/admin/profile/developer"
        >
          here
        </a>
        .
      </Typography>
      <form
        style={{
          display: "flex",
          alignItems: "start",
          gap: theme.spacing(1),
          marginTop: theme.spacing(3),
          marginBottom: theme.spacing(5),
          height: "4.8rem",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          id="token-input"
          label="Token"
          variant="outlined"
          sx={{ flex: "1" }}
          value={token}
          onChange={handleTokenChange}
          error={error !== ""}
          helperText={error}
          type={showToken ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowToken}>
                  {showToken ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            height: "7rem",
            width: "13rem",
          }}
          disabled={token === "" || loading}
        >
          {loading ? "Validating..." : "Validate"}
        </Button>
      </form>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={storeToken}
              onChange={handleStoreTokenChange}
              sx={{ paddingRight: ".2rem" }}
            />
          }
          label="Remember Me"
        />
        <StyledTooltip title="We'll store your token as a cookie so you don't have to enter it next time">
          <HelpOutlineIcon
            sx={{
              color: "gray",
              width: "2.4rem",
              transform: "translate(-1rem, .1rem)",
            }}
          />
        </StyledTooltip>
      </Box>
    </Box>
  );
};

export default EnterToken;
