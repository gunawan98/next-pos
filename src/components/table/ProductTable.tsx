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
} from "@mui/material";
import { CardProductProps as ProductProps } from "@/types/product";
import { formatToRupiah } from "@/utils/currency";
import UpdateProductForm from "../section/product/UpdateProductForm";
import CreateNewProduct from "../section/product/CreateNewProduct";
import { enqueueSnackbar } from "notistack";
import { deleteProduct } from "@/app/product/action";

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

export default function ProductTable() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

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

  const handleRefetchProducts = () => {
    fetchProducts(0, paginationModel.pageSize);
  };

  const handleEditClick = (product: ProductProps) => {
    setSelectedProduct(product);
    setOpenEditDialog(true);
  };

  const handleUpdateProductInState = (updatedProduct: ProductProps) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleDeleteClick = (product: ProductProps) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleDeleteProduct = async () => {
    try {
      setLoadingDelete(true);
      if (!selectedProduct) {
        enqueueSnackbar("No product selected for deletion.", {
          variant: "error",
        });
        return;
      }
      const response = await deleteProduct(selectedProduct.id);

      if (response.status !== 200) {
        enqueueSnackbar(response.message, { variant: "error" });
        return;
      }

      enqueueSnackbar(response.message, { variant: "success" });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== selectedProduct.id)
      );
    } catch (error: any) {
      enqueueSnackbar(
        error.message || "An error occurred while deleting the product.",
        {
          variant: "error",
        }
      );
    } finally {
      setLoadingDelete(false);
      setOpenDeleteDialog(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => {
        return formatToRupiah(params);
      },
    },
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
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          label="Edit"
          onClick={() => handleEditClick(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          label="Delete"
          onClick={() => handleDeleteClick(params.row)}
          showInMenu
        />,
      ],
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
    <>
      <CreateNewProduct onRefetch={handleRefetchProducts} />

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          rowCount={totalRows}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
          density="compact"
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
      >
        <DialogContent
          sx={{ backgroundColor: "background.default", padding: 2 }}
        >
          <UpdateProductForm
            selectedProduct={selectedProduct}
            onUpdate={handleUpdateProductInState}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} variant="outlined">
            Cancel
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
            disabled={loadingDelete}
          >
            {loadingDelete ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
