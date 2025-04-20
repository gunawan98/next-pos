import React from "react";
import { Box, Grid2 } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

export default function ProductListSkeleton() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 6, md: 8 }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid2 key={index} size={{ xs: 1, md: 2 }}>
            <Box sx={{ padding: 2 }}>
              {/* Skeleton for product image */}
              <Skeleton variant="rectangular" width={230} height={180} />
              {/* Skeleton for product title */}
              <Skeleton variant="text" sx={{ mt: 1 }} width="80%" />
              {/* Skeleton for product price */}
              <Skeleton variant="text" width="60%" />
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
