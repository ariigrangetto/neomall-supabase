import ListOfProducts from "../components/ListOfProducts.js";
import SearchSection from "../components/SearchSection.jsx";

export default function Products() {
  return (
    <>
      <SearchSection />
      <h1>Listados de products se presentaran aqui</h1>
      <ListOfProducts />
    </>
  );
}
