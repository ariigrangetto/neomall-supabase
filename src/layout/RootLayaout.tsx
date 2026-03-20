/* eslint-disable react/react-in-jsx-scope */
import { Outlet } from "react-router";
import FilterProvider from "../context/FilterContext.tsx";
import LoadingProvider from "../context/LoadingErrorContext.tsx";
import CartProvider from "../context/CartContext.tsx";
import UserProvider from "../context/UserActions.tsx";

export default function RootLayout() {
  return (
    <FilterProvider>
      <LoadingProvider>
        <CartProvider>
          <UserProvider>
            <Outlet />
          </UserProvider>
        </CartProvider>
      </LoadingProvider>
    </FilterProvider>
  );
}
