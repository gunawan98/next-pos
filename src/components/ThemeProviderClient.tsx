"use client";

import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  ThemeProvider as CustomThemeProvider,
  useThemeContext,
} from "@/context/ThemeContext";

export default function ThemeProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomThemeProvider>
      <InnerThemeProviderClient>{children}</InnerThemeProviderClient>
    </CustomThemeProvider>
  );
}

function InnerThemeProviderClient({ children }: { children: React.ReactNode }) {
  const { themeMode } = useThemeContext();

  const theme = createTheme({
    palette: {
      mode:
        themeMode === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : themeMode,
      primary: {
        main: "#FF9800",
      },
      secondary: {
        main: "#FF5722",
      },
      background: {
        default: themeMode === "dark" ? "#303030" : "#FFF3E0",
        paper: themeMode === "dark" ? "#424242" : "#FFFFFF",
      },
      text: {
        primary: themeMode === "dark" ? "#FFFFFF" : "#000000",
        secondary: themeMode === "dark" ? "#BDBDBD" : "#757575",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
