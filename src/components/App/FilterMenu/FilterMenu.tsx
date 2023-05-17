import { Box, Select, MenuItem } from "@mui/material";
import { BsLightningCharge } from "react-icons/bs";
import { TbCrown } from "react-icons/tb";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomToggleButton from "../ResultsTimeline/ToggleButton";
import { Filters } from "../ResultsTimeline/filters";

interface FilterMenuProps {
    phases: string[];
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
    phases,
    filters,
    setFilters,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "2rem",
                margin: "2rem",
                marginBottom: "4rem",
            }}
        >
            <Select
                value={filters.phase}
                onChange={(e) =>
                    setFilters({ ...filters, phase: e.target.value })
                }
                IconComponent={() => (
                    <ArrowDropDownIcon sx={{ fontSize: "4rem" }} />
                )}
                sx={{
                    marginRight: "auto",
                    fontSize: "4rem",
                    flex: "0 0 32rem",
                }}
            >
                <MenuItem sx={{ fontSize: "4rem" }} value="All Phases">
                    All Phases
                </MenuItem>
                {phases.map((phase) => (
                    <MenuItem
                        sx={{ fontSize: "4rem" }}
                        key={phase}
                        value={phase}
                    >
                        {phase}
                    </MenuItem>
                ))}
            </Select>
            <CustomToggleButton
                value="upsets"
                selected={filters.upset}
                onChange={() =>
                    setFilters({ ...filters, upset: !filters.upset })
                }
                disableRipple
            >
                <BsLightningCharge
                    style={{ paddingRight: "4px", fontSize: "4.5rem" }}
                />
                Upsets
            </CustomToggleButton>
            <CustomToggleButton
                value="seeded"
                selected={filters.seeded}
                onChange={() =>
                    setFilters({ ...filters, seeded: !filters.seeded })
                }
                disableRipple
            >
                <TbCrown style={{ paddingRight: "4px", fontSize: "4.5rem" }} />
                Top Seeds
            </CustomToggleButton>
        </Box>
    );
};

export default FilterMenu;
