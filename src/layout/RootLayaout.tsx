/* eslint-disable react/react-in-jsx-scope */
import { Outlet } from "react-router";
import FilterProvider from "../context/FilterContext.tsx";
import LoadingProvider from "../context/LoadingErrorContext.tsx";
import CartProvider from "../context/CartContext.tsx";
import UserProvider from "../context/UserActions.tsx";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function RootLayout() {
  return (
    <FilterProvider>
      <LoadingProvider>
        <CartProvider>
          <UserProvider>
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-screen bg-black">
                <Loader2 className="w-12 h-12 text-[rgba(7,75,248,1)] animate-spin" />
                <h1 className="mt-4 text-xl font-medium text-gray-300">Loading...</h1>
              </div>
            }>
              <Outlet />
            </Suspense>
          </UserProvider>
        </CartProvider>
      </LoadingProvider>
    </FilterProvider>
  );
}
