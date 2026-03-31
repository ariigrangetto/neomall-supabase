/* eslint-disable react/react-in-jsx-scope */
import { HeartCrack } from "lucide-react";
import type { Products } from "../types.d.ts";

interface WishListCardProps {
    product: Products;
    key: string | number;
    deleteFromFavorites: (id: string | number) => void;
}

export default function WishListCard({ product, key, deleteFromFavorites }: WishListCardProps) {
    return (
        <li className="flex bg-[rgba(23,23,23,1)] rounded text-white" key={key}>
            <div className="w-100 rounded shadow-md overflow-hidden flex flex-col">
                <div className="relative flex justify-center p-4 h-64 w-full">
                    <img src={product.image} alt={product.title} />
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
                    <button onClick={() => deleteFromFavorites(product.id)} className="flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(204,0,0,0.78)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[rgba(119,0,0,1)] h-10 px-10 rounded transition-colors duration-300">
                        Remove from wishlist
                        <HeartCrack size={20} />
                    </button>
                </div>
            </div>
        </li >
    )
}