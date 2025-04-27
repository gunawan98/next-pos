import React, { useEffect, useState } from "react";
import { Cart } from "@/types/cart";
import { enqueueSnackbar } from "notistack";
import CardItemListSkeleton from "@/components/buffering/list-item-card";
import { Alert, Box, Chip, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { formatToRupiah } from "@/utils/currency";

function DetailCart({ cartId }: { cartId: number }) {
  const [cartItem, setCartItem] = useState<Cart | "loading" | null>(null);
  console.log(cartId);
  useEffect(() => {
    if (cartId) {
      fetchCartItems();
    }
  }, [cartId]);

  const fetchCartItems = async () => {
    setCartItem("loading");
    try {
      const response = await fetch(`/api/cart-item?cartId=${cartId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch cart items.");
      }

      const data = await response.json();
      if (data?.data) {
        setCartItem(data.data);
      }
    } catch (err: any) {
      enqueueSnackbar(err.message, { variant: "error" });
      setCartItem(null);
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        background: (theme) =>
          `linear-gradient(to top,  transparent 5%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Typography variant="subtitle1" color="text.primary">
        Total Items: {cartItem !== "loading" && cartItem?.items?.length}
      </Typography>
      <Typography variant="subtitle1" color="text.primary">
        Total Price:{" "}
        <strong>
          {formatToRupiah(
            cartItem !== "loading" && cartItem
              ? cartItem.total_purchase ?? 0
              : 0
          )}
        </strong>
      </Typography>

      {cartItem === "loading" ? (
        <CardItemListSkeleton />
      ) : cartItem?.items?.length === 0 ? (
        <Alert severity="info" color="info" variant="outlined">
          No product in this cart.
        </Alert>
      ) : (
        cartItem?.items?.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 1,
              borderRadius: 2,
              padding: 1,
            }}
          >
            <Image
              alt={item.product_name}
              src={item.product_image || "/images/no-image-product.webp"}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "15%", height: "auto", borderRadius: 2 }}
            />
            <Box width="100%">
              <Typography variant="subtitle1" color="text.primary" noWrap>
                {item.product_name}
              </Typography>
              <Typography variant="subtitle2" color="textDisabled">
                Harga {formatToRupiah(item.unit_price)}
              </Typography>
              <Stack direction={{ xs: "column", lg: "row" }}>
                <Box>
                  <Chip
                    variant="outlined"
                    color="warning"
                    label={`x ${item.quantity}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </Box>
                <Typography variant="subtitle2" color="primary.dark">
                  {formatToRupiah(item.total_price)}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        ))
      )}
    </Box>
  );
}

export default DetailCart;
