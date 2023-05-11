import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 250,
        fontSize: 14,
        padding: 4
    },
});

export default StyledTooltip;
