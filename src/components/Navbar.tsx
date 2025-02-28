"use client";

import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import ThemeToggleButton from "./ThemeToggleButton";
import { useThemeContext } from "@/context/ThemeContext";

export default function Navbar() {
  const { setThemeMode } = useThemeContext();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Navbar
          </Typography>
          <ThemeToggleButton onToggle={setThemeMode} />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
