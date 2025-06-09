"use client";

import React from "react";
import { Drawer, Box, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import ColorModeSelect from "@/theme/ColorModeSelect";
import Link from "next/link";

export default function Sidebar() {
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
        display: usePathname() === "/login" ? "none" : "flex",
        width: 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 80,
          boxSizing: "border-box",
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

        <Link href="/dashboard">
          <Tooltip title="Cashier" placement="right" arrow>
            <IconButton color="inherit" sx={{ marginTop: 2 }}>
              <PointOfSaleRoundedIcon />
            </IconButton>
          </Tooltip>
        </Link>
        <Link href="/History payment">
          <Tooltip title="Stock product" placement="right" arrow>
            <IconButton color="inherit" sx={{ marginTop: 2 }}>
              <UpdateRoundedIcon />
            </IconButton>
          </Tooltip>
        </Link>
        <Link href="/product">
          <Tooltip title="Stock product" placement="right" arrow>
            <IconButton color="inherit" sx={{ marginTop: 2 }}>
              <InboxRoundedIcon />
            </IconButton>
          </Tooltip>
        </Link>
      </Box>

      <Box sx={{ textAlign: "center", paddingBottom: 2 }}>
        <ColorModeSelect />

        <Tooltip title="Logout" placement="right" arrow>
          <IconButton
            onClick={handleLogout}
            color="inherit"
            sx={{ marginTop: 2 }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
