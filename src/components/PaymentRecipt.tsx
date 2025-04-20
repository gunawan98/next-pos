import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { formatToRupiah } from "@/utils/currency";

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

interface PaymentReceiptPreviewProps {
  data: PaymentData;
}

const PaymentReceiptPreview: React.FC<PaymentReceiptPreviewProps> = ({
  data,
}) => {
  const { items, purchase } = data;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePrint = () => {
    window.print();
    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Preview & Print Receipt
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Payment Receipt
        </DialogTitle>
        <DialogContent>
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Deddys Store
            </Typography>
            <Typography variant="body2">
              Jl. Jendral Sudirman No. 123, Probolinggo
            </Typography>
            <Typography variant="body2">Phone: +123 456 789</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Items Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Items:
            </Typography>
            {items.map((item) => (
              <Box
                key={item.id}
                display="flex"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">
                  {item.product_name} ({item.quantity} x {item.unit_price})
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formatToRupiah(item.total_price)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Summary Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Summary:
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Total Amount:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatToRupiah(purchase.total_amount)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Paid:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatToRupiah(purchase.paid)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Cashback:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatToRupiah(purchase.cash_back)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Payment Method:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {purchase.payment_method}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Date:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {new Date(purchase.created_at).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Footer Section */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" fontStyle="italic">
              Thank you for your purchase!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Close
          </Button>
          <Button
            onClick={handlePrint}
            startIcon={<PrintRoundedIcon />}
            variant="contained"
            color="primary"
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentReceiptPreview;
