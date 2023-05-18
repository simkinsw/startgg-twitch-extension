import { ToggleButton, styled } from "@mui/material";

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
    "&": {
        color: "#000",
        fontSize: "4rem"
    },
    "&.Mui-selected": {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}));

export default CustomToggleButton;