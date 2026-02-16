import { useEffect, useState } from "react";
import useFilters from "./useFilters";
import { useSearchParams } from "react-router";
import supabase from "../supabase/client.js";

export default function useUrl() {
  const { filters, setFilters } = useFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") || 1),
  );

  const limit = 10;
  const offset = (currentPage - 1) * limit;

  useEffect(() => {
    async function getProducts() {
      const params = new URLSearchParams();

      if (filters.text) {
        params.set("text", filters.text);
      }

      if (filters.category) {
        params.set("category", filters.category);
      }

      setSearchParams(params);

      const { data, error } = await supabase
        .from("Products")
        .select()
        .range(offset, offset + limit - 1);
      //desde - hasta

      if (error) throw new Error(error.message);

      if (data) {
        console.log(data);
        setProducts(data);
      }
    }

    getProducts();
  }, [filters.text, filters.category]);

  const handleChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };
  return { products, handleChangePage };
}
