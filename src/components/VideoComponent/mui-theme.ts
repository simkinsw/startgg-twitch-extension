import { createTheme } from "@mui/material";
import React from "react";

declare module "@mui/material/styles" {
    interface Palette {
        typography: {
            contrastFocused: React.CSSProperties['color'],
            contrastUnfocused: React.CSSProperties['color']
        }
    }

    interface PaletteOptions {
        typography: {
            contrastFocused: React.CSSProperties['color'],
            contrastUnfocused: React.CSSProperties['color']
        }
    }
}

export const theme = createTheme({
    palette: {
        primary: {
            main: "#117bbf",
        },
        secondary: {
            main: "#c74646",
        },
        typography: {
            contrastFocused: "#fff",
            contrastUnfocused: "#dbdbdb"
        }
    },
    typography: {
        htmlFontSize: 8,
        fontFamily: 'Fredoka',
        h1: {
            fontSize: 72,
            fontWeight: 600,
        },
        h2: {
            fontSize: 60,
            fontWeight: 400
        },
        h3: {
            fontSize: 40
        }
    }
})