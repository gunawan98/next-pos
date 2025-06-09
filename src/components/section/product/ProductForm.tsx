import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Box, FormLabel, Grid2, styled } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { createDataProduct } from "@/app/product/action";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

type ProductFormProps = {
  handleNext: (id: number) => void;
};

const FormGrid = styled(Grid2)(() => ({
  display: "flex",
  flexDirection: "column",
}));

function ProductForm({ handleNext }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const barcode = String(formData.get("barcode") || "");
    const stock = Number(formData.get("stock") || 0);
    const price = Number(formData.get("price") || 0);
    const discount = Number(formData.get("discount") || 0);

    try {
      const response = await createDataProduct(
        name,
        barcode,
        stock,
        price,
        discount
      );

      if (response.status !== 200) {
        enqueueSnackbar(response.message, { variant: "error" });
        return;
      }

      enqueueSnackbar("Product updated successfully.", { variant: "success" });
      handleNext(response.data.id);
    } catch (error: any) {
      enqueueSnackbar(
        error.message || "An error occurred while creating the product.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleCreateProduct}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        width: "100%",
        maxWidth: { sm: "100%", md: 600 },
        maxHeight: "720px",
        gap: { xs: 5, md: "none" },
      }}
    >
      <Grid2 container spacing={3}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="name" required>
            Product name
          </FormLabel>
          <OutlinedInput
            id="name"
            name="name"
            type="text"
            placeholder="Product name"
            autoComplete="name"
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="price" required>
            Price (Rp)
          </FormLabel>
          <OutlinedInput
            id="price"
            name="price"
            type="number"
            placeholder="Harga satuan"
            autoComplete="price"
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <FormLabel htmlFor="barcode" required>
            Barcode
          </FormLabel>
          <OutlinedInput
            id="barcode"
            name="barcode"
            type="text"
            placeholder="Barcode"
            autoComplete="barcode product"
            required
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="discount" required>
            Discount %
          </FormLabel>
          <OutlinedInput
            id="discount"
            name="discount"
            type="number"
            placeholder="Discount"
            autoComplete="Discount"
            size="small"
            defaultValue={0}
            required
          />
        </FormGrid>
        <FormGrid size={{ xs: 6 }}>
          <FormLabel htmlFor="stock" required>
            Stock
          </FormLabel>
          <OutlinedInput
            id="stock"
            name="stock"
            type="number"
            placeholder="0"
            required
            defaultValue={0}
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <LoadingButton
            type="submit"
            size="small"
            loading={isLoading}
            variant="contained"
            fullWidth
          >
            Create
          </LoadingButton>
        </FormGrid>
      </Grid2>
    </Box>
  );
}

export default ProductForm;
