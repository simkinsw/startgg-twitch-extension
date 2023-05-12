import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    Typography,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setApiToken } from "../../../redux/store";
import { clearLocalStorageItem } from "../../../utils/localStorageUtils";
import { theme } from "../../../mui-theme";

interface ResetTokenProps {
    token: string;
}

const ResetToken: React.FC<ResetTokenProps> = ({ token }) => {
    const [showToken, setShowToken] = useState(false);
    const dispatch = useDispatch();

    const handleClickShowToken = () => setShowToken((show) => !show);

    const resetToken = () => {
        dispatch(setApiToken(""));
        clearLocalStorageItem("startGGAPIToken");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                height: "24rem"
            }}
        >
            <Typography>
                You have successfully added an API token.
                <br />
                Hit Reset to clear all cookies and enter a new token.
            </Typography>
            <Box sx={{ display: "flex", width: "100%", gap: "1rem", marginTop: theme.spacing(3) }}>
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
                                        {showToken ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
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
