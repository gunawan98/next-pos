"use client";

import React, { useState } from "react";
import {
  Button,
  Popover,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
} from "@mui/material";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightsStayRoundedIcon from "@mui/icons-material/NightsStayRounded";
import { useThemeContext } from "@/context/ThemeContext";

export default function ThemeToggleButton({
  onToggle,
}: {
  onToggle: (mode: "light" | "dark" | "system") => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { themeMode } = useThemeContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (mode: "light" | "dark" | "system") => {
    onToggle(mode);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getIcon = () => {
    switch (themeMode) {
      case "light":
        return <LightModeRoundedIcon />;
      case "dark":
        return <NightsStayRoundedIcon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };

  return (
    <>
      <IconButton aria-label="theme" onClick={handleClick} color="inherit">
        {getIcon()}
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ListItemButton onClick={() => handleToggle("light")}>
          <ListItemIcon>
            <LightModeRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Light" />
        </ListItemButton>
        <ListItemButton onClick={() => handleToggle("dark")}>
          <ListItemIcon>
            <NightsStayRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Dark" />
        </ListItemButton>
        <ListItemButton onClick={() => handleToggle("system")}>
          <ListItemIcon>
            <SettingsBrightnessIcon />
          </ListItemIcon>
          <ListItemText primary="System" />
        </ListItemButton>
      </Popover>
    </>
  );
}
