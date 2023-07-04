import { Box, Select, MenuItem, Button, Menu, TextField, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { Filters } from "../ResultsTimeline/filters";
import { useState } from "react";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { theme } from "../../../mui-theme";

//TODO: this might need to get broken up...

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
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItems, setSelectedItems] = useState<String[]>([]);
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event: any) => {
        setSearchValue(event.target.value);
        setFilters({ ...filters, search: event.target.value.toLowerCase() })
    };

    const handleSearchClear = () => {
        setSearchValue("");
        setFilters({ ...filters, search: "" });
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (item: string) => () => {
        if (selectedItems.includes(item)) {
            setSelectedItems(
                selectedItems.filter((selected) => selected !== item)
            );
        } else {
            setSelectedItems([...selectedItems, item]);
        }

        if (item === "Upsets") {
            setFilters({ ...filters, upset: !filters.upset });
        } else if (item === "Top Seeds") {
            setFilters({ ...filters, seeded: !filters.seeded });
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
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
                    <ArrowDropDownIcon sx={{ fontSize: "5rem" }} />
                )}
                sx={{
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

            {/*TODO: big label looks bad*/}
            <TextField
                label="Player Search"
                variant="outlined"
                value={searchValue}
                onChange={handleSearchChange}
                InputProps={{
                    endAdornment: (
                        <IconButton
                          sx={{ visibility: searchValue ? "visible" : "hidden" }}
                          onClick={handleSearchClear}
                        >
                          <ClearIcon sx={{ fontSize: "4rem", color:theme.palette.primary.main }} />
                        </IconButton>
                    ),
                    sx: { fontSize: "4rem" }
                }}
                InputLabelProps={{
                    sx: { 
                        fontSize: "4rem",
                        "&.MuiInputLabel-shrink": { marginTop: "-1rem" },
                    }
                }}
            />

            <Button
                variant="contained"
                color="primary"
                type="submit"
                disableRipple
                onClick={handleClick}
            >
                <FilterListIcon sx={{ fontSize: "6rem" }} />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                PaperProps={{
                    style: {
                        marginTop: "8px",
                    },
                }}
            >
                <MenuItem
                    sx={{ fontSize: "4rem", display: "flex", gap: "1rem" }}
                    onClick={handleItemClick("Upsets")}
                >
                    {
                        selectedItems.includes("Upsets") ?
                        <MdOutlineCheckBox />
                        :
                        <MdOutlineCheckBoxOutlineBlank />
                    }
                    Upsets Only
                </MenuItem>
                <MenuItem 
                    sx={{ fontSize: "4rem", display: "flex", gap: "1rem" }}
                    onClick={handleItemClick('Top Seeds')}
                >
                    {
                        selectedItems.includes("Top Seeds") ?
                        <MdOutlineCheckBox />
                        :
                        <MdOutlineCheckBoxOutlineBlank />
                    }
                    Top Seeds Only
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default FilterMenu;