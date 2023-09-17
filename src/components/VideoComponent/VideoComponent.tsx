import TournamentBanner from "./TournamentBanner";
import ResultsTimeline from "./ResultsTimeline";
import { Box, Typography } from "@mui/material";
import { TabPanel, StyledTab, StyledTabs } from "./Tabs";
import { useState } from "react";
import { FaGamepad } from "react-icons/fa";
import { BsQuestionLg } from "react-icons/bs";

const VideoComponent: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_e: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "1152px",
        bgcolor: "background.default",
      }}
    >
      <Box
        bgcolor="primary.main"
        sx={{
          boxShadow: 5,
          width: "1024px",
          zIndex: 100,
        }}
      >
        <TournamentBanner />
        <Box sx={{ paddingTop: "2rem" }}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="StartGG Overlay Tabs"
          >
            <StyledTab
              icon={<FaGamepad />}
              iconPosition="start"
              label="Results"
              {...a11yProps(0)}
            />
            <StyledTab
              icon={<BsQuestionLg />}
              iconPosition="start"
              label="Coming"
              {...a11yProps(1)}
            />
            <StyledTab
              icon={<BsQuestionLg />}
              iconPosition="start"
              label="Soon"
              {...a11yProps(2)}
            />
          </StyledTabs>
        </Box>
      </Box>
      <TabPanel value={value} index={0}>
        <ResultsTimeline />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h3" fontFamily="Lato" fontWeight={400}>
          What would you like to see here?
          <br />
          <br />
          If you have any suggestions, message @simkins on discord. All feedback
          is greatly appreciated!
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant="h3" fontFamily="Lato" fontWeight={400}>
          What would you like to see here?
          <br />
          <br />
          If you have any suggestions, message @simkins on discord. All feedback
          is greatly appreciated!
        </Typography>
      </TabPanel>
    </Box>
  );
};

function a11yProps(index: number): { id: string; "aria-controls": string } {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default VideoComponent;
