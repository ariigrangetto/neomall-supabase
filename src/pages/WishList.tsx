import { ArrowLeft, Frown } from "lucide-react";
import { Link, useNavigate } from "react-router";
import useCartActions from "../hooks/useCartActions";
import WishListCard from "../components/WishListCard";

/* eslint-disable react/react-in-jsx-scope */
export default function WishList() {
    const navigate = useNavigate();
    const { wishUserList, deleteFromFavorites } = useCartActions();

    const handleRedirectProducts = () => {
        navigate("/products");
    }

    return (
        <main className="min-h-screen">
            <title>WishList</title>
            <div className="flex flex-wrap items-center justify-between w-full gap-3 p-4 sm:p-6">
                <div className="flex items-center shrink-0">
                    <nav className="flex items-center text-center gap-2">
                        <button className="cursor-pointer" onClick={() => handleRedirectProducts()}><ArrowLeft /></button>
                        <button className="cursor-pointer" onClick={() => navigate("/")}>
                            <img src="/iconN.png" alt="ICON IMAGE" className="h-8" />
                        </button>
                        <h1 className="font-bold text-xl">Neomall</h1>
                    </nav>
                </div>
                <div className="flex items-center shrink-0 gap-3">
                    <nav className="w-10 text-center">
                        <Link to="/profile">
                            <img src="/profilePic.png" className="h-9 rounded-full" alt="USER PROFILE PIC" />
                        </Link>
                    </nav>
                </div>
            </div>
            {
                wishUserList === undefined || wishUserList.length === 0 ? (
                    <>
                        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 sm:p-8 text-center">
                            <div className="p-4 bg-blue-500/10 rounded-full">
                                <Frown className="w-12 h-12 text-blue-500" />
                            </div>
                            <h1 className="text-2xl sm:text-[30px] font-bold text-white">Oops! Looks like your wishlist is empty.</h1>
                            <p className="text-gray-400 text-base sm:text-lg max-w-md">Start adding products to your wishlist to fill it up!</p>
                            <button
                                onClick={() => handleRedirectProducts()}
                                className="mt-4 px-6 py-2 bg-[rgba(7,75,248,1)] text-white font-semibold rounded-full hover:bg-[#0335b4] transition-colors cursor-pointer"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 p-4 sm:p-8 md:p-12 justify-items-center sm:justify-items-stretch">
                        {wishUserList.map((item) => (
                            <WishListCard
                                key={item.id}
                                product={item.Products}
                                deleteFromFavorites={deleteFromFavorites}
                            />
                        ))}
                    </ul>
                )
            }
        </main>
    )
}