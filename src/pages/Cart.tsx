import { useEffect } from "react";
import useCartActions from "../hooks/useCartActions.tsx";
import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";

export default function Cart() {
  const { cart, getProductsInCart } = useCartActions();

  useEffect(() => {
    getProductsInCart();
  }, [])

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

      <h1>Cart</h1>
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
            </div>
            <p>Quantity: {product.quantity}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
