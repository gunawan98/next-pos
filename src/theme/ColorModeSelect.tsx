import * as React from "react";
import { useColorScheme } from "@mui/material/styles";
import {
  Popover,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
} from "@mui/material";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightsStayRoundedIcon from "@mui/icons-material/NightsStayRounded";

export default function ColorModeSelect() {
  const { mode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (choosedMode: "light" | "dark" | "system") => {
    setMode(choosedMode);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getIcon = () => {
    switch (mode) {
      case "light":
        return <LightModeRoundedIcon />;
      case "dark":
        return <NightsStayRoundedIcon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };

  if (!mode) {
    return null;
  }

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
