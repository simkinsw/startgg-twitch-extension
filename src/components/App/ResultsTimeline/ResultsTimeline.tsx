import { useSelector } from "react-redux";
import { Box, Button, Fade } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { defaultFilters } from "./filters";
import SetBox from "../SetBox";
import FilterMenu from "../FilterMenu";
import { type SetData, selectAllSets } from "../../../redux/data";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// TODO: this is too much in one place
const ResultsTimeline: React.FC = () => {
  const sets = useSelector(selectAllSets);
  const [prevSets, setPrevSets] = useState<SetData[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [buttonVisible, setButtonVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const scrollContainer = document.getElementById("scroll-container")!;

  const handleClick = (): void => {
    scrollContainer.scrollTop = 0;

    setFilters(defaultFilters);
    setButtonVisible(false);
  };

  const phases = useMemo(() => {
    return Array.from(new Set(sets.map((set) => set.phaseName)));
  }, [sets]);

  const setData = useMemo(() => {
    return sets.filter((set) => {
      return (
        (!filters.upset || set.winnerSeed > set.loserSeed) &&
        (!filters.seeded || set.winnerSeed <= 16 || set.loserSeed <= 16) &&
        (filters.phase === "All Phases" || set.phaseName === filters.phase) &&
        (filters.search !== "" ||
          set.winnerName.toLowerCase().includes(filters.search) ||
          set.loserName.toLowerCase().includes(filters.search))
      );
    });
  }, [sets, filters]);

  useEffect(() => {
    if (
      Object.entries(prevSets).length === 0 ||
      Object.entries(prevSets).length === Object.entries(sets).length
    ) {
      setPrevSets(sets);
      return;
    }
    setPrevSets(sets);

    if (scrollContainer.scrollTop > 0 || filters !== defaultFilters) {
      setButtonVisible(true);
      scrollContainer.onscroll = () => {
        if (scrollContainer.scrollTop === 0 && filters === defaultFilters) {
          setButtonVisible(false);
        }
      };
    }
  }, [sets, prevSets, filters, scrollContainer]);

  return (
    <>
      <Fade in={buttonVisible}>
        <Button
          onClick={handleClick}
          variant="contained"
          sx={{
            position: "fixed",
            right: "38rem",
            bottom: "15rem",
            display: "flex",
            justifyContent: "center",
            fontSize: "4rem",
            boxShadow: 10,
            borderRadius: 100,
            paddingRight: "3.5rem",
          }}
        >
          <ArrowUpwardIcon fontSize="large" sx={{ paddingRight: "1rem" }} />
          New sets
        </Button>
      </Fade>
      <Box sx={{ overflow: "auto" }}>
        <FilterMenu phases={phases} filters={filters} setFilters={setFilters} />
        <Box
          sx={{
            display: "grid",
            margin: "2rem",
            marginTop: "5rem",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "6rem",
            rowGap: "6rem",
            maxHeight: "100%",
            overflow: "auto",
            paddingBottom: "1rem",
          }}
        >
          {setData.map((set) => (
            <SetBox
              set={set}
              key={set.winnerName + set.loserName + set.roundName}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default ResultsTimeline;
