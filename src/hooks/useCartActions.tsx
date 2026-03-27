import { useContext } from "react";
import { CartContext } from "../context/CartContext.tsx";

export default function useCartActions() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartActions must be used within a CartProvider");
  }

  return context;
}
