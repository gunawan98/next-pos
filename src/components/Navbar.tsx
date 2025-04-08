"use client";

import React from "react";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ThemeToggleButton from "./ThemeToggleButton";
import { useThemeContext } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const { setThemeMode } = useThemeContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        console.log("Logout successful");
        router.push("/login"); // Redirect to the login page
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <Drawer
      sx={{
        width: 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 80,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ textAlign: "center", paddingBottom: 2 }}>
        <Image
          alt="Our company"
          src={"/images/logo.png"}
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 2,
            display: "block",
            margin: "0 auto",
          }}
        />
      </Box>
      <Box sx={{ textAlign: "center", paddingBottom: 2 }}>
        <ThemeToggleButton onToggle={setThemeMode} />
        <IconButton onClick={handleLogout} color="inherit">
          <LogoutIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
}
