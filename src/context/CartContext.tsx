import { createContext, useEffect, useState } from "react";
import supabase from "../supabase/client.js"
import type { CartItem } from "../types.d.ts";

interface CartContextType {
    cart: CartItem[];
    loadingProductInCartId: number | string | null;
    addProductToCart: (productId: number | string) => void;
    deleteAllProductsInCart: () => void;
    addToFavorites: (productId: number | string) => void;
    deleteFromFavorites: (productId: number | string) => void;
    incrementQuantity: (productId: number | string) => void;
    deleteProductFromCart: (productId: number | string) => void;
    decrementQuantity: (productId: number | string) => void;

}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loadingProductInCartId, setLoadingProductInCartId] = useState<number | string | null>(null);

    useEffect(() => {
        let channel: any;
        const setupCartSubscription = async (userId: string) => {
            const { data: cartData } = await supabase.from("Cart").select().eq("user_id", userId);

            if (!cartData || cartData.length === 0) return;

            const cartId = cartData[0].id;

            channel = supabase.channel(`cartItems-changes-${cartId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "CartItems",
                        filter: `cart_id=eq.${cartId}`,
                    },
                    () => {
                        getProductsInCart();
                    },
                )
                .subscribe();

            getProductsInCart();
        }


        //onAuthStateChange => eventos de autenticacion en tiempo real
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setupCartSubscription(session.user.id);
            } else {
                setCart([]);
                if (channel) {
                    supabase.removeChannel(channel);
                    channel = null;
                }
            }
        });
        // avoid memory leaks
        return () => {
            if (channel) supabase.removeChannel(channel);
            authSubscription.unsubscribe();
        };
    }, []);

    const getUser = async (): Promise<string> => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
            console.error("Error obteniendo usuario: ", userError.message);
            throw userError;
        }

        const userId = userData?.user.id;
        if (!userId) throw new Error("Usuario no autenticado");
        return userId;
    }

    const getOrCreateCart = async (): Promise<string | number> => {
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
                .eq("cart_id", cartId)
                .order("product_id", { ascending: true });
            if (error) {
                console.error("Error obteniendo productos del carrito:", error.message);
                return;
            }
            setCart(data || []);
        } catch (err: unknown) {
            console.error("Error general en getProductsInCart:", err instanceof Error ? err.message : String(err));
        }
    };


    const addProductToCart = async (productId: number | string) => {
        setLoadingProductInCartId(productId);
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
        } catch (err: unknown) {
            console.error("Error general en addProductToCart:", err instanceof Error ? err.message : String(err));
        } finally {
            setLoadingProductInCartId(null);
        }
    };


    const deleteAllProductsInCart = async () => {
        try {
            const cartId = await getOrCreateCart();
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
        } catch (err: unknown) {
            console.error("Error general en deleteAllProductsInCart:", err instanceof Error ? err.message : String(err));
        }
    };

    const incrementQuantity = async (productId: string | number) => {
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
            }
            await getProductsInCart();
        } catch (err: unknown) {
            console.error("Error general en addProductToCart:", err instanceof Error ? err.message : String(err));
        }
    }

    const decrementQuantity = async (productId: string | number) => {
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
                if (existingProducts.quantity === 1) {
                    return;
                }
                const updateQuantity = existingProducts.quantity - 1;
                const { error: updateError } = await supabase
                    .from("CartItems")
                    .update({ quantity: updateQuantity })
                    .eq("product_id", productId)
                    .eq("cart_id", cartId)
                    .select();
                if (updateError) {
                    console.error("Error actualizando cantidad:", updateError.message);
                }
            }
            await getProductsInCart();
        } catch (err: unknown) {
            console.error("Error general en addProductToCart:", err instanceof Error ? err.message : String(err));
        }
    }


    const deleteFromFavorites = async (productId: string | number) => {
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

    const deleteProductFromCart = async (productId: string | number) => {
        const cartId = await getOrCreateCart();
        try {
            const { error } = await supabase.from("CartItems").delete().eq("product_id", productId).eq("cart_id", cartId)
            if (error) {
                throw error
            }
            await getProductsInCart();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <CartContext.Provider value={{ cart, addProductToCart, incrementQuantity, deleteProductFromCart, decrementQuantity, loadingProductInCartId, deleteAllProductsInCart, addToFavorites, deleteFromFavorites, deleteProductFromCart }}>
            {children}
        </CartContext.Provider>
    )

}