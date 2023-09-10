import { Box } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
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
          id="scroll-container"
          sx={{
            p: 3,
            maxHeight: "107rem",
            overflowY: "scroll",
            scrollbarWidth: "thin",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};
