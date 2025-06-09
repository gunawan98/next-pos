import React from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Grid2,
  IconButton,
  Slide,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import ProductForm from "./ProductForm";

import CloseIcon from "@mui/icons-material/Close";
import UploadImageProduct from "@/components/UploadImageProduct";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateNewProduct({ onRefetch }: { onRefetch: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [resultIdProduct, setResultIdProduct] = React.useState<number>(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onRefetch();
  };

  const handleNext = (id: number) => {
    setResultIdProduct(id);
    setActiveStep(activeStep + 1);
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <ProductForm handleNext={handleNext} />;
      case 1:
        return <UploadImageProduct productId={resultIdProduct} />;
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={handleClickOpen}
        sx={{ mb: 2 }}
      >
        Create
      </Button>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              backgroundColor: "background.default",
            },
          },
        }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              size="small"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create New Product
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid2
          container
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid2 size={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { sm: "space-between", md: "flex-end" },
                alignItems: "center",
                width: "100%",
                maxWidth: { sm: "100%", md: 600 },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  flexGrow: 1,
                }}
              >
                <Stepper
                  id="desktop-stepper"
                  activeStep={activeStep}
                  sx={{ width: "100%", height: 40 }}
                >
                  <Step
                    sx={{ ":first-child": { pl: 0 }, ":last-child": { pr: 0 } }}
                  >
                    <StepLabel>Detail Product</StepLabel>
                  </Step>
                  <Step
                    sx={{ ":first-child": { pl: 0 }, ":last-child": { pr: 0 } }}
                  >
                    <StepLabel>Image View</StepLabel>
                  </Step>
                </Stepper>
              </Box>
            </Box>

            {getStepContent(activeStep)}
          </Grid2>
        </Grid2>
      </Dialog>
    </>
  );
}

export default CreateNewProduct;
