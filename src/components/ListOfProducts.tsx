import useUrl from "../hooks/useUrl";
import type { Products } from "../types.d";

export default function ListOfProducts() {
  const { products } = useUrl<Products[]>();
  return (
    <>
      {products && (
        <ul>
          {products.map((product) => {
            <li>{product.title}</li>;
          })}
        </ul>
      )}
    </>
  );
}
