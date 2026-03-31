/* eslint-disable react/react-in-jsx-scope */
import { ArrowLeft, Frown, Loader2, Minus, Plus } from "lucide-react";
import useCartActions from "../hooks/useCartActions.tsx";
import { Link, useNavigate } from "react-router";
import Footer from "../components/Footer.tsx";

export default function Cart() {
  const { cart, deleteProductFromCart, loadingCart, incrementQuantity, decrementQuantity, deleteAllProductsInCart } = useCartActions();
  const navigate = useNavigate();

  const handleRedirectProducts = () => {
    navigate("/products");
  }

  const totalToPay = cart?.reduce((total, product) => total + (product.Products.price * product.quantity), 0);

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
        {loadingCart ? <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
          <Loader2 className="w-12 h-12 text-[rgba(7,75,248,1)] animate-spin" />
          <h1 className="text-xl font-medium text-gray-300">Loading cart</h1>
        </div>
          : cart !== undefined && cart.length > 0 ? (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Your Cart ({cart.length} items)</h2>
                    <button className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-full transition-colors text-sm font-medium" onClick={() => deleteAllProductsInCart()}>
                      Empty Cart
                    </button>
                  </div>
                  <ul className="flex flex-col gap-6">
                    {cart.map((product) => (
                      <li key={product.product_id} className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-sm">
                        <div className="w-full sm:w-40 h-40 shrink-0 bg-white/10 rounded-xl p-3 flex items-center justify-center">
                          <img src={product.Products.image} alt={product.Products.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="font-bold text-lg text-white leading-tight">{product.Products.title}</h3>
                              <strong className="text-xl text-[rgba(7,75,248,1)]">${product.Products.price}</strong>
                            </div>
                            <p className="text-sm text-gray-400 capitalize mt-1 mb-3">{product.Products.category}</p>
                            <p className="text-sm text-gray-300 line-clamp-2">{product.Products.description}</p>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-3 bg-white/5 rounded-full p-1 border border-white/10">
                              <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white" onClick={() => decrementQuantity(product.product_id)}>
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-semibold text-white">{product.quantity}</span>
                              <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white" onClick={() => incrementQuantity(product.product_id)}>
                                <Plus size={16} />
                              </button>
                            </div>

                            <button className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors" onClick={() => deleteProductFromCart(product.product_id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full lg:w-96 shrink-0">
                  <div className="sticky top-24 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                    <div className="flex flex-col gap-4 text-sm text-gray-300 mb-6 border-b border-white/10 pb-6">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totalToPay?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-400">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Tax</span>
                        <span>$0.00</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                      <span className="text-lg text-white font-medium">Total</span>
                      <strong className="text-3xl text-white font-bold">${totalToPay?.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
          )
        }
      </main>
      <Footer />
    </>
  );
}
