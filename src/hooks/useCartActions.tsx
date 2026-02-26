import { useState } from "react";
import supabase from "../supabase/client.js";
import type { CartItem } from "../types";

export default function useCartActions() {
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const getProductsInCart = async () => {
    const cartId = await getOrCreateCart();
    const { data, error } = await supabase
      .from("CartItems")
      .select()
      .eq("cart_id", cartId);

    if (error) throw new error();

    setCart(data);
  };

  const addProductToCart = async (productId: number | string) => {
    const cartId = await getOrCreateCart();

    const { data: existingProducts } = await supabase
      .from("CartItems")
      .select()
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .maybeSingle(); //si existe devuelve el objeto, en caso contrario null y no un error como single

    if (existingProducts !== null) {
      const updateQuantity = existingProducts.quantity + 1;
      await supabase
        .from("CartItems")
        .update({ quantity: updateQuantity })
        .eq("product_id", productId)
        .eq("cart_id", cartId)
        .select();
    } else {
      await supabase.from("CartItems").insert({
        product_id: productId,
        cart_id: cartId,
        quantity: 1,
      });
    }

    await getProductsInCart();
  };

  const removeProductFromCart = async (productId: number | string) => {
    const cartId = await getOrCreateCart();
    const { data: existingProducts } = await supabase
      .from("CartItems")
      .select()
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .single();

    if (existingProducts) {
      await supabase
        .from("CartItems")
        .update({ quantity: existingProducts.quantity - 1 })
        .eq("product_id", productId)
        .eq("cart_id", cartId);
    }

    await getProductsInCart();
  };

  const deleteAllProductsInCart = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user.id;

    const { data: cart } = await supabase
      .from("Cart")
      .select()
      .eq("user_id", userId);

    const cartId = cart[0].id;

    await supabase.from("CartItems").delete().eq("cartId", cartId);
  };

  return {
    getOrCreateCart,
    getProductsInCart,
    addProductToCart,
    removeProductFromCart,
    deleteAllProductsInCart,
    cart,
  };
}
