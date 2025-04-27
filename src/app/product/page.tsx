import React from "react";
import { Typography } from "@mui/material";
import ProductTable from "@/components/table/ProductTable";

const Page: React.FC = () => {
  return (
    <>
      <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
        Product
      </Typography>
      <ProductTable />
    </>
  );
};

export default Page;
