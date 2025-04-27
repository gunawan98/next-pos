"use client";

import { memo, useEffect, useRef, useState } from "react";
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
  OutlinedInput,
  Alert,
  FormLabel,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import PaymentReceiptPreview from "@/components/PaymentRecipt";
import PinRoundedIcon from "@mui/icons-material/PinRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useSnackbar } from "notistack";
import { Cart, PaymentData, TypeCurrentCart } from "@/types/cart";
import { formatToRupiah } from "@/utils/currency";
import CardItemListSkeleton from "@/components/buffering/list-item-card";

interface AddFormProps {
  handleClearAfterPurchase: () => void;

  currentCart: TypeCurrentCart;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <LoadingButton
      type="submit"
      size="small"
      loading={pending}
      variant="contained"
      fullWidth
      sx={{
        my: 1,
        "& .MuiLoadingButton-loadingIndicator": {
          color: (theme) => (theme.palette.mode === "dark" ? "black" : "white"),
        },
      }}
    >
      Submit
    </LoadingButton>
  );
}

function AddForm({ handleClearAfterPurchase, currentCart }: AddFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const cartId = String(currentCart?.id);
  const [cartItem, setCartItem] = useState<Cart | "loading" | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    product_id: number;
    quantity: number;
  } | null>(null);

  const quantityRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cartId) {
      fetchCartItems();
    }
  }, [cartId]);

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
    if (paymentData) {
      handleClearAfterPurchase();
      setPaymentData(null);
    }

    setOpenPurchaseDialog(false);
  };

  const fetchCartItems = async () => {
    setCartItem("loading");
    try {
      const response = await fetch(`/api/cart-item?cartId=${cartId}`);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

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

  const handleUpdateItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedItem) {
      enqueueSnackbar("No item selected for update.", { variant: "error" });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const quantity = Number(formData.get("quantity"));

    // Validate quantity
    if (isNaN(quantity) || quantity <= 0) {
      enqueueSnackbar("Please enter a valid quantity greater than 0.", {
        variant: "warning",
      });
      return;
    }

    try {
      // Update the item in the cart
      const response = await updateItemInCart(
        cartId,
        selectedItem.product_id,
        quantity
      );

      if (response.status !== 200) {
        throw new Error("Failed to update item.");
      }

      enqueueSnackbar("Item updated successfully.", { variant: "success" });

      // Refetch cart items to reflect the update
      fetchCartItems();
    } catch (error: any) {
      enqueueSnackbar(
        error.message || "An error occurred while updating the item.",
        {
          variant: "error",
        }
      );
    } finally {
      handleCloseUpdateDialog();
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

  const handleAddProductToCart = async (formData: FormData) => {
    try {
      const response = await addItemToCart(formData, cartId!);

      if (response.status === 200) {
        fetchCartItems(); // Refetch data after adding product
        enqueueSnackbar(response.message, { variant: "success" });
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message, { variant: "error" });
      } else {
        enqueueSnackbar("An unknown error occurred", { variant: "error" });
      }
    } finally {
      if (quantityRef.current) quantityRef.current.value = "1";
      if (barcodeRef.current) barcodeRef.current.value = "";
    }
  };

  const handlePurchase = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);

      const response = await purchasingCart(formData, cartId!);
      if (response.status === 200) {
        setCartItem(null);
        if ("data" in response) {
          setPaymentData(response.data);
        }

        enqueueSnackbar("Purchase successful", { variant: "success" });
      } else {
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

  return (
    <>
      <Box component="form" action={handleAddProductToCart} mt={1}>
        <FormControl sx={{ width: "100%" }} variant="outlined">
          <OutlinedInput
            size="small"
            id="quantity"
            name="quantity"
            placeholder="Quantity"
            required
            type="number"
            defaultValue={1}
            inputRef={quantityRef}
            sx={{ flexGrow: 1 }}
            startAdornment={
              <InputAdornment position="start" sx={{ color: "text.primary" }}>
                <PinRoundedIcon fontSize="small" />
              </InputAdornment>
            }
            inputProps={{
              "aria-label": "quantity",
            }}
          />
        </FormControl>

        <FormControl sx={{ width: "100%", mt: 1 }} variant="outlined">
          <OutlinedInput
            size="small"
            id="barcode"
            name="barcode"
            placeholder="Barcode"
            required
            inputRef={barcodeRef}
            sx={{ flexGrow: 1 }}
            startAdornment={
              <InputAdornment position="start" sx={{ color: "text.primary" }}>
                <DocumentScannerIcon fontSize="small" />
              </InputAdornment>
            }
            inputProps={{
              "aria-label": "barcode",
            }}
          />
        </FormControl>

        <SubmitButton />
      </Box>

      <Divider sx={{ my: 2 }} />

      {cartItem === "loading" ? (
        <CardItemListSkeleton />
      ) : cartItem?.items?.length === 0 ? (
        <Alert severity="info" color="info" variant="outlined">
          No item product.
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
        ))
      )}

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          pt: 7,
          background: (theme) =>
            `linear-gradient(to top, ${theme.palette.background.paper} 60%, transparent 100%)`,
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

        <Button
          fullWidth
          size="small"
          variant="contained"
          onClick={handleClickOpenPurchaseDialog}
        >
          Purchase {cartId}
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
          <FormControl fullWidth>
            <TextField
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Quantity"
              autoComplete="quantity"
              autoFocus
              required
              fullWidth
              variant="outlined"
              defaultValue={selectedItem?.quantity}
            />
          </FormControl>
          <SubmitButton />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPurchaseDialog} closeAfterTransition={false}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          {paymentData ? (
            <PaymentReceiptPreview data={paymentData} />
          ) : (
            <Box
              component="form"
              onSubmit={handlePurchase}
              rowGap={2.5}
              columnGap={1}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                // md: "repeat(2, 1fr)",
              }}
              paddingY={2}
            >
              <FormControl fullWidth>
                <FormLabel htmlFor="select-payment-method">
                  Payment Method
                </FormLabel>
                <Select
                  labelId="select-payment-method"
                  name="payment_method"
                  label="Payment Method"
                  size="small"
                  required
                  defaultValue={"cash"}
                >
                  <MenuItem value="cash">cash</MenuItem>
                  <MenuItem value="credit-card" disabled>
                    credit-card
                  </MenuItem>
                  <MenuItem value="ewallet" disabled>
                    ewallet
                  </MenuItem>
                  <MenuItem value="other" disabled>
                    other
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="paid">Paid</FormLabel>
                <TextField
                  id="paid"
                  type="number"
                  name="paid"
                  placeholder="0"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <SubmitButton />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePurchaseDialog} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default memo(AddForm);
