import React from "react";
import Cart from "@/components/Cart";
import ProductList from "@/components/ProductList";
import Grid from "@mui/material/Grid2";
import { Box } from "@mui/material";

const Page: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Main Content with Right Margin */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          height: "100vh",
          marginRight: "25%",
        }}
      >
        <Grid
          container
          spacing={{ xs: 1 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          component="section"
          sx={{ padding: 2 }}
        >
          <ProductList />
        </Grid>
      </Box>

      {/* Fixed Sidebar on Right */}
      <Box
        sx={{
          width: "25%",
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "background.paper",
          padding: 2,
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        <Cart />
      </Box>
    </Box>
  );
};

export default Page;
