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
      <ul>
        <button onClick={handlePrevPage}>prev</button>
        {pages.map((i) => (
          <button key={i} onClick={() => handleChangePage(i)}>
            {i}
          </button>
        ))}
        <button onClick={handleNextPage}>next</button>
      </ul>
    </>
  );
}
