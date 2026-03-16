import type { Products } from "../types.d.ts";
import React from "react";
import { Heart, HeartCrack, MousePointerClick, ShoppingCart } from "lucide-react";

interface ProductCartProps {
    key: number | string;
    product: Products;
    inCartInfo: { text: string; className: string; isFav: boolean };
    isLoading: boolean;
    isAuthenticated: boolean;
    addProductToCart: (productId: number | string) => void;
    addToFavorites: (productId: number | string) => void;
    deleteFromFavorites: (productId: number | string) => void;
    handleClickLogin: () => void;
}

export const ProductCard = React.memo(({
    key, product, inCartInfo, isLoading, isAuthenticated, addProductToCart, addToFavorites, deleteFromFavorites, handleClickLogin
}: ProductCartProps) => {
    return (
        <li className="flex bg-[rgba(23,23,23,1)] rounded text-white " key={key}>
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
                            <button onClick={() => addProductToCart(product.id)} className={inCartInfo.className}>
                                {isLoading ? "Adding to cart..." : inCartInfo.text}
                                <ShoppingCart size={20} />
                            </button>
                            <button className="flex items-center gap-2 text-white font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 h-8 px-3 rounded-full transition-colors duration-300">
                                {inCartInfo.isFav ? <button className="cursor-pointer" onClick={() => deleteFromFavorites(product.id)}><HeartCrack size={20} />
                                </button> : <button className="cursor-pointer" onClick={() => addToFavorites(product.id)}><Heart size={20} /></button>}
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
})
