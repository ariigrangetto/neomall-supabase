/* eslint-disable react/display-name */
import type { Products } from "../types.d.ts";
import React from "react";
import { Heart, HeartCrack, MousePointerClick, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router";
interface ProductCartProps {
    product: Products;
    inCart: boolean;
    isFav: boolean;
    isLoading: boolean;
    isAuthenticated: boolean;
    addProductToCart: (id: string | number) => void;
    addToFavorites: (id: string | number) => void;
    deleteFromFavorites: (id: string | number) => void;
    deleteProductFromCart: (id: string | number) => void;
}

export const ProductCard = React.memo(({
    product, inCart, isFav, isLoading, isAuthenticated,
    addProductToCart, addToFavorites, deleteFromFavorites, deleteProductFromCart
}: ProductCartProps) => {
    const navigate = useNavigate();

    const handleClickLogin = () => {
        navigate("/login");
    }

    const inCartClassName = inCart ? "flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(0,150,32,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#007a1a] h-10 px-10 rounded transition-colors duration-300"
        : "flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(7,75,248,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#0335b4] h-10 px-10 rounded transition-colors duration-300";

    return (
        <li className="flex bg-[rgba(23,23,23,1)] rounded text-white " key={product.id}>
            <div className="w-100 rounded shadow-md overflow-hidden flex flex-col">
                <div className="relative flex justify-center p-4 h-64 w-full">
                    <div className="absolute top-4 right-4 z-10">
                        {isAuthenticated ? (
                            isFav ? (
                                <button className="cursor-pointer flex justify-center items-center bg-black/20 hover:bg-black/40 text-white font-semibold border-0 outline-0 p-2 rounded-full transition-colors duration-300 backdrop-blur-sm" onClick={() => deleteFromFavorites(product.id)}>
                                    <HeartCrack size={20} color="lightblue" fill="lightblue" />
                                </button>
                            ) : (
                                <button className="cursor-pointer flex justify-center items-center bg-black/20 hover:bg-black/40 text-white font-semibold border-0 outline-0 p-2 rounded-full transition-colors duration-300 backdrop-blur-sm" onClick={() => addToFavorites(product.id)}>
                                    <Heart size={20} />
                                </button>
                            )
                        ) : (
                            <button className="cursor-pointer flex justify-center items-center bg-black/20 hover:bg-black/40 text-white font-semibold border-0 outline-0 p-2 rounded-full transition-colors duration-300 backdrop-blur-sm" onClick={() => handleClickLogin()}>
                                <Heart size={20} />
                            </button>
                        )}
                    </div>
                    <img src={product.image} alt={product.title} className="max-h-full object-contain" />
                </div>

                <div className='description flex flex-col items-center justify-center p-4 shrink-0'>
                    <h2 className="text-center font-bold text-[21px] leading-tight mb-1">{product.title}</h2>
                    <h3 className="text-center text-1xl text-gray-300 capitalize mb-2">{product.category}</h3>
                    <strong className="text-center text-xl">${product.price}</strong>
                </div>

                <div className="p-2 px-6 grow flex items-center justify-center text-center">
                    <p className="text-[16px] text-justify line-clamp-4">{product.description}</p>
                </div>

                <div className="flex justify-center mt-auto py-6">
                    {isAuthenticated ? (
                        <div className="flex justify-center flex-col gap-5 w-[300px]">
                            {inCart ? (
                                <div className="flex items-center justify-center">
                                    <button onClick={() => deleteProductFromCart(product.id)} className="flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(204,0,0,0.78)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[rgba(119,0,0,1)] h-10 px-10 rounded transition-colors duration-300">
                                        Remove from cart
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <button onClick={() => addProductToCart(product.id)} className={inCartClassName}>
                                        {isLoading ? "Adding to cart..." : "Add to cart"}
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center flex-col gap-5 w-[300px]">
                            <div className="flex items-center justify-center">
                                <button onClick={() => handleClickLogin()} className="flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(7,75,248,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#0335b4] h-10 px-10 rounded transition-colors duration-300">
                                    <span className="text-[17px]">Add to cart</span>
                                    <MousePointerClick size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-center items-center py-1 mb-4 ">
                    <Link to={`/productDetail/${product.id}`} className="cursor-pointer flex justify-center items-center text-white font-semibold hover:text-gray-200">See details</Link>
                </div>
            </div>
        </li >
    )
}, (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id &&
        prevProps.inCart === nextProps.inCart &&
        prevProps.isFav === nextProps.isFav &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.isAuthenticated === nextProps.isAuthenticated;
});
