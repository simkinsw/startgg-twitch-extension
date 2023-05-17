import TournamentBanner from "./TournamentBanner";
import ResultsTimeline from "./ResultsTimeline";
import { Box } from "@mui/material";
import { TabPanel, StyledTab, StyledTabs } from "./Tabs";
import { useState } from "react";
import { FaGamepad } from "react-icons/fa";


//This should probably be managed with redux
const tournamentInfo = {
    tournamentName: "Out of the Blue",
    eventName: "Melee Singles",
    imageUrl: "https://www.bing.com/th?pid=Sgg&qlt=100&u=https%3A%2F%2Fimages.start.gg%2Fimages%2Ftournament%2F505654%2Fimage-0cd61da9a1eba3dc8e5fa833c31d0d49-optimized.png&ehk=9e41ZIdzJPwvIM4B3pb4rU8R4Qc3sgUv4o5U0E63z1g%3D&w=280&h=280&r=0",
    startGGUrl: "https://www.start.gg/tournament/out-of-the-blue/event/melee-singles"
}

const VideoComponent = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", minHeight: "100%", bgcolor: "background.default" }}>
            <Box bgcolor="primary.main" sx={{ boxShadow: 5, position: "fixed", width: "1024px", zIndex: 100  }}>
                <TournamentBanner tournamentInfo={tournamentInfo} />
                <Box sx={{ paddingTop: "4rem" }}>
                    <StyledTabs
                        value={value}
                        onChange={handleChange}
                        aria-label="StartGG Overlay Tabs"
                    >
                        <StyledTab icon={<FaGamepad />} iconPosition="start" label="Results" {...a11yProps(0)} />
                        <StyledTab icon={<FaGamepad />} iconPosition="start" label="Bracket" {...a11yProps(1)} />
                        <StyledTab icon={<FaGamepad />} iconPosition="start" label="Upcoming" {...a11yProps(2)} />
                    </StyledTabs>
                </Box>
            </Box>
            <TabPanel value={value} index={0}>
                <ResultsTimeline />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Bracket Placeholder
            </TabPanel>
            <TabPanel value={value} index={2}>
                Upcoming Placeholder
            </TabPanel>
        </Box>
    );
};

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default VideoComponent;
