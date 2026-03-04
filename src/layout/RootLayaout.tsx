import { Outlet } from "react-router";
import FilterProvider from "../context/FilterContext";
import LoadingProvider from "../context/LoadingErrorContext";

export default function RootLayout() {
  return (
    <FilterProvider>
      <LoadingProvider>
        <Outlet />
      </LoadingProvider>
    </FilterProvider>
  );
}
