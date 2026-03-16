import { useState, useEffect } from "react";
import supabase from "../supabase/client.js";
import type { CartItem } from "../types";

export default function useCartActions() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // comunication in real time with CartItems
  useEffect(() => {
    let channel: any;
    const subscribe = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user.id;
      if (!userId) return;
      const { data: cartData } = await supabase
        .from("Cart")
        .select()
        .eq("user_id", userId);
      if (!cartData || cartData.length === 0) return;
      const cartId = cartData[0].id;
      channel = supabase
        .channel("cartitems-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "CartItems",
            filter: `cart_id=eq.${cartId}`,
          },
          (payload) => {
            getProductsInCart();
          },
        )
        .subscribe();
    };
    subscribe();
    // avoid memory leaks
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const getUser = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error obteniendo usuario: ", userError.messsage);
      throw userError;
    }

    const userId = userData?.user.id;
    if (!userId) throw new Error("Usuario no autenticado");
    return userId;
  }

  const getOrCreateCart = async () => {
    const userId = await getUser();
    const { data: cart, error: cartError } = await supabase
      .from("Cart")
      .select()
      .eq("user_id", userId);
    if (cartError) {
      console.error("Error obteniendo carrito:", cartError.message);
      throw cartError;
    }
    if (cart && cart.length > 0) {
      return cart[0].id;
    } else {
      const { data: newCart, error } = await supabase
        .from("Cart")
        .insert({ user_id: userId })
        .select();
      if (error) {
        console.error("Error creando carrito:", error.message);
        throw error;
      }
      return newCart[0].id;
    }
  };

  const getProductsInCart = async () => {
    try {
      const cartId = await getOrCreateCart();
      const { data, error } = await supabase
        .from("CartItems")
        .select("*, Products (*)")
        .eq("cart_id", cartId);
      if (error) {
        console.error("Error obteniendo productos del carrito:", error.message);
        return;
      }
      setCart(data || []);
    } catch (err: any) {
      console.error("Error general en getProductsInCart:", err.message);
    }
  };

  const addProductToCart = async (productId: number | string) => {
    try {
      const cartId = await getOrCreateCart();
      const { data: existingProducts, error: existError } = await supabase
        .from("CartItems")
        .select()
        .eq("cart_id", cartId)
        .eq("product_id", productId)
        .maybeSingle();
      if (existError) {
        console.error(
          "Error buscando producto en carrito:",
          existError.message,
        );
        return;
      }
      if (existingProducts !== null) {
        const updateQuantity = existingProducts.quantity + 1;
        const { error: updateError } = await supabase
          .from("CartItems")
          .update({ quantity: updateQuantity })
          .eq("product_id", productId)
          .eq("cart_id", cartId)
          .select();
        if (updateError) {
          console.error("Error actualizando cantidad:", updateError.message);
        }
      } else {
        const { error: insertError } = await supabase.from("CartItems").insert({
          product_id: productId,
          cart_id: cartId,
          quantity: 1,
        });
        if (insertError) {
          console.error("Error insertando producto:", insertError.message);
        }
      }
      await getProductsInCart();
    } catch (err: any) {
      console.error("Error general en addProductToCart:", err.message);
    }
  };

  const removeProductFromCart = async (productId: number | string) => {
    try {
      const cartId = await getOrCreateCart();
      const { data: existingProducts, error: existError } = await supabase
        .from("CartItems")
        .select()
        .eq("cart_id", cartId)
        .eq("product_id", productId)
        .single();
      if (existError) {
        console.error(
          "Error buscando producto para eliminar:",
          existError.message,
        );
        return;
      }
      if (existingProducts) {
        const { error: updateError } = await supabase
          .from("CartItems")
          .update({ quantity: existingProducts.quantity - 1 })
          .eq("product_id", productId)
          .eq("cart_id", cartId);
        if (updateError) {
          console.error(
            "Error actualizando cantidad al eliminar:",
            updateError.message,
          );
        }
      }
      await getProductsInCart();
    } catch (err: any) {
      console.error("Error general en removeProductFromCart:", err.message);
    }
  };

  const deleteAllProductsInCart = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error obteniendo usuario:", userError.message);
        return;
      }
      const userId = userData?.user.id;
      if (!userId) throw new Error("Usuario no autenticado");
      const { data: cart, error: cartError } = await supabase
        .from("Cart")
        .select()
        .eq("user_id", userId);
      if (cartError) {
        console.error("Error obteniendo carrito:", cartError.message);
        return;
      }
      const cartId = cart[0].id;
      const { error: deleteError } = await supabase
        .from("CartItems")
        .delete()
        .eq("cart_id", cartId);
      if (deleteError) {
        console.error(
          "Error eliminando productos del carrito:",
          deleteError.message,
        );
      }
    } catch (err: any) {
      console.error("Error general en deleteAllProductsInCart:", err.message);
    }
  };

  const deleteFromFavorites = async (productId: string | number) => {
    console.log("delete working")
    const cartId = await getOrCreateCart();
    try {
      const { error } = await supabase.from("CartItems").update({ fav: false }).eq("product_id", productId).eq("cart_id", cartId)
      if (error) {
        throw error
      }
      await getProductsInCart();
    } catch (error) {
      console.log(error)
    }
  }

  const addToFavorites = async (productId: string | number) => {
    await getProductsInCart();
    console.log("add working")
    const cartId = await getOrCreateCart();
    try {
      const { error } = await supabase.from("CartItems").update({ fav: true }).eq("product_id", productId).eq("cart_id", cartId)
      if (error) {
        throw error
      }
      await getProductsInCart();
    } catch (error) {
      console.log(error)
    }
  }

  return {
    getOrCreateCart,
    getProductsInCart,
    addProductToCart,
    removeProductFromCart,
    deleteAllProductsInCart,
    cart,
    deleteFromFavorites,
    addToFavorites
  };
}
