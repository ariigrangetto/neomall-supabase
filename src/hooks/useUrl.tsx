import { useEffect, useState } from "react";
import useFilters from "./useFilters";
import supabase from "../supabase/client.js";
import type { Products } from "../types.d";
import useLoading from "./useLoading.js";

const RESULTS_PER_PAGE = 10;

export default function useUrl() {
  const {
    filters,
    setSearchParams,
    searchParams,
    currentPage,
    setCurrentPage,
  } = useFilters();
  const { startLoading, stopLoading } = useLoading();
  const [products, setProducts] = useState<Products[]>();
  const [totalPages, setTotalPages] = useState<number>(0);

  const limit = RESULTS_PER_PAGE;
  const offset = (currentPage - 1) * limit;

  useEffect(() => {
    async function getProducts() {
      startLoading();
      const params = new URLSearchParams();

      const { data: totalProducts } = await supabase.from("Products").select();

      const totalPagesCalc = Math.ceil(totalProducts.length / RESULTS_PER_PAGE);
      setTotalPages(totalPagesCalc);

      let query = supabase
        .from("Products")
        .select()
        .range(offset, offset + limit - 1);

      if (filters.text) {
        params.append("text", filters.text);
        query = query.ilike("title", `%${filters.text}%`);
      }

      if (filters.category) {
        params.append("category", filters.category);
        query = query.eq("category", `${filters.category}`);
      }

      if (currentPage) {
        params.append("page", currentPage.toString());
      }

      setSearchParams(params);

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      if (data) {
        setProducts(data);
      }
      stopLoading();
    }

    getProducts();
  }, [filters.text, filters.category, currentPage]);

  const handleChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    setCurrentPage(page);
  };

  return {
    products,
    handleChangePage,
    totalPages,
  };
}
