"use client";

import React from "react";
import { SnackbarProvider } from "notistack";

const ClientSnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default ClientSnackbarProvider;
