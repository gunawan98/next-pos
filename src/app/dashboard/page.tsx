import React from "react";
import Cart from "@/components/Cart";
import ProductList from "@/components/ProductList";

import Grid from "@mui/material/Grid2";

const Page: React.FC = () => {
  return (
    <Grid component="section" container spacing={2}>
      <Grid size={8}>
        <ProductList />
      </Grid>
      <Grid size={4}>
        <Cart />
      </Grid>
    </Grid>
  );
};

export default Page;
