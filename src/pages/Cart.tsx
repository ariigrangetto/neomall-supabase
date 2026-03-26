import { AlertCircle, ArrowLeft, Frown, Minus, Plus } from "lucide-react";
import useCartActions from "../hooks/useCartActions.tsx";
import { Link, useNavigate } from "react-router";
import Footer from "../components/Footer.tsx";

export default function Cart() {
  const { cart, deleteProductFromCart, incrementQuantity, decrementQuantity } = useCartActions();
  const navigate = useNavigate();

  const handleRedirectProducts = () => {
    navigate("/products");
  }

  return (
    <>
      <main className="min-h-screen">
        <title>Cart</title>
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

        {cart.length === 0 ? (
          <>
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 sm:p-8 text-center">
              <div className="p-4 bg-blue-500/10 rounded-full">
                <Frown className="w-12 h-12 text-blue-500" />
              </div>
              <h1 className="text-2xl sm:text-[30px] font-bold text-white">Oops! Looks like your cart is empty.</h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-md">Start shopping to fill it up!</p>
              <button
                onClick={() => handleRedirectProducts()}
                className="mt-4 px-6 py-2 bg-[rgba(7,75,248,1)] text-white font-semibold rounded-full hover:bg-[#0335b4] transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          </>
        ) : (
          <ul className="flex flex-wrap justify-center gap-6 sm:gap-10 p-4 sm:p-8 md:p-12">
            {cart.map((product) => (
              <li key={product.product_id} className="w-full sm:w-auto border border-gray-900/20 p-4 sm:p-6 rounded-2xl shadow-[0px_0px_55px_1px] shadow-gray-300/12">
                <div className="w-full sm:w-[350px] md:w-[380px] rounded shadow-md overflow-hidden flex flex-col">
                  <div className="flex justify-center p-4 h-48 sm:h-64">
                    <img src={product.Products.image} alt={product.Products.title} className="max-h-full object-contain" />
                  </div>

                  <div className='description flex flex-col items-center justify-center p-4 shrink-0'>
                    <h2 className="text-center font-bold text-lg sm:text-[21px] leading-tight mb-1">{product.Products.title}</h2>
                    <h3 className="text-center text-sm sm:text-base text-gray-300 capitalize mb-2">{product.Products.category}</h3>
                    <strong className="text-center text-lg sm:text-xl">${product.Products.price}</strong>
                  </div>

                  <div className="p-2 px-4 sm:px-6 flex-grow flex items-center justify-center text-center">
                    <p className="text-sm sm:text-[16px] text-justify line-clamp-4">{product.Products.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 py-3 sm:py-4">
                    <p className="text-center text-sm sm:text-base">Quantity: {product.quantity}</p>
                    <p className="font-semibold text-sm sm:text-base">Total: ${product.Products.price * product.quantity}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 py-2 sm:py-3">
                    <button className="border border-blue-700 text-white p-2 sm:p-3 rounded-full cursor-pointer hover:bg-blue-700/20 transition-colors" onClick={() => incrementQuantity(product.product_id)}><Plus size={20} /></button>
                    <button className="border border-blue-700 text-white p-2 sm:p-3 rounded-full cursor-pointer hover:bg-blue-700/20 transition-colors" onClick={() => decrementQuantity(product.product_id)}><Minus size={20} /></button>
                  </div>
                  <div className="flex items-center justify-center py-3">
                    <button className="w-full max-w-[250px] sm:max-w-none sm:w-auto border border-red-700 rounded-full px-4 sm:px-10 hover:bg-red-700/60 transition-colors hover:text-white hover:ease-in-out duration-500 py-2 text-red-700 cursor-pointer text-sm sm:text-base" onClick={() => deleteProductFromCart(product.product_id)}>Remove from cart</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>)}
      </main>
      <Footer />
    </>
  );
}
