import { Outlet } from "react-router";
import FilterProvider from "../context/FilterContext.tsx";
import LoadingProvider from "../context/LoadingErrorContext.tsx";
import CartProvider from "../context/CartContext.tsx";

export default function RootLayout() {
  return (
    <FilterProvider>
      <LoadingProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </LoadingProvider>
    </FilterProvider>
  );
}
