import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1c4095" },
    secondary: { main: "#0EA5E9" },
    background: { default: "#F6F7F9", paper: "#FFFFFF" },
    text: { primary: "#111827", secondary: "#6B7280" }
  },
  shape: { borderRadius: 5 },
  typography: {
    fontFamily: ["Inter", "system-ui", "Arial"].join(","),
    button: { textTransform: "none", fontWeight: 700 }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 8px 24px rgba(16,24,40,0.06)" }
      }
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 8
       } }
    }
  }
});
