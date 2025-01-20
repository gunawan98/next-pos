"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { addItemToCart, purchasingCart } from "@/app/action";
import { useRouter } from "next/navigation";
import {
  Box,
  FormControl,
  InputBase,
  InputLabel,
  Select,
  Paper,
  Stack,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import SendIcon from "@mui/icons-material/Send";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import PaymentReceiptPreview from "@/components/PaymentRecipt";

interface CartItem {
  id: number;
  product_name: string;
  quantity: number;
  total_price: number;
}

interface Cart {
  id: string;
  items: CartItem[];
}

interface TypeCurrentCart {
  currentCart: {
    id: number;
    completed: boolean;
  } | null;
}

type Item = {
  id: number;
  cart_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Purchase = {
  cart_id: number;
  cashier_id: number;
  total_amount: number;
  paid: number;
  cash_back: number;
  payment_method: string;
  created_at: string;
};

type PaymentData = {
  items: Item[];
  purchase: Purchase;
};

type PaymentPageProps = {
  cartId: number;
};

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
    >
      Send
    </LoadingButton>
  );
}

function AddFormComponent({ currentCart }: TypeCurrentCart) {
  const router = useRouter(); // Use the router hook
  const cartId = String(currentCart?.id);
  const [cartItem, setCartItem] = useState<Cart | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
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
        setError(err.message);
      }
    };

    if (cartId) {
      fetchCartItems();
    }
  }, [cartId]);

  const handleAddProductToCart = async (formData: FormData) => {
    setMessage("");
    setError("");

    const response = await addItemToCart(formData, cartId!);

    if (response.status === 200) {
      const getCartItem = await fetch(`/api/cart-item?cartId=${cartId}`);

      if (getCartItem.status === 401) {
        router.push("/login");
        return;
      }

      if (!getCartItem.ok) {
        const errorData = await getCartItem.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await getCartItem.json();
      if (data?.data) {
        setCartItem(data.data);
      }

      if ("message" in response) setMessage(response.message);
    } else {
      if ("message" in response) setError(response.message);
    }
  };

  const handlePurchase = async (formData: FormData) => {
    setMessage("");
    setError("");

    const response = await purchasingCart(formData, cartId!);
    if (response.status === 200) {
      setCartItem(null);
      if ("data" in response) {
        setPaymentData(response.data);
      }
      if ("message" in response) setMessage(response.message ?? "");
    } else {
      if ("message" in response) setError(response.message ?? "");
    }
  };

  return (
    <>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* <form action={handleAddProductToCart}>
        <label htmlFor="barcode">Barcode</label>
        <input type="text" id="barcode" name="barcode" required />
        <label htmlFor="quantity">Quantity</label>
        <input type="number" id="quantity" name="quantity" required />
        <SubmitButton />
      </form> */}

      <Paper
        component="form"
        action={handleAddProductToCart}
        sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
      >
        <Box sx={{ flex: 0.5 }}>
          x{" "}
          <InputBase
            sx={{ width: "50px", textAlign: "right" }}
            type="number"
            defaultValue={1}
            inputProps={{ "aria-label": "amount" }}
            name="quantity"
            required
          />
        </Box>

        <DocumentScannerIcon sx={{ color: "gray" }} />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Scan Code"
          inputProps={{ "aria-label": "scan barcode" }}
          name="barcode"
          required
        />
        <SubmitButton />
      </Paper>
      <br />

      {cartItem?.items &&
        cartItem.items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Image
              alt="product name"
              src="https://theboxbusiness.co.nz/wp-content/uploads/2018/03/BLANK_KRAFT-1-scaled.jpg"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "30%", height: "auto", borderRadius: 2 }}
            />
            <Box>
              <strong>{item.product_name}</strong>
              <p>x{item.quantity}</p>
              Rp.{item.total_price}
            </Box>
          </Stack>
        ))}
      <br />

      <Button
        fullWidth
        size="small"
        variant="outlined"
        onClick={handleClickOpenDialog}
      >
        Confirm
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            await handlePurchase(formData); // Call handlePurchase with formData
            handleCloseDialog();
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <Box
            rowGap={2.5}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
            }}
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

            {/* <label htmlFor="paid">Paid:</label>
        <input type="text" name="paid" required />
        <label htmlFor="payment_method">Payment Method:</label>
        <input type="text" name="payment_method" required /> */}
            <SubmitButton />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {paymentData && <PaymentReceiptPreview data={paymentData} />}
    </>
  );
}

export const AddForm = memo(AddFormComponent);
