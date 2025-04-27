import React from "react";
import { Typography } from "@mui/material";
import PaymentHistoryTable from "@/components/table/PaymentHistoryTable";

const Page: React.FC = () => {
  return (
    <>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <PaymentHistoryTable />
    </>
  );
};

export default Page;
