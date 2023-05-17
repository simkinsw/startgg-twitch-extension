import { Box } from "@mui/material";

type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
};

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ maxHeight: "1152px" }}
            {...other}
        >
            {value === index && (
                <Box
                    sx={{
                        p: 3,
                        transform: "translateY(33rem)",
                        maxHeight: "105rem",
                        overflowY: "scroll",
                        scrollbarWidth: "thin"
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
};
