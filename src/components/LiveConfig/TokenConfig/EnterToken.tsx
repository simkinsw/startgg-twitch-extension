import { TextField, Button, FormControlLabel, Checkbox, Typography, Box, InputAdornment, IconButton } from "@mui/material";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { theme } from "../../../mui-theme";
import { Startgg } from "../../../utils/startGG";
import { setCookie } from "../../../utils/cookieUtils";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StyledTooltip from "../StyledTooltip";
import { useDispatch } from 'react-redux';
import { setApiToken } from "../../../redux/store";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
    form: {
        display: "flex",
        alignItems: "start",
        gap: theme.spacing(1),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(5),
        height: "4.8rem"
    },
    input: {
        marginBottom: theme.spacing(2),
        flex: "1",
        padding: theme.spacing(1)
    },
    button: {
        height: "7rem",
        width: "13rem"
    },
}));


const EnterToken = () => {
    const classes = useStyles(theme);
    const [token, setToken] = useState("");
    const [storeToken, setStoreToken] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showToken, setShowToken] = useState(false);

    const handleClickShowToken = () => setShowToken((show) => !show);

    const handleMouseDownToken = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const dispatch = useDispatch();

    const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
    };

    const handleStoreTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStoreToken(event.target.checked);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const isValid = await Startgg.validateToken(token);
            if (!isValid) {
                setError("Invalid token");
            } else {
                dispatch(setApiToken(token)); //add to redux store
                if (storeToken) {
                    setCookie('startGGAPIToken', token, 30); // Set cookie with token that expires in 30 days
                }
            }
        } catch (error) {
            setError("An error occurred while validating the token");
        }
        setLoading(false);
    };

    return (
        <>
            <Typography>
                You need a start.gg API token to use %AppName%. 
                <br/>
                You can generate one <a target="_blank" rel="noreferrer" href="https://start.gg/admin/profile/developer">here</a>.
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    id="token-input"
                    label="Token"
                    variant="outlined"
                    className={classes.input}
                    value={token}
                    onChange={handleTokenChange}
                    error={!!error}
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
                    className={classes.button}
                    disabled={!token || loading}
                >
                    {loading ? "Validating..." : "Validate"}
                </Button>
            </form>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                <StyledTooltip 
                    title="We'll store your token as a cookie so you don't have to enter it next time"
                >
                    <HelpOutlineIcon sx={{ color: "gray", width: "2.4rem", transform: "translate(-1rem, .1rem)" }} />
                </StyledTooltip>
            </Box>
        </>
    );
};

export default EnterToken;