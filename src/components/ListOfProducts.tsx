import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth.tsx";
import useUrl from "../hooks/useUrl.tsx";
import useCartActions from "../hooks/useCartActions.tsx";
import { useMemo } from "react";
import useLoadingAndError from "../hooks/useLoadingAndError.tsx";
import { ProductCard } from "./ProductCard.tsx";

export default function ListOfProducts() {
  const { products } = useUrl();
  const { error, loading } = useLoadingAndError();
  const { isAuthenticated } = useAuth();
  const { addProductToCart, loadingProductInCartId, cart, addToFavorites, deleteFromFavorites } = useCartActions();
  const navigate = useNavigate();

  const cartItemsMap = useMemo(() => {
    const map = new Map();
    if (cart) {
      cart.forEach((item) => {
        map.set(item.product_id, item);
      })
      return map;
    }
  }, [cart]);

  function findItem(productId: number | string) {
    const inCart = cartItemsMap?.get(productId);
    const text = inCart ? "Added to cart" : "Add to cart";
    const className = inCart ? "flex items-center gap-2 text-white bg-[rgba(0,150,32,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#007a1a] h-8 px-6 rounded-full transition-colors duration-300" : "flex items-center gap-2 text-white bg-[rgba(7,75,248,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#0335b4] h-8 px-6 rounded-full transition-colors duration-300"

    return { text, className, isFav: inCart?.fav };
  }

  const handleClickLogin = () => {
    navigate("/login")
  }

  return (
    <main className="min-h-screen">
      <section className="mt-5 p-6">
        <h1 className="text-3xl font-bold text-white ">Explore our products</h1>
      </section >
      {
        error ? (
          <h1 className="text-center"> Ups! It looks like theres been an error.Please try again.</h1 >
        ) : loading ? (
          <h1 className="text-center">Loading products...</h1>
        ) : products && products.length > 0 ? (

          <ul className="flex flex-wrap justify-center gap-10 p-12">
            {products!.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  inCartInfo={findItem(product.id)}
                  isLoading={loadingProductInCartId === product.id}
                  isAuthenticated={isAuthenticated}
                  addProductToCart={addProductToCart}
                  addToFavorites={addToFavorites}
                  deleteFromFavorites={deleteFromFavorites}
                  handleClickLogin={handleClickLogin}
                />
              )
            })}
          </ul >
        ) : (
          <h1 className="text-center">We couldn't find any products matching your search.</h1>
        )
      }
    </main>
  )
}
