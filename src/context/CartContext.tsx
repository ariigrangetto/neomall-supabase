/* eslint-disable react/react-in-jsx-scope */
import { createContext, useEffect, useState } from "react";
import supabase from "../supabase/client.js"
import type { CartItem, Rating, WishList } from "../types.d.ts";
import { useMemo } from "react";

interface CartContextType {
    cart: CartItem[];
    loadingProductInCartId: number | string | null;
    addProductToCart: (productId: number | string) => Promise<void | undefined>;
    deleteAllProductsInCart: () => Promise<void | undefined>;
    addToFavorites: (productId: number | string) => Promise<void | undefined>;
    deleteFromFavorites: (productId: number | string) => Promise<void | undefined>;
    deleteProductFromCart: (productId: number | string) => Promise<void | undefined>;
    getProductReviews: (productId: number | string) => Promise<Rating[] | undefined>;
    decrementQuantity: (productId: number | string) => Promise<void | undefined>;
    wishUserList: WishList[];
    wishList: (targetUserId: string | null) => Promise<void | undefined>;
    incrementQuantity: (productId: number | string) => Promise<void | undefined>;
    cartItemsMap: Map<number | string | undefined, CartItem>;
    wishListMap: Map<number | string | undefined, WishList>;
    loadingCart: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartItem[] | undefined>();
    const [loadingProductInCartId, setLoadingProductInCartId] = useState<number | string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [cartId, setCartId] = useState<string | number | null>(null);
    const [wishUserList, setWishUserList] = useState<WishList[]>([]);
    const [loadingCart, setLoadingCart] = useState<boolean>(false);

    useEffect(() => {
        let cartChannel: any;
        let wishListChannel: any;
        let cartAuthSub: any;
        let wishAuthSub: any;

        function cartChannelSubscribe() {
            const setupCartSubscription = async (currentUserId: string) => {
                let currentCartId = null;
                const { data: cartData } = await supabase.from("Cart").select().eq("user_id", currentUserId);

                if (!cartData || cartData.length === 0) {
                    const { data: newCart, error } = await supabase.from("Cart").insert({ user_id: currentUserId }).select();
                    if (!error && newCart) {
                        currentCartId = newCart[0].id;
                    }
                } else {
                    currentCartId = cartData[0].id;
                }

                if (!currentCartId) return;
                setCartId(currentCartId);

                cartChannel = supabase.channel(`cartItems-changes-${currentCartId}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "CartItems",
                            filter: `cart_id=eq.${currentCartId}`,
                        },
                        async () => {
                            await getProductsInCart(currentCartId);
                        },
                    )
                    .subscribe();
                await getProductsInCart(currentCartId);
            }

            // onAuthStateChange => eventos de autenticacion en tiempo real
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    setUserId(session.user.id);
                    setupCartSubscription(session.user.id);
                } else {
                    setUserId(null);
                    setCartId(null);
                    setCart([]);
                    if (cartChannel) {
                        supabase.removeChannel(cartChannel);
                        cartChannel = null;
                    }
                }
            });
            cartAuthSub = subscription;
        }
        cartChannelSubscribe();

        function wishListChannelSubscribe() {
            let wishListChannel: any;
            const setupWishListSubscription = async (currentUserId: string) => {
                const { data: wishListData } = await supabase.from("wishList").select().eq("user_id", currentUserId);
                if (!wishListData || wishListData.length === 0) return;

                wishListChannel = supabase.channel(`wishListTable-changes-${currentUserId}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "wishList",
                            filter: `user_id=eq.${currentUserId}`,
                        },
                        async () => {
                            console.log("wishList changed");
                            await wishList(currentUserId);
                        },
                    )
                    .subscribe();
                await wishList(currentUserId);
            }

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    setupWishListSubscription(session.user.id);
                } else {
                    setWishUserList([]);
                    if (wishListChannel) {
                        supabase.removeChannel(wishListChannel);
                        wishListChannel = null;
                    }
                }
            });
            wishAuthSub = subscription;
        }
        wishListChannelSubscribe();

        return () => {
            if (cartChannel) supabase.removeChannel(cartChannel);
            if (wishListChannel) supabase.removeChannel(wishListChannel);
            if (cartAuthSub) cartAuthSub.unsubscribe();
            if (wishAuthSub) wishAuthSub.unsubscribe();
        }
    }, []);

    const getProductsInCart = async (targetCartId?: string | number | null) => {
        const idToUse = targetCartId !== undefined ? targetCartId : cartId;
        if (!idToUse) return;
        try {
            setLoadingCart(true);
            const { data, error } = await supabase
                .from("CartItems")
                .select("*, Products (*)")
                .eq("cart_id", idToUse)
                .order("product_id", { ascending: true });
            if (error) {
                console.error("Error fetching products in cart:", error.message);
                return;
            }
            setCart(data);
        } catch (err: unknown) {
            console.error("General error in getProductsInCart:", err instanceof Error ? err.message : String(err));
        } finally {
            setLoadingCart(false);
        }
    };

    const addProductToCart = async (productId: number | string) => {
        if (!cartId) return;
        setLoadingProductInCartId(productId);
        //optimistic update
        try {
            setCart((prev) => [...prev, { id: crypto.randomUUID(), cart_id: cartId, product_id: productId, quantity: 1, date: Date.now().toString() }]);
            const { data: existingProducts, error: existError } = await supabase
                .from("CartItems")
                .select()
                .eq("cart_id", cartId)
                .eq("product_id", productId)
                .maybeSingle();
            if (existError) {
                console.error(
                    "Error searching product in cart:",
                    existError.message,
                );
                return;
            }
            if (existingProducts === null) {
                await updateQuantity(productId);
            }
        } catch (err: unknown) {
            console.error("General error in addProductToCart:", err instanceof Error ? err.message : String(err));
        } finally {
            setLoadingProductInCartId(null);
        }
    };

    const incrementQuantity = async (productId: string | number) => {
        if (!cartId) return;
        try {
            const { data: productInCart, error: productNotFoundError } = await supabase.from("CartItems")
                .select()
                .eq("product_id", productId)
                .eq("cart_id", cartId)
            if (productNotFoundError) {
                console.error("Error searching product in cart:", productNotFoundError.message);
            }
            if (productInCart && productInCart.length > 0) {
                const updateQuantity = productInCart[0].quantity + 1;
                try {
                    const { error: updateError } = await supabase.from("CartItems").update({ quantity: updateQuantity }).eq("product_id", productId).eq("cart_id", cartId)
                    if (updateError) {
                        console.error("Error updating quantity:", updateError.message);
                    }
                } catch (error) {
                    console.error("General error in updateQuantity:", error instanceof Error ? error.message : String(error));
                }
            }
        } catch (err: unknown) {
            console.error("General error in incrementing quantity:", err instanceof Error ? err.message : String(err));
        }
    }

    const updateQuantity = async (productId: string | number) => {
        if (!cartId) return;
        console.log(productId);
        try {
            const { error: insertError } = await supabase.from("CartItems").insert({
                product_id: productId,
                cart_id: cartId,
                quantity: 1,
            }).select()
            if (insertError) {
                console.error("Error updating quantity:", insertError.message);
            }
        } catch (err: unknown) {
            console.error("General error in updateQuantity:", err instanceof Error ? err.message : String(err));
        }
    }


    const deleteAllProductsInCart = async () => {
        if (!cartId) return;
        try {
            const { error: deleteError } = await supabase
                .from("CartItems")
                .delete()
                .eq("cart_id", cartId);
            if (deleteError) {
                console.error(
                    "Error deleting products in cart:",
                    deleteError.message,
                );
            }
            //optimistic update
            setCart([]);
        } catch (err: unknown) {
            console.error("General error in deleteAllProductsInCart:", err instanceof Error ? err.message : String(err));
        }
    }

    const decrementQuantity = async (productId: string | number) => {
        if (!cartId) return;
        try {
            const { data: existingProducts, error: existError } = await supabase
                .from("CartItems")
                .select()
                .eq("cart_id", cartId)
                .eq("product_id", productId)
            if (existError) {
                console.error(
                    "Error searching product in cart:",
                    existError.message,
                );
                return;
            }
            if (existingProducts !== null && existingProducts[0].quantity > 1) {
                try {
                    const updateQuantity = existingProducts[0].quantity - 1;
                    const { error } = await supabase.from("CartItems").update({ quantity: updateQuantity }).eq("product_id", productId).eq("cart_id", cartId).select()
                    if (error) {
                        console.error("Error updating quantity:", error.message)
                    }
                } catch (error) {
                    console.error("General error in decrementQuantity:", error instanceof Error ? error.message : String(error));
                }
            }
            else {
                await deleteProductFromCart(productId)
            }
        } catch (error: unknown) {
            console.error("General error in decrementQuantity:", error instanceof Error ? error.message : String(error));
        }
    }

    const deleteProductFromCart = async (productId: string | number) => {
        if (!cartId) return;
        setCart((prev) => prev.filter((item) => item.product_id !== productId))
        try {
            const { error: deleteError } = await supabase.from("CartItems").delete().eq("product_id", productId).eq("cart_id", cartId)
            if (deleteError) {
                console.error("Error deleting product from cart:", deleteError.message)
            }
        } catch (error: unknown) {
            console.error("General error in deleteProductFromCart:", error instanceof Error ? error.message : String(error))
        }
    }

    const getProductReviews = async (productId: string | number) => {
        try {
            const { data, error } = await supabase.from("Rating").select().eq("product_id", productId)
            if (error) {
                console.error("Error fetching product reviews:", error.message)
            }
            return data;
        } catch (error: unknown) {
            console.error("General error in getProductReviews:", error instanceof Error ? error.message : String(error))
        }
    }

    //Favorite section

    const wishList = async (targetUserId?: string | null) => {
        const idToUse = targetUserId !== undefined ? targetUserId : userId;
        if (!idToUse) return;
        try {
            const { data, error } = await supabase.from("wishList").select("*, Products(*)").eq("user_id", idToUse)
            if (error) {
                console.error("Error fetching wishlist:", error.message)
            }
            setWishUserList(data || []);
            return;
        } catch (error: unknown) {
            console.error("General error in getWishList:", error instanceof Error ? error.message : String(error))
        }
    }

    const deleteFromFavorites = async (productId: string | number) => {
        if (!userId) return;
        //optimistic update
        setWishUserList((prev) => prev.filter((item) => item.product_id !== productId));
        try {
            const { error } = await supabase.from("wishList").delete().eq("user_id", userId).eq("product_id", productId)
            if (error) {
                console.error("Error deleting from wishlist:", error.message)
            }
        } catch (error: unknown) {
            console.error("General error in deleteFromFavorites:", error instanceof Error ? error.message : String(error))
        }
    }

    const addToFavorites = async (productId: number | string) => {
        if (!userId) return;
        //optimistic update
        setWishUserList((prev) => [...prev, {
            id: crypto.randomUUID(), user_id: userId, product_id: productId, date: Date.now().toString()
        }])
        try {
            const { error } = await supabase.from("wishList").insert({ user_id: userId, product_id: productId })
            if (error) {
                console.error("Error adding to wishlist:", error.message)
            }
        } catch (error: unknown) {
            console.error("General error in addToFavorites:", error instanceof Error ? error.message : String(error))
        }
    }

    const cartItemsMap = useMemo(() => {
        const map = new Map<number | string | undefined, CartItem>();
        if (cart) {
            cart.forEach((item) => {
                map.set(item.product_id, item);
            })
        }
        return map;
    }, [cart]);

    const wishListMap = useMemo(() => {
        const map = new Map<number | string | undefined, WishList>();
        if (wishUserList) {
            wishUserList.forEach(item => {
                map.set(item.product_id, item);
            });
        }
        return map;
    }, [wishUserList]);


    //avoiding unnecessary re-renders
    const contextValue = useMemo(() => ({
        cart, addProductToCart, deleteProductFromCart, loadingProductInCartId, deleteAllProductsInCart, addToFavorites, deleteFromFavorites, wishList, getProductReviews, incrementQuantity, decrementQuantity, wishUserList, cartItemsMap, wishListMap, loadingCart
    }), [cart, loadingProductInCartId, wishUserList, cartItemsMap, wishListMap, loadingCart]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )

}