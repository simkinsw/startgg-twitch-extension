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
            light: "#4eb0ef"
        },
        secondary: {
            main: "#c74646",
            dark: "#b43636",
            light: "#fa393c"
        },
        background: {
            default: "#dbdbdb",
            paper: "#fff"
        },
        typography: {
            contrastFocused: "#fff",
            contrastUnfocused: "#dbdbdb"
        }
    },
    typography: {
        htmlFontSize: 8,
        fontFamily: 'Lato',
        h1: {
            fontSize: 72,
            fontWeight: 600,
            fontFamily: 'Fredoka',
        },
        h2: {
            fontSize: 60,
            fontWeight: 400,
            fontFamily: 'Fredoka',
        },
        h3: {
            fontSize: 40,
            fontFamily: 'Fredoka',
        },
        h4 : {
            fontSize: 36,
            fontWeight: 600,
            fontFamily: 'Fredoka'
        },
        subtitle1: {
            fontSize: 24
        }
    }
})