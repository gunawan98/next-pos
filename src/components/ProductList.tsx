"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardProduct from "./card/CardProduct";
import { Alert, Box, Grid2 } from "@mui/material";
import { CardProductProps } from "@/types/product";
import ProductListSkeleton from "./buffering/list-product";

interface ProductResponse {
  data: CardProductProps[];
}

interface ErrorResponse {
  message: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<CardProductProps[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data: ProductResponse = await response.json();
        if (data?.data) {
          setProducts(data.data);
        }
      } catch (err: any) {
        setError(
          err.message || "Failed to fetch products, please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  if (loading) return <ProductListSkeleton />;
  if (error)
    return (
      <Alert severity="error" color="error" variant="outlined">
        {error}
      </Alert>
    );

  return (
    <>
      <Box sx={{ flexGrow: 1, pt: 2 }}>
        <Grid2
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 6, md: 10 }}
        >
          {products &&
            products.map((product) => (
              <Grid2 key={product.id} size={{ xs: 1, md: 2 }}>
                <CardProduct {...product} />
              </Grid2>
            ))}
        </Grid2>
      </Box>
    </>
  );
}
