import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
} from "@mui/material";

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
    handleClose(); // Menutup dialog setelah mencetak
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Preview & Print Receipt
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Payment Receipt Preview</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Items:
          </Typography>
          {items.map((item) => (
            <Typography key={item.id}>
              <strong>{item.product_name}</strong> - {item.quantity} x{" "}
              {item.unit_price} = {item.total_price}
            </Typography>
          ))}
          <Divider style={{ margin: "16px 0" }} />
          <Typography variant="h6" gutterBottom>
            Summary:
          </Typography>
          <Typography>Total Amount: {purchase.total_amount}</Typography>
          <Typography>Paid: {purchase.paid}</Typography>
          <Typography>Cashback: {purchase.cash_back}</Typography>
          <Typography>Payment Method: {purchase.payment_method}</Typography>
          <Typography>
            Date: {new Date(purchase.created_at).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button onClick={handlePrint} color="primary" variant="contained">
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentReceiptPreview;
