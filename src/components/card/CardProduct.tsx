import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import { CardProductProps } from "@/types/product";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import { formatToRupiah } from "@/utils/currency";

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
          <Chip
            icon={<LocalMallRoundedIcon />}
            label={product.stock}
            variant="filled"
            color="secondary"
            size="small"
            sx={{ padding: 1, position: "absolute", top: 10, right: 10 }}
          />

          <Typography variant="subtitle1" color="text.primary" noWrap>
            {product.name}
          </Typography>

          <Typography variant="subtitle1" color="primary">
            {formatToRupiah(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
