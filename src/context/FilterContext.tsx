import React, { createContext, useState } from "react";
import type { FiltersType } from "../types.d";

interface FilterContextType {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}
export const FilterContext = createContext<FilterContextType | undefined>(
  undefined,
);

interface FilterProviderProp {
  children: React.ReactNode;
}

export default function FilterProvider({ children }: FilterProviderProp) {
  const [filters, setFilters] = useState<FiltersType>({
    text: "",
    category: "",
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
