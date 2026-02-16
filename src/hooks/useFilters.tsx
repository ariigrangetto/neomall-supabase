import { useContext } from "react";
import { FilterContext } from "../context/FilterContext";

export default function useFilters() {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error("useFilters must be used between a FilterProvider");

  return context;
}
