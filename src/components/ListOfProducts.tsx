import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth.tsx";
import useUrl from "../hooks/useUrl.tsx";
import { Heart, HeartCrack, MousePointerClick, ShoppingCart } from "lucide-react";
import useCartActions from "../hooks/useCartActions.tsx";
import { useEffect } from "react";
import supabase from "../supabase/client.js"

import useLoadingAndError from "../hooks/useLoadingAndError.tsx";

export default function ListOfProducts() {
  const { products } = useUrl();
  const { error, loading } = useLoadingAndError();
  const { isAuthenticated } = useAuth();
  const { addProductToCart, getProductsInCart, cart, addToFavorites, deleteFromFavorites } = useCartActions();
  const navigate = useNavigate();

  useEffect(() => {
    getProductsInCart();
  }, []);

  function findItem(productId: number | string) {
    const inCart = cart.find((product) => product.product_id === productId);
    console.log(cart);
    const text = inCart ? "Added to cart" : "Add to cart";
    const className = inCart ? "flex items-center gap-2 text-white bg-[rgba(0,150,32,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#00921f] h-8 px-6 rounded-full transition-colors duration-300" : "flex items-center gap-2 text-white bg-[rgba(7,75,248,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#0335b4] h-8 px-6 rounded-full transition-colors duration-300"

    return { text, className, isFav: inCart?.fav };
  }

  const handleClickLogin = () => {
    navigate("/login")
  }

  return (
    <>
      <section className="mt-5 p-6">

        <h1 className="text-3xl font-bold text-white ">Explore our products</h1>
      </section >
      {
        error ? (
          <h1> Ups! It looks like theres been an error.Please try again.</h1 >
        ) : loading ? (
          <h1>Loading products...</h1>
        ) : products && products.length > 0 ? (

          <ul className="flex flex-wrap justify-center gap-10 p-12">
            {products!.map((product) => {
              const itemInfo = findItem(product.id);

              return (

                <li className="flex bg-[rgba(23,23,23,1)] rounded text-white " key={product.id}>
                  <div className="w-100 rounded shadow-md overflow-hidden flex flex-col">
                    <div className="flex justify-center p-4 h-64">
                      <img src={product.image} alt={product.title} className="max-h-full object-contain" />
                    </div>

                    <div className='description flex flex-col items-center justify-center p-4 shrink-0'>
                      <h2 className="text-center font-bold text-[21px] leading-tight mb-1">{product.title}</h2>
                      <h3 className="text-center text-1xl text-gray-300 capitalize mb-2">{product.category}</h3>
                      <strong className="text-center text-xl">${product.price}</strong>
                    </div>

                    <div className="p-2 px-6  flex-grow flex items-center justify-center text-center">
                      <p className="text-[16px] text-justify line-clamp-4">{product.description}</p>
                    </div>

                    <div className="p-4 flex justify-center mt-auto py-9">
                      {isAuthenticated ? (
                        <>
                          <button onClick={() => addProductToCart(product.id)} className={itemInfo.className}>
                            {itemInfo.text}
                            <ShoppingCart size={20} />
                          </button>
                          <button className="flex items-center gap-2 text-white font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 h-8 px-3 rounded-full transition-colors duration-300">
                            {itemInfo.isFav ? <button onClick={() => deleteFromFavorites(product.id)}><HeartCrack size={20} />
                            </button> : <button onClick={() => addToFavorites(product.id)}><Heart size={20} /></button>}
                          </button>
                        </>
                      ) : (
                        <button onClick={handleClickLogin} className="flex outline-0 border-0 items-center gap-2 text-white bg-[rgba(7,75,248,1)] h-8 px-6 rounded-full font-semibold cursor-pointer hover:text-gray-200 hover:bg-[#0335b4] transition-colors duration-300">
                          <span>Add to cart</span>
                          <MousePointerClick size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul >
        ) : (
          <h1>No products found</h1>
        )
      }
    </>
  );
}
