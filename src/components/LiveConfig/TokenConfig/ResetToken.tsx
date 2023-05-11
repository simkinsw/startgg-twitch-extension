import { Box, Button, FormControl, IconButton, OutlinedInput, InputAdornment, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../../mui-theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { clearCookie } from "../../../utils/cookieUtils";
import { useDispatch } from "react-redux";
import { setApiToken } from "../../../redux/store";


interface ResetTokenProps {
    token: string;
}

const ResetToken: React.FC<ResetTokenProps> = ({ token }) => {
    const [showToken, setShowToken] = useState(false);
    const dispatch = useDispatch();

    const handleClickShowToken = () => setShowToken((show) => !show);

    const handleMouseDownToken = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const resetToken = () => {
        dispatch(setApiToken(""));
        clearCookie("startGGAPIToken");
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 3,
            }}
        >
            <Typography>
                You have successfully added an API token. 
                <br />
                Hit Reset if you would like to clear all cookies and enter a new token.
            </Typography>
            <FormControl sx={{ width: "448px" }}>
                <TextField
                    id="token"
                    label="Saved Token"
                    value={token}
                    type={showToken ? "text" : "password"}
                    variant="standard"
                    InputProps={{
                        readOnly: true,
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
                sx={{ alignSelf: "center", marginTop: theme.spacing(1) }}
            >
                Reset
            </Button>
        </Box>
    );
};

export default ResetToken;
