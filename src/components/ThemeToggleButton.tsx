"use client";

import React, { useState } from "react";
import {
  Button,
  Popover,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

export default function ThemeToggleButton({
  onToggle,
}: {
  onToggle: (mode: "light" | "dark" | "system") => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  return (
    <>
      <Button color="inherit" onClick={handleClick}>
        Theme
      </Button>
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
            <Brightness7Icon />
          </ListItemIcon>
          <ListItemText primary="Light" />
        </ListItemButton>
        <ListItemButton onClick={() => handleToggle("dark")}>
          <ListItemIcon>
            <Brightness4Icon />
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
