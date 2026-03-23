/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth.tsx";
import useUrl from "../hooks/useUrl.tsx";
import useCartActions from "../hooks/useCartActions.tsx";
import { useMemo } from "react";
import { PackageX, AlertCircle, Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard.tsx";
import { useUserActions } from "../hooks/useUserActions.tsx";

export default function ListOfProducts() {
  const { products, loading, error } = useUrl();
  const { isAuthenticated } = useUserActions();
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
      {
        error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
            <div className="p-4 bg-red-500/10 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Oops! Something went wrong</h1>
            <p className="text-gray-400 max-w-md">We encountered an error while loading the products. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-2 bg-[rgba(7,75,248,1)] text-white font-semibold rounded-full hover:bg-[#0335b4] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : loading || products === undefined ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
            <Loader2 className="w-12 h-12 text-[rgba(7,75,248,1)] animate-spin" />
            <h1 className="text-xl font-medium text-gray-300">Loading products...</h1>
          </div>
        ) : products.length > 0 ? (
          <>
            <section className="mt-5 p-6">
              <h1 className="text-3xl font-bold text-white ">Explore our products</h1>
            </section >

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
          </>


        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
            <div className="p-4 bg-gray-800 rounded-full">
              <PackageX className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">No products found</h1>
            <p className="text-gray-400 max-w-md">We couldn't find any products matching your current search. Try adjusting your filters.</p>
          </div>
        )
      }
    </main>
  )
}
