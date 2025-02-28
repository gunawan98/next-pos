"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddForm } from "./form/cart/add-form";
import { Box, Button, Chip, Stack } from "@mui/material";

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
      if (data?.data) {
        setCart(data?.data);
      }
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

      const data: CartData = await response.json();

      if (data?.data) {
        fetchAvailableCart();
        setCurrentCart(data?.data[0]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChooseCart = (item: CartItem) => setCurrentCart(item);

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box
      component="section"
      sx={{
        maxHeight: "82vh",
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
        Create Cart
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
              onDelete={handleDelete}
              color="primary"
            />
          ))}
      </Stack>

      {currentCart?.id && <AddForm currentCart={currentCart} />}
    </Box>
  );
}
