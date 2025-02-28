import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Rating } from "@mui/material";
import { CardProductProps } from "@/types/product";

export default function CardProduct(product: CardProductProps) {
  return (
    <Card>
      <CardActionArea disableRipple={true}>
        <CardMedia
          component="img"
          height="194"
          image={
            product.images.length
              ? product.images[0]
              : "/images/no-image-product.webp"
          }
          alt={product.name}
          sx={{ padding: 1 }}
        />

        <CardContent>
          <Typography variant="subtitle1" color="text.primary" noWrap>
            {product.name}
          </Typography>

          <Rating
            name="read-only"
            value={4}
            readOnly
            sx={{ fontSize: "16px" }}
          />
          <Typography component="span" variant="subtitle1" color="text.primary">
            ({4})
          </Typography>

          <Typography variant="subtitle1" color="primary">
            {product.barcode}
          </Typography>

          <Typography variant="subtitle1" color="primary">
            Rp.{product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
