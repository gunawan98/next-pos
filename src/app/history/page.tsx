import React from "react";
import Grid from "@mui/material/Grid2";
import { Stack, Typography } from "@mui/material";
import PaymentHistoryTable from "@/components/table/PaymentHistoryTable";

const Page: React.FC = () => {
  return (
    <>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <PaymentHistoryTable />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            {/* <CustomizedTreeView /> */}
            {/* <ChartUserByCountry /> */}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
