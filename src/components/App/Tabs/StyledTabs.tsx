import { Tab, Tabs, styled } from "@mui/material";

interface StyledTabProps {
  label: string;
  icon: any;
  iconPosition: "bottom" | "top" | "end" | "start" | undefined;
}

export const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  fontSize: theme.typography.h3.fontSize,
  color: theme.palette.typography.contrastUnfocused,
  paddingLeft: "1rem",
  "&.Mui-selected": {
    color: theme.palette.typography.contrastFocused,
  },
  ".MuiTab-iconWrapper": {
    marginRight: "1.5rem",
    width: "8rem",
  },
  iconWrapper: {
    margin: "10rem",
  },
}));

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    variant="fullWidth"
    TabIndicatorProps={{
      children: <span className="MuiTabs-indicatorSpan" />,
      sx: { height: "5px" },
    }}
  />
))(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "85%",
    backgroundColor: theme.palette.primary.contrastText,
  },
}));
