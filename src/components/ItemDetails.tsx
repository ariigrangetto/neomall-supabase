import { Heart, HeartCrack, MousePointerClick, ShoppingCart } from "lucide-react";
import { useUserActions } from "../hooks/useUserActions";
import type { Products } from "../types.d";
import { Link, useNavigate } from "react-router";
import useCartActions from "../hooks/useCartActions";


interface ItemDetailsProps {
    item: Products;
    isLoading: boolean;
}

export default function ItemDetails({ item, isLoading }: ItemDetailsProps) {
    const { addProductToCart, addToFavorites, deleteFromFavorites, findItem } = useCartActions();
    const { isAuthenticated } = useUserActions();
    const inCartInfo = findItem(item.id);
    const navigate = useNavigate();

    const handleClickLogin = () => {
        navigate("/login")
    }

    console.log(item)
    return (
        <div className="w-100 rounded shadow-md overflow-hidden flex flex-col">
            <div className="flex justify-center p-4 h-64">
                <img src={item.image} alt={item.title} className="max-h-full object-contain" />
            </div>

            <div className='description flex flex-col items-center justify-center p-4 shrink-0'>
                <h2 className="text-center font-bold text-[21px] leading-tight mb-1">{item.title}</h2>
                <h3 className="text-center text-1xl text-gray-300 capitalize mb-2">{item.category}</h3>
                <strong className="text-center text-xl">${item.price}</strong>
            </div>

            <div className="p-2 px-6  flex-grow flex items-center justify-center text-center">
                <p className="text-[16px] text-justify line-clamp-4">{item.description}</p>
            </div>

            <div className="flex justify-center mt-auto py-6">
                {isAuthenticated ? (
                    <>
                        <button onClick={() => addProductToCart(item.id)} className={inCartInfo.className}>
                            {isLoading ? "Adding to cart..." : inCartInfo.text}
                            <ShoppingCart size={20} />
                        </button>

                        {inCartInfo.isFav ? <button className="cursor-pointer flex items-center gap-2 text-white font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 h-8 px-3 rounded-full transition-colors duration-300" onClick={() => deleteFromFavorites(item.id)}><HeartCrack size={20} />
                        </button> : <button className="cursor-pointer flex items-center gap-2 text-white font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 h-8 px-3 rounded-full transition-colors duration-300" onClick={() => addToFavorites(item.id)}><Heart size={20} /></button>}

                    </>
                ) : (
                    <>
                        <button onClick={() => handleClickLogin()} className="flex outline-0 border-0 items-center gap-2 text-white bg-[rgba(7,75,248,1)] h-8 px-6 rounded-full font-semibold cursor-pointer hover:text-gray-200 hover:bg-[#0335b4] transition-colors duration-300">
                            <span>Add to cart</span>
                            <MousePointerClick size={20} />
                        </button>
                        <button className="cursor-pointer flex items-center gap-2 text-white font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 h-8 px-3 rounded-full transition-colors duration-300" onClick={() => handleClickLogin()}><Heart size={20} /></button>
                    </>
                )}
            </div>
        </div>
    )
}