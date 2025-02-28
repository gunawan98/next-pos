import React from "react";
import Cart from "@/components/Cart";
import ProductList from "@/components/ProductList";
import Grid from "@mui/material/Grid2";

const Page: React.FC = () => {
  return (
    <Grid container spacing={2} component="section" sx={{ padding: 2 }}>
      <Grid size={8}>
        <ProductList />
      </Grid>
      <Grid
        size={4}
        sx={{
          background: "blue",
          position: "fixed",
          right: 0,
          height: "100vh",
          overflowY: "auto",
          padding: 2,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
        }}
      >
        <Cart />
      </Grid>
    </Grid>
  );
};

export default Page;
