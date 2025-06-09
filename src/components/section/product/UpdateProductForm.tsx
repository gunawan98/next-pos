import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Box, FormLabel, Grid2, styled } from "@mui/material";
import { CardProductProps as ProductProps } from "@/types/product";
import { enqueueSnackbar } from "notistack";
import { updateDataProduct } from "@/app/product/action";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import UploadImageProduct from "@/components/UploadImageProduct";
import { BoxGradient } from "@/components/BoxGradient";

type UpdateProductFormProps = {
  selectedProduct: ProductProps | null;
  onUpdate: (updatedProduct: ProductProps) => void;
};

const FormGrid = styled(Grid2)(() => ({
  display: "flex",
  flexDirection: "column",
}));

function UpdateProductForm({
  selectedProduct,
  onUpdate,
}: UpdateProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProduct = async (
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
      const response = await updateDataProduct(
        String(selectedProduct?.id),
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

      onUpdate({
        id: selectedProduct?.id!,
        name,
        barcode,
        stock,
        price,
        discount,
        images: selectedProduct?.images || [],
      });
    } catch (error: any) {
      enqueueSnackbar(
        error.message || "An error occurred while updating the product.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Grid2
      container
      sx={{
        height: {
          xs: "100%",
        },
      }}
    >
      <Grid2
        size={{ xs: 12, sm: 5, lg: 4 }}
        sx={{
          pt: 5,
          px: 5,
          display: "wrap",
        }}
      >
        <BoxGradient>
          {selectedProduct?.id !== undefined && (
            <UploadImageProduct productId={selectedProduct.id} />
          )}
        </BoxGradient>
      </Grid2>

      <Grid2
        size={{ sm: 12, md: 7, lg: 8 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          width: "100%",
          backgroundColor: "background.default",
          alignItems: "start",
          pt: { xs: 0, sm: 5 },
          px: { xs: 2, sm: 10 },
          gap: { xs: 4, md: 8 },
        }}
      >
        <Box
          component="form"
          onSubmit={handleUpdateProduct}
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
                defaultValue={selectedProduct?.name}
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
                defaultValue={selectedProduct?.price}
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
                defaultValue={selectedProduct?.barcode}
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
                required
                size="small"
                defaultValue={selectedProduct?.discount}
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
                size="small"
                defaultValue={selectedProduct?.stock}
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
                Update
              </LoadingButton>
            </FormGrid>
          </Grid2>
        </Box>
      </Grid2>
    </Grid2>
  );
}

export default UpdateProductForm;
