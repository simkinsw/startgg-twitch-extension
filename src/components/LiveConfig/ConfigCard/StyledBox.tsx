import { Box, type BoxProps, styled } from "@mui/material";

const StyledBox = styled(({ ...props }: BoxProps) => (
  <Box
    {...props}
    sx={{
      bgcolor: "background.paper",
      borderRadius: ".5rem",
      boxShadow: 5,
      overflow: "hidden",
    }}
  />
))();

export default StyledBox;
