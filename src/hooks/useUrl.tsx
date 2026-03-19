import { useEffect, useState } from "react";
import useFilters from "./useFilters";
import supabase from "../supabase/client.js";
import type { Products } from "../types.d";
import useLoadingAndError from "./useLoadingAndError.tsx";

const RESULTS_PER_PAGE = 10;

export default function useUrl() {
  const {
    filters,
    setSearchParams,
    searchParams,
    currentPage,
    setCurrentPage,
  } = useFilters();
  const { setLoading, setError, loading, error } = useLoadingAndError();
  const [products, setProducts] = useState<Products[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

  const limit = RESULTS_PER_PAGE;
  const offset = (currentPage - 1) * limit;

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      try {

        const params = new URLSearchParams();

        let query = supabase
          .from("Products")
          .select("*", { count: "exact" })
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

        const { data, count, error } = await query;

        const totalPagesCalc = Math.ceil(count / RESULTS_PER_PAGE);
        setTotalPages(totalPagesCalc);

        if (error) {
          setLoading(false);
          setError(true);
          console.log("Error fetching products" + error.message);
          throw new Error(error.message);
        }

        if (data) {
          setProducts(data);
        }
      } finally {
        setLoading(false)
      }
    }
    getProducts();
  }, [filters.text, filters.category, currentPage]);

  const handleChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSearchParams(params);
    setCurrentPage(page);
  };

  return {
    products,
    handleChangePage,
    totalPages,
    loading,
    error
  };
}
