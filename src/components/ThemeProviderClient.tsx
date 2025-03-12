"use client";

import React, { useEffect, useState } from "react";
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

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
        light: "#FFCC80",
        dark: "#F57C00",
        contrastText: "#000000",
      },
      secondary: {
        main: "#FF5722",
        light: "#FF8A50",
        dark: "#D84315",
        contrastText: "#FFFFFF",
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
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
