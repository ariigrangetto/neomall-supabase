import { Minus, Plus } from "lucide-react";
import useCartActions from "../hooks/useCartActions.tsx";
import { Link } from "react-router";

export default function Cart() {
  const { cart, deleteProductFromCart, incrementQuantity, decrementQuantity } = useCartActions();

  return (
    <>
      <title>Cart</title>
      <div className="flex flex-wrap items-center justify-between w-full gap-3 p-6">
        <div className="flex items-center shrink-0">
          <nav className="flex items-center text-center gap-2">
            <img src="/iconN.png" alt="ICON IMAGE" className="h-8" />
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

      <ul className="flex flex-wrap justify-center gap-10 p-12">
        {cart.map((product) => (
          <li key={product.product_id} className="border border-gray-900/20 p-6 rounded-2xl shadow-[0px_0px_55px_1px] shadow-gray-300/12">
            <div className="w-100 rounded shadow-md overflow-hidden flex flex-col">
              <div className="flex justify-center p-4 h-64">
                <img src={product.Products.image} alt={product.Products.title} className="max-h-full object-contain" />
              </div>

              <div className='description flex flex-col items-center justify-center p-4 shrink-0'>
                <h2 className="text-center font-bold text-[21px] leading-tight mb-1">{product.Products.title}</h2>
                <h3 className="text-center text-1xl text-gray-300 capitalize mb-2">{product.Products.category}</h3>
                <strong className="text-center text-xl">${product.Products.price}</strong>
              </div>

              <div className="p-2 px-6  flex-grow flex items-center justify-center text-center">
                <p className="text-[16px] text-justify line-clamp-4">{product.Products.description}</p>
              </div>
              <div className="flex items-center justify-center gap-2 py-4">
                <p className="text-center">Quantity: {product.quantity}</p>
                <p>Total: ${product.Products.price * product.quantity}</p>
              </div>
              <div className="flex items-center justify-center gap-2 py-3">
                <button className="border border-blue-700 text-white px-3 py-3 rounded-full cursor-pointer" onClick={() => incrementQuantity(product.product_id)}><Plus size={20} /></button>
                <button className="border border-blue-700 text-white px-3 py-3 rounded-full cursor-pointer" onClick={() => decrementQuantity(product.product_id)}><Minus size={20} /></button>
              </div>
              <div className="flex items-center justify-center py-3">
                <button className="border border-red-700 rounded-full px-10 hover:bg-red-700/60 transition-colors hover:text-white hover:ease-in-out duration-500 py-2 text-red-700 cursor-pointer" onClick={() => deleteProductFromCart(product.product_id)}>Remove from cart</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
