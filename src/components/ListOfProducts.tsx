import { Link } from "react-router";
import useAuth from "../hooks/useAuth.tsx";
import useUrl from "../hooks/useUrl.tsx";
import { MousePointerClick } from "lucide-react";
import useCartActions from "../hooks/useCartActions.tsx";
import { useEffect } from "react";

import useLoadingAndError from "../hooks/useLoadingAndError.tsx";

export default function ListOfProducts() {
  const { products } = useUrl();
  const { error, loading } = useLoadingAndError();
  const { isAuthenticated } = useAuth();
  const { addProductToCart, getProductsInCart, cart } = useCartActions();

  useEffect(() => {
    getProductsInCart();
  }, []);

  function findItem(productId: number | string) {
    const inCart = cart.find((product) => product.product_id === productId);
    const text = inCart ? "Added to cart" : "Add to cart";
    return { text };
  }

  return (
    <>
      {error ? (
        <h1>Ups! It looks like theres been an error. Please try again.</h1>
      ) : loading ? (
        <h1>Loading products...</h1>
      ) : products && products?.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <div className='description'>
                <h2>{product.title}</h2>
                <h3>{product.category}</h3>
                <strong>${product.price}</strong>
                <p>{product.description}</p>
                {isAuthenticated ? (
                  <button onClick={() => addProductToCart(product.id)}>
                    {findItem(product.id).text}
                    <i>
                      <MousePointerClick />
                    </i>
                  </button>
                ) : (
                  <Link to='/login'>
                    <div>
                      <p>Add to cart</p>
                      <i>
                        <MousePointerClick />
                      </i>
                    </div>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h1 className='search-not-found'>Not search found, try again!</h1>
      )}
    </>
  );
}
