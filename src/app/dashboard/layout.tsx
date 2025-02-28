import React from "react";
import { Box } from "@mui/material";
import ThemeProviderClient from "@/components/ThemeProviderClient";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProviderClient>
      <Box
        component="section"
        sx={{ backgroundColor: "background.default", minHeight: "100vh" }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Navbar />
        </Box>
        {children}
      </Box>
    </ThemeProviderClient>
  );
}
