import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import useUrl from "../hooks/useUrl";
import { MousePointerClick } from "lucide-react";
import supabase from "../supabase/client.js";
import { useState } from "react";

export default function ListOfProducts() {
  const { products } = useUrl();
  const { isAuthenticated } = useAuth();
  const [isProductInCart, setIsProductInCart] = useState<boolean>(false);

  const getOrCreateCart = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user.id;

    const { data: cart } = await supabase
      .from("Cart")
      .select()
      .eq("user_id", userId);

    if (cart.length > 0) {
      return cart[0].id;
    } else {
      const { data: newCart, error } = await supabase
        .from("Cart")
        .insert({ user_id: userId })
        .select();

      if (error) throw error;
      return newCart[0].id;
    }
  };

  const addToCart = async (productId: number | string) => {
    const cartId = await getOrCreateCart();

    //checkeamos que el producto esté en el carrito

    const { data: productInCart } = await supabase
      .from("CartItems")
      .select()
      .eq("cart_id", cartId)
      .eq("product_id", productId);

    if (productInCart.length > 0) {
      const { error } = await supabase
        .from("CartItems")
        .update({ quantity: productInCart[0].quantity + 1 })
        .eq("product_id", productId)
        .eq("cart_id", cartId)
        .select();

      if (error) throw error;
      setIsProductInCart(true);
    } else {
      //si no está en el carrito, lo insertamos
      const { error } = await supabase.from("CartItems").insert({
        cart_id: cartId,
        product_id: productId,
        quantity: 1,
      });

      if (error) throw error;
      setIsProductInCart(true);
    }
  };
  return (
    <>
      {products && products?.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <div className='description'>
                <h2>{product.title}</h2>
                <h3>{product.category}</h3>
                <strong>${product.price}</strong>
                <p>{product.description}</p>
                {isAuthenticated ? (
                  //aquí tengo que fijarme si el producto ya está en el carrito o no
                  <button onClick={() => addToCart(product.id)}>
                    {isProductInCart
                      ? "Agregado al carrito"
                      : "Agregar al carrito"}
                    <i>
                      <MousePointerClick />
                    </i>
                  </button>
                ) : (
                  <Link to='login'>
                    <div>
                      <p>Agregar al carrito</p>
                      <i>
                        <MousePointerClick />
                      </i>
                    </div>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Opps! Parece que ocurrió un error. Vuelva a internalo</p>
      )}
    </>
  );
}
