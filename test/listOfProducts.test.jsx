import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import FilterProvider from "../src/context/FilterContext.tsx";
import LoadingProvider from "../src/context/LoadingErrorContext.tsx";
import CartProvider from "../src/context/CartContext.tsx";
import ListOfProducts from "../src/components/ListOfProducts.tsx";
import { vi } from "vitest";
import useUrl from "../src/hooks/useUrl.tsx";
import useCartActions from "../src/hooks/useCartActions.tsx";
import useLoadingAndError from "../src/hooks/useLoadingAndError.tsx";
import useUserActions from "../src/hooks/useUserActions.tsx";
import UserProvider from "../src/context/UserActions.tsx";

afterEach(() => {
    cleanup();
});

//mock hooks

vi.mock("../src/hooks/useUrl.tsx", () => ({
    default: vi.fn()
}));

vi.mock("../src/hooks/useCartActions.tsx", () => ({
    default: vi.fn()
}))

vi.mock("../src/hooks/useLoadingAndError.tsx", () => ({
    default: vi.fn()
}))

vi.mock("../src/hooks/useUserActions.tsx", () => ({
    default: vi.fn()
}))

const mockProduct = {
    id: 1,
    title: "Product 1",
    price: 100,
    image: "https://example.com/product1.jpg",
    description: "Description 1",
    rating: 4.5,
    stock: 10,
}

test(`Find "explore our products" in ListOfProducts component`, async () => {
    useUrl.mockReturnValue({ products: [mockProduct] });
    useLoadingAndError.mockReturnValue({ error: false, loading: false });
    useCartActions.mockReturnValue({ addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), loadingProductInCart: null, cart: [] });
    useUserActions.mockReturnValue({ isAuthenticated: true });

    render(<MemoryRouter initialEntries={["/products"]}>
        <ListOfProducts />
    </MemoryRouter>);

    const heading = await screen.findByRole("heading", { name: /explore our products/i });
    expect(heading).toBeInTheDocument();
});

test("Get error text when there is an error", async () => {
    useUrl.mockReturnValue({ error: true, products: [mockProduct] });
    useLoadingAndError.mockReturnValue({ error: false, loading: false });
    useCartActions.mockReturnValue({ addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), loadingProductInCart: null, cart: [] });
    useUserActions.mockReturnValue({ isAuthenticated: true });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <ListOfProducts />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);

    const errorText = await screen.findByRole("heading", { name: /Oops! Something went wrong/i });
    expect(errorText).toBeInTheDocument();
});

test("Get loading text when loading is true and products is undefined", async () => {
    useUrl.mockReturnValue({ error: false, loading: true, products: undefined });
    useLoadingAndError.mockReturnValue({ error: false, loading: false });
    useCartActions.mockReturnValue({ addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), loadingProductInCart: null, cart: [] });
    useUserActions.mockReturnValue({ isAuthenticated: true });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <ListOfProducts />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);

    const loadingText = await screen.findByRole("heading", { name: /Loading products.../i });
    expect(loadingText).toBeInTheDocument();
});
