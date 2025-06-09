import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { Box, ImageList, ImageListItem } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import {
  addImageToProduct,
  deleteProductImage,
  getProductImage,
} from "@/app/product/action";
import { LoadingButton } from "@mui/lab";

type AllImagesProps = {
  id: number;
  productId: number;
  url: string;
};

export default function UploadImageProduct({
  productId,
}: {
  productId: number;
}) {
  const [allImages, setAllImages] = useState<AllImagesProps[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProductImages();
  }, []);

  async function fetchProductImages() {
    try {
      const response = await getProductImage(productId);

      if (response.status !== 200) {
        enqueueSnackbar(response.message, { variant: "error" });
        return;
      }

      setAllImages(response.data.data);
    } catch (error: any) {
      enqueueSnackbar(
        error.message || "An error occurred while updating the product.",
        {
          variant: "error",
        }
      );
    }
  }

  function handleChooseImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  const handleAddImageToProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    setIsLoading(true);

    try {
      if (!file) {
        enqueueSnackbar("Please select a file before uploading.", {
          variant: "warning",
        });
        return;
      }
      const response = await addImageToProduct(String(productId), formData);

      if (response.status !== 200) {
        enqueueSnackbar(response.message, { variant: "error" });
        return;
      }

      setAllImages((prevImages) => [...prevImages, response.data.data]);
      enqueueSnackbar("Image upload successfully.", { variant: "success" });
      setFile(null);
    } catch (error: any) {
      enqueueSnackbar(
        error.message || "An error occurred while uploading an image.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProductImage = async (index: number, imageId: number) => {
    try {
      const response = await deleteProductImage(imageId);

      if (response.status !== 200) {
        enqueueSnackbar(response.message, { variant: "error" });
        return;
      }

      setAllImages((prevImages) => prevImages.filter((_, i) => i !== index));
      enqueueSnackbar("Deleting image successfully.", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(
        error.message || "An error occurred while deleting an image.",
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <>
      <Box
        component="form"
        encType="multipart/form-data"
        onSubmit={handleAddImageToProduct}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          flexDirection: "column",
          border: "1px dashed #ccc",
          padding: 2,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="small"
          component="label"
        >
          Choose File
          <input
            type="file"
            accept="image/*"
            name="file"
            onChange={handleChooseImage}
            hidden
          />
        </Button>
        {file && (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded"
              style={{ width: "auto", height: "50px" }}
            />
            <LoadingButton
              type="submit"
              size="small"
              color="primary"
              variant="outlined"
              loading={isLoading}
              fullWidth
            >
              Upload
            </LoadingButton>
          </>
        )}
      </Box>

      <ImageList sx={{ height: 400 }}>
        {allImages?.length > 0 ? (
          allImages.map((image, index) => (
            <ImageListItem key={image.id} sx={{ padding: 1 }}>
              <img src={image.url} alt={`Product Image`} loading="lazy" />

              <Button
                variant="contained"
                color="error"
                size="small"
                component="label"
                onClick={() => handleDeleteProductImage(index, image.id)}
                sx={{ marginTop: 1 }}
              >
                Delete
              </Button>
            </ImageListItem>
          ))
        ) : (
          <Box sx={{ textAlign: "center", padding: 2 }}>
            No images available.
          </Box>
        )}
      </ImageList>
    </>
  );
}
