"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Cart } from "@/types/cart";
import DetailCart from "../section/history/DetailCart";

interface CartResponse {
  data: Cart[];
  metadata: {
    count: number;
    has_next: boolean;
    has_previous: boolean;
    page: number;
    per_page: number;
    total: number;
  };
}

export default function PaymentHistoryTable() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [chooseCartId, setChooseCartId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [totalRows, setTotalRows] = useState<number>(0);

  const fetchFinishedCart = async (page: number, pageSize: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/cart/finished?page=${page + 1}&pageSize=${pageSize}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch carts");
      }

      const data: CartResponse = await response.json();

      setCarts(data.data);
      setTotalRows(data.metadata.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch carts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinishedCart(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const handleChooseCart = (id: number) => {
    setChooseCartId(id);
  };

  const columns: GridColDef[] = [
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const date = new Date(params.row.created_at);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} / ${hours}:${minutes}:${seconds}`;
      },
    },
    { field: "cashier_id", headerName: "Cashier ID", flex: 1, minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => handleChooseCart(params.row.id)}
        >
          Detail
        </Button>
      ),
    },
  ];

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
    <Grid container spacing={4} columns={12}>
      <Grid size={{ xs: 12, lg: 7 }}>
        <DataGrid
          rows={carts}
          columns={columns}
          rowCount={totalRows}
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DetailCart cartId={chooseCartId} />
      </Grid>
    </Grid>
  );
}
