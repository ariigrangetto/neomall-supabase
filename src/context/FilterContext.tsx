import React, { createContext, useState, type SetStateAction } from "react";
import type { FiltersType } from "../types.d";
import { useSearchParams, type SetURLSearchParams } from "react-router";

interface FilterContextType {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  currentPage: number;
  setCurrentPage: React.Dispatch<SetStateAction<number>>;
}
export const FilterContext = createContext<FilterContextType | undefined>(
  undefined,
);

interface FilterProviderProp {
  children: React.ReactNode;
}

export default function FilterProvider({ children }: FilterProviderProp) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") || 1),
  );
  const [filters, setFilters] = useState<FiltersType>({
    text: searchParams.get("title") || "",
    category: searchParams.get("category") || "",
  });

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        searchParams,
        setSearchParams,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
