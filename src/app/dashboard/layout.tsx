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
        sx={{
          display: "flex",
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        {children}
      </Box>
    </ThemeProviderClient>
  );
}
