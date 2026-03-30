/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Heart, HeartCrack, MousePointerClick, ShoppingCart, StarIcon } from "lucide-react";
import useUserActions from "../hooks/useUserActions.tsx";
import type { Products, Rating } from "../types.d.ts";
import { useNavigate } from "react-router";
import useCartActions from "../hooks/useCartActions.tsx";


interface ItemDetailsProps {
    item: Products;
    isLoading: boolean;
}

export default function ItemDetails({ item, isLoading }: ItemDetailsProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
    const { addProductToCart, addToFavorites, deleteFromFavorites, deleteProductFromCart, getProductReviews, cartItemsMap, wishListMap } = useCartActions();
    const { isAuthenticated } = useUserActions();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Rating[]>([]);

    useEffect(() => {
        const getRating = async () => {
            const data = await getProductReviews(item.id)
            if (data) {
                setReviews(data)
            }
        }
        getRating()
    }, [item.id])

    const inCartInfo = cartItemsMap?.get(item.id) ?? false;
    const isFav = wishListMap?.has(item.id);

    const handleClickLogin = () => {
        navigate("/login")
    }

    return (
        <>
            <div className="w-full rounded shadow-md overflow-hidden flex flex-col md:flex-row p-5">
                <div className="flex p-4 w-full md:w-1/2 h-64 md:h-auto justify-center m-auto">
                    <img src={item.image} alt={item.title} className="max-h-full h-96 md:max-h-96 object-contain" />
                </div>

                <div className="flex flex-col w-full md:w-1/2">
                    <div className='description flex flex-col items-start justify-center p-6 shrink-0'>
                        <h3 className="text-left text-lg font-bold capitalize mb-3 text-[rgba(47,104,247,1)]">{item.brand}</h3>
                        <h2 className="text-left w-full font-bold text-[40px] leading-tight mb-2">{item.title}</h2>
                        <div className="flex items-center gap-2">
                            <strong className="text-left w-full text-[30px]">${item.price}</strong>
                            <p className="text-[18px] text-justify font-semibold text-red-500">{item.discount}%</p>
                        </div>
                    </div>

                    <div className="p-6 pt-0 grow flex items-start text-left">
                        <p className="text-[18px] text-justify">{item.description}</p>
                    </div>

                    <div className="gap-4 px-6 mt-auto py-6">
                        {isAuthenticated ? (
                            <div className="flex justify-center m-auto flex-col gap-5 w-[300px]">
                                {inCartInfo ? (
                                    <div className="flex items-center justify-center">
                                        <button onClick={() => deleteProductFromCart(item.id)} className="flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(204,0,0,0.78)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[rgba(119,0,0,1)] h-10 px-10 rounded transition-colors duration-300">
                                            {isLoading ? "Removing from cart..." : "Remove from cart"}
                                            <ShoppingCart size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <button onClick={() => addProductToCart(item.id)} className={inCartInfo ? "flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(0,150,32,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#007a1a] h-10 px-10 rounded transition-colors duration-300" : "flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(7,75,248,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#0335b4] h-10 px-10 rounded transition-colors duration-300"}>
                                            {isLoading ? "Adding to cart..." : inCartInfo ? "Added to cart" : "Add to cart "}
                                            <ShoppingCart size={20} />
                                        </button>
                                    </div>
                                )}
                                {isFav ? (
                                    <div className="flex items-center justify-center">
                                        <button onClick={() => deleteFromFavorites(item.id)} className="flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(204,0,0,0.78)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[rgba(119,0,0,1)] h-10 px-10 rounded transition-colors duration-300">
                                            {isLoading ? "Removing from favorites..." : "Remove from favorites"}
                                            <HeartCrack size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <button onClick={() => addToFavorites(item.id)} className="flex items-center w-full justify-center text-center gap-2 text-white bg-[rgba(0,150,32,1)] font-semibold cursor-pointer border-0 outline-0 hover:text-gray-200 hover:bg-[#007a1a] h-10 px-10 rounded transition-colors duration-300">
                                            {isLoading ? "Adding to favorites..." : "Add to favorites"}
                                            <Heart size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <button onClick={() => handleClickLogin()} className="flex outline-0 border-0 items-center gap-2 text-white bg-[rgba(7,75,248,1)] w-full rounded p-2 font-semibold cursor-pointer hover:text-gray-200 hover:bg-[#0335b4]  transition-colors duration-300 text-center justify-center text-[17px]">
                                    <span>Add to cart</span>
                                    <MousePointerClick size={25} />
                                </button>
                                <button className=" flex items-center gap-2 text-black justify-center font-semibold cursor-pointer border-0 outline-0 hover:bg-gray-200 rounded p-2 transition-colors  duration-300 text-center bg-white w-full text-[17px]" onClick={() => handleClickLogin()}>
                                    <p>Add to favorites</p><Heart size={20} fill="rgba(47,104,247,1)" color="rgba(47,104,247,1)" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <section className="flex flex-col mt-8 pt-5 px-5">
                <nav className="flex gap-8 border-b border-gray-200/10 w-full relative">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`pb-3 text-[18px] font-semibold transition-colors duration-300 relative ${activeTab === 'description' ? 'text-[rgba(47,104,247,1)]' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Description
                        {activeTab === 'description' && (
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[rgba(47,104,247,1)] rounded-t-md"></span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-3 text-[18px] font-semibold transition-colors duration-300 relative ${activeTab === 'reviews' ? 'text-[rgba(47,104,247,1)]' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        Reviews
                        {activeTab === 'reviews' && (
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[rgba(47,104,247,1)] rounded-t-md"></span>
                        )}
                    </button>
                </nav>

                <div className="py-8 min-h-[200px]">
                    {activeTab === 'description' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <h3 className="text-[30px] font-bold mb-4 text-left">Product Description</h3>
                            <p className="grow flex text-[18px] items-center text-left">{item.description}</p>
                            <table className="w-full border-collapse border border-gray-200/10 mt-10">
                                <thead>
                                    <tr className="bg-[rgba(47,104,247,1)]">
                                        <th className="border border-gray-200/10 px-4 py-2 text-left text-[18px] font-semibold">Shipping</th>
                                        <th className="border border-gray-200/10 px-4 py-2 text-left text-[18px] font-semibold">Warranty</th>
                                        <th className="border border-gray-200/10 px-4 py-2 text-left text-[18px] font-semibold">Availability</th>
                                        <th className="border border-gray-200/10 px-4 py-2 text-left text-[18px] font-semibold">Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-200/10 px-4 py-2 text-left text-[18px]">{item.shipping}</td>
                                        <td className="border border-gray-200/10 px-4 py-2 text-left text-[18px]">{item.warranty}</td>
                                        <td className="border border-gray-200/10 px-4 py-2 text-left text-[18px]">{item.availability ? "In Stock" : "Out of Stock"}</td>
                                        <td className="border border-gray-200/10 px-4 py-2 text-left text-[18px]">{item.stock}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <h3 className="text-[30px] font-bold mb-4 text-left">Customer Reviews</h3>
                            <div className="p-8 rounded-lg mt-6">
                                {reviews.length === undefined ? (
                                    <p className="text-gray-600 text-[18px] mb-2">Loading reviews...</p>
                                ) : (
                                    reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <div key={review.id} className="flex flex-col gap-4 p-8 border border-gray-200/10 rounded-xl mb-6 shadow-sm hover:shadow-md transition-all duration-300s">
                                                <div className="flex justify-between items-start w-full">
                                                    <div className="flex items-center gap-4">
                                                        <img src="/profilePic.png" alt={`${review.reviewerName} avatar`} className="h-14 w-14 rounded-full object-cover border-2 border-gray-100" />
                                                        <div className="flex flex-col text-left">
                                                            <p className="text-white font-bold text-[18px]">{review.reviewerName}</p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <StarIcon
                                                                        key={i}
                                                                        size={16}
                                                                        color={i < review.rating ? "rgba(47,104,247,1)" : "#e5e7eb"}
                                                                        fill={i < review.rating ? "rgba(47,104,247,1)" : "transparent"}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-500 text-[14px] font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                        <p>{new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <div className="text-white text-[16px] leading-relaxed mt-2 text-left w-full">
                                                    <p>{review.comment}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        < p className="text-gray-600 text-[18px] mb-2">No reviews yet for this product.</p>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div >
            </section >
        </>
    )
}