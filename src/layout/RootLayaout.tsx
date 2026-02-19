import { Outlet } from "react-router";
import FilterProvider from "../context/FilterContext";

export default function RootLayout() {
  return (
    <FilterProvider>
      <Outlet />
    </FilterProvider>
  );
}
