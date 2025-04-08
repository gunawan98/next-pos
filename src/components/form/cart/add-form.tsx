"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import {
  addItemToCart,
  deleteItemFromCart,
  purchasingCart,
  updateItemInCart,
} from "@/app/action";
import { useRouter } from "next/navigation";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  Stack,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Divider,
  Typography,
  Chip,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SendIcon from "@mui/icons-material/Send";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import PaymentReceiptPreview from "@/components/PaymentRecipt";
import PinRoundedIcon from "@mui/icons-material/PinRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useSnackbar } from "notistack";
import { Cart, PaymentData, TypeCurrentCart } from "@/types/cart";
import { formatToRupiah } from "@/utils/currency";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <LoadingButton
      type="submit"
      size="small"
      endIcon={<SendIcon />}
      loading={pending}
      loadingPosition="end"
      variant="contained"
      fullWidth
      sx={{ my: 1 }}
    >
      Submit
    </LoadingButton>
  );
}

function AddForm({ currentCart }: TypeCurrentCart) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const cartId = String(currentCart?.id);
  const [cartItem, setCartItem] = useState<Cart | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    product_id: number;
    quantity: number;
  } | null>(null);

  const handleClickOpenUpdateDialog = (item: {
    product_id: number;
    quantity: number;
  }) => {
    setSelectedItem(item);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedItem(null);
  };

  const handleClickOpenPurchaseDialog = () => {
    setOpenPurchaseDialog(true);
  };

  const handleClosePurchaseDialog = () => {
    setOpenPurchaseDialog(false);
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`/api/cart-item?cartId=${cartId}`);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await response.json();
      if (data?.data) {
        setCartItem(data.data);
      }
    } catch (err: any) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const handleUpdateItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedItem) {
      const formData = new FormData(event.currentTarget);
      const quantity = Number(formData.get("quantity"));
      await updateItemInCart(cartId, selectedItem.product_id, quantity);
      handleCloseUpdateDialog();
      fetchCartItems(); // Refetch data after update
    }
  };

  const handleDeleteItem = async (cartItemId: number) => {
    try {
      const response = await deleteItemFromCart(cartItemId);

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to delete item");
      }

      enqueueSnackbar(response.message, { variant: "success" });
      fetchCartItems(); // Refetch cart items after deletion
    } catch (error: any) {
      enqueueSnackbar(error.message || "An error occurred", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (cartId) {
      fetchCartItems();
    }
  }, [cartId]);

  const handleAddProductToCart = async (formData: FormData) => {
    try {
      const response = await addItemToCart(formData, cartId!);

      if (response.status === 200) {
        fetchCartItems(); // Refetch data after adding product
      } else {
        if ("message" in response)
          enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message, { variant: "error" });
      } else {
        enqueueSnackbar("An unknown error occurred", { variant: "error" });
      }
    }
  };

  const handlePurchase = async (formData: FormData) => {
    try {
      const response = await purchasingCart(formData, cartId!);
      if (response.status === 200) {
        setCartItem(null);
        if ("data" in response) {
          setPaymentData(response.data);
        }

        enqueueSnackbar("Purchase successful", { variant: "success" });
      } else {
        enqueueSnackbar("Something error", { variant: "error" });
      }
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message, { variant: "error" });
      } else {
        enqueueSnackbar("An unknown error occurred", { variant: "error" });
      }
    }
  };

  console.log("cartItem", cartItem);

  return (
    <>
      <Box component="form" action={handleAddProductToCart} mt={1}>
        <TextField
          name="quantity"
          type="number"
          defaultValue={1}
          label="Quantity"
          id="input-quantity"
          size="small"
          fullWidth
          required
          sx={{ mb: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PinRoundedIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          name="barcode"
          label="Barcode"
          id="input-barcode"
          size="small"
          fullWidth
          required
          sx={{ mb: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <DocumentScannerIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <SubmitButton />
      </Box>

      <Divider sx={{ my: 2 }} />

      {cartItem?.items &&
        cartItem.items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 1,
              backgroundColor: "background.default",
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
              <Stack
                direction={{ xs: "column", lg: "row" }}
                justifyContent="space-between"
              >
                <Typography variant="subtitle2" color="primary.dark">
                  {formatToRupiah(item.total_price)}
                </Typography>
                <Box>
                  <Chip
                    color="primary"
                    icon={<EditRoundedIcon />}
                    label={item.quantity}
                    size="small"
                    onClick={() =>
                      handleClickOpenUpdateDialog({
                        product_id: item.product_id,
                        quantity: item.quantity,
                      })
                    }
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    color="error"
                    icon={<DeleteRoundedIcon />}
                    label="Delete"
                    size="small"
                    onClick={() => handleDeleteItem(item.id)}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        ))}

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          backgroundColor: "background.paper",
          paddingY: 2,
        }}
      >
        <Typography variant="subtitle1" color="text.primary">
          Total Items: {cartItem?.items?.length}
        </Typography>
        <Typography variant="subtitle1" color="text.primary">
          Total Price:{" "}
          <strong>{formatToRupiah(cartItem?.total_purchase ?? 0)}</strong>
        </Typography>

        <Button
          fullWidth
          size="small"
          variant="contained"
          onClick={handleClickOpenPurchaseDialog}
        >
          Purchase
        </Button>
      </Box>

      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        closeAfterTransition={false}
        PaperProps={{
          component: "form",
          onSubmit: handleUpdateItem,
        }}
      >
        <DialogTitle>Update Quantity</DialogTitle>
        <DialogContent>
          <TextField
            name="quantity"
            type="number"
            label="Quantity"
            defaultValue={selectedItem?.quantity}
            size="small"
            variant="outlined"
            required
            fullWidth
            sx={{ my: 2 }}
          />
          <SubmitButton />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPurchaseDialog}
        onClose={handleClosePurchaseDialog}
        closeAfterTransition={false}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            await handlePurchase(formData); // Call handlePurchase with formData
            handleClosePurchaseDialog();
          },
        }}
      >
        <DialogTitle>Purchase</DialogTitle>
        <DialogContent>
          <Box
            rowGap={2.5}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            paddingY={2}
          >
            <FormControl fullWidth>
              <InputLabel id="select-payment-method">Payment Method</InputLabel>
              <Select
                labelId="select-payment-method"
                name="payment_method"
                label="Payment Method"
                size="small"
                required
                defaultValue={"cash"}
              >
                <MenuItem value="cash">cash</MenuItem>
                <MenuItem value="credit-card">credit-card</MenuItem>
                <MenuItem value="ewallet">ewallet</MenuItem>
                <MenuItem value="other">other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              type="number"
              name="paid"
              label="Paid"
              size="small"
              variant="outlined"
              required
            />

            <SubmitButton />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePurchaseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {paymentData && <PaymentReceiptPreview data={paymentData} />}
    </>
  );
}

export default memo(AddForm);
