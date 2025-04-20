"use client";

import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { CardProductProps as ProductProps } from "@/types/product";

interface ProductResponse {
  data: ProductProps[];
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
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [totalRows, setTotalRows] = useState<number>(0);

  // Dialog states
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(
    null
  );

  const fetchProducts = async (page: number, pageSize: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/product?page=${page + 1}&per_page=${pageSize}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data: ProductResponse = await response.json();
      setProducts(data.data);
      setTotalRows(data.metadata.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const handleEditClick = (product: ProductProps) => {
    setSelectedProduct(product);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (product: ProductProps) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleUpdateProduct = () => {
    // Logic to update the product
    console.log("Updating product:", selectedProduct);
    setOpenEditDialog(false);
  };

  const handleDeleteProduct = () => {
    // Logic to delete the product
    console.log("Deleting product:", selectedProduct);
    setOpenDeleteDialog(false);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
    { field: "price", headerName: "Price", flex: 1, minWidth: 100 },
    { field: "barcode", headerName: "Barcode", flex: 1, minWidth: 150 },
    {
      field: "stock",
      headerName: "Stock",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      minWidth: 50,
    },
    {
      field: "discount",
      headerName: "Discount",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      minWidth: 80,
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
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        rowCount={totalRows}
        // getRowClassName={(params) =>
        //   params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        // }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
        loading={loading}
        // density="compact"
      />

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={selectedProduct?.name || ""}
            onChange={(e) =>
              setSelectedProduct((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
          />
          <TextField
            label="Price"
            fullWidth
            margin="dense"
            type="number"
            value={selectedProduct?.price || ""}
            onChange={(e) =>
              setSelectedProduct((prev) =>
                prev ? { ...prev, price: parseFloat(e.target.value) } : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleUpdateProduct} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the product "{selectedProduct?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProduct}
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
