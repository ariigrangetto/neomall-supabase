import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import FilterProvider from "../src/context/FilterContext.tsx";
import LoadingProvider from "../src/context/LoadingErrorContext.tsx";
import CartProvider from "../src/context/CartContext.tsx";
import ListOfProducts from "../src/components/ListOfProducts.tsx";
import Login from "../src/pages/Login.tsx";
import { vi } from "vitest";

import useAuth from "../src/hooks/useAuth.tsx";
import useUrl from "../src/hooks/useUrl.tsx";
import useCartActions from "../src/hooks/useCartActions.tsx";
import useLoadingAndError from "../src/hooks/useLoadingAndError.tsx";

//mock hooks
vi.mock("../src/hooks/useAuth.tsx", () => ({
    default: vi.fn()
}));

vi.mock("../src/hooks/useUrl.tsx", () => ({
    default: vi.fn()
}));

vi.mock("../src/hooks/useCartActions.tsx", () => ({
    default: vi.fn()
}))

vi.mock("../src/hooks/useLoadingAndError.tsx", () => ({
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

const MockLogin = () => <div>Login page loaded</div>



test(`navigate to login when "add to cart" button is clicked and user is not authenticated`, async () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    useUrl.mockReturnValue({ products: [mockProduct] });
    useLoadingAndError.mockReturnValue({ error: false, loading: false });
    useCartActions.mockReturnValue({ addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), loadingProductInCart: null, cart: [] });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/products" element={<ListOfProducts />} />
                        <Route path="/login" element={<MockLogin />} />
                    </Routes>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const addToCartBtn = screen.getAllByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartBtn[0]);
    await waitFor(() => {
        expect(screen.getByText("Login page loaded")).toBeInTheDocument();
    });
});