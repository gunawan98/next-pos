import React from "react";
import { Box, Stack } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

export default function CardItemListSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <Stack
          key={index}
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 1,
            backgroundColor: "background.default",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <Skeleton variant="rectangular" width={50} height={50} />
          <Box sx={{ width: "100%", padding: 1 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        </Stack>
      ))}
    </>
  );
}
