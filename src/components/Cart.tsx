"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import AddForm from "./section/cart/add-form";
import { deleteAvailableCart } from "@/app/dashboard/action";
import { enqueueSnackbar } from "notistack";

interface CartItem {
  id: number;
  completed: boolean;
}

interface CartData {
  data: CartItem[];
}

interface ErrorResponse {
  message: string;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [currentCart, setCurrentCart] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    open: boolean;
    cartId: number | null;
  }>({ open: false, cartId: null });

  const router = useRouter();

  useEffect(() => {
    fetchAvailableCart();
  }, [router]);

  const fetchAvailableCart = async () => {
    try {
      const response = await fetch("/api/cart");

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || "Failed to fetch carts");
      }

      const data: CartData = await response.json();
      setCart(data?.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCart = async () => {
    const dataToPost = {
      completed: false,
    };

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToPost),
      });

      const data = await response.json();

      if (data?.data) {
        fetchAvailableCart();
        console.log("Hallloo: ", data);
        setCurrentCart(data?.data);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChooseCart = (item: CartItem) => setCurrentCart(item);

  const handleClearAfterPurchase = () => {
    setCurrentCart(null);
    fetchAvailableCart();
  };

  const handleConfirmDelete = async () => {
    if (openDeleteDialog.cartId !== null) {
      try {
        const response = await deleteAvailableCart(openDeleteDialog.cartId);

        if (response.status !== 200) {
          throw new Error(response.message || "Failed to delete item");
        }

        enqueueSnackbar(response.message, { variant: "success" });
        fetchAvailableCart();
      } catch (error: any) {
        enqueueSnackbar(error.message || "An error occurred", {
          variant: "error",
        });
      } finally {
        setOpenDeleteDialog({ open: false, cartId: null });
      }
    }
  };

  const handleOpenDeleteDialog = (cartId: number) => {
    setOpenDeleteDialog({ open: true, cartId });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog({ open: false, cartId: null });
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", padding: 2 }}>
        <CircularProgress size={30} />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" color="error" variant="outlined">
        {error}
      </Alert>
    );

  return (
    <Box
      component="section"
      sx={{
        height: "100%",
        overflow: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Button
        variant="contained"
        size="small"
        fullWidth
        onClick={handleCreateCart}
      >
        New Cart
      </Button>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          paddingY: 1,
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none", // Untuk Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Untuk Chrome, Safari, dan Opera
          },
        }}
      >
        {cart &&
          cart.map((item) => (
            <Chip
              key={item.id}
              label={"Cart " + item.id}
              size="small"
              disabled={item.id === currentCart?.id}
              onClick={() => handleChooseCart(item)}
              onDelete={() => handleOpenDeleteDialog(item.id)}
              color="primary"
            />
          ))}
      </Stack>

      {currentCart?.id && (
        <AddForm
          handleClearAfterPurchase={handleClearAfterPurchase}
          currentCart={currentCart}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog.open} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this cart?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
