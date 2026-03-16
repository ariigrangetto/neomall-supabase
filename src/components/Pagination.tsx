import { ChevronLeft, ChevronRight } from "lucide-react";
import useFilters from "../hooks/useFilters.js";
import useUrl from "../hooks/useUrl.js";

export default function Pagination() {
  const { totalPages, handleChangePage } = useUrl();
  const { currentPage, setCurrentPage } = useFilters();
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

  const isLastPage = currentPage === pages.length;
  const isFirstPage = currentPage === 1;

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (!isLastPage) {
      setCurrentPage(nextPage);
      handleChangePage(nextPage);
    }
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (!isFirstPage) {
      setCurrentPage(prevPage);
      handleChangePage(prevPage);
    }
  };

  return (
    <>
      <ul className="w-full py-4 flex items-center justify-center">
        <button className={isFirstPage ? "cursor-not-allowed text-gray-700" : "cursor-pointer"} onClick={handlePrevPage}>
          <ChevronLeft />
        </button>
        {pages.map((i) => (
          <button key={i} className={currentPage === i ? "bg-blue-700 p-2 px-4 rounded" : "p-2 px-4 cursor-pointer"} onClick={() => handleChangePage(i)}>
            {i}
          </button>
        ))}
        <button className={isLastPage ? "cursor-not-allowed text-gray-700" : "cursor-pointer"} onClick={handleNextPage}><ChevronRight /></button>
      </ul>
    </>
  );
}
