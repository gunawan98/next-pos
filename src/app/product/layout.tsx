import React from "react";
import { Box } from "@mui/material";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        backgroundColor: "background.default",
        minHeight: "100dvh",
        margin: 0,
        paddingLeft: 2,
      }}
    >
      {children}
    </Box>
  );
}
