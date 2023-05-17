import { ToggleButton, styled } from "@mui/material";

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
    "&": {
        color: "#000",
        fontSize: "4rem"
    },
    "&.Mui-selected": {
        color: theme.palette.common.white, // Set white text when toggled
        backgroundColor: theme.palette.primary.main, // Set primary color background when toggled
        "&:hover": {
            backgroundColor: theme.palette.primary.dark, // Set darker primary color background on hover when toggled
        },
    },
}));

export default CustomToggleButton;