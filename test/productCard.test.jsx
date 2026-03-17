import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router";
import FilterProvider from "../src/context/FilterContext.tsx";
import LoadingProvider from "../src/context/LoadingErrorContext.tsx";
import CartProvider from "../src/context/CartContext.tsx";
import { ProductCard } from "../src/components/ProductCard.tsx";
import { vi } from "vitest";
import Login from "../src/pages/Login.tsx";

const mockProduct = {
    id: 1,
    title: "Product 1",
    price: 100,
    image: "https://example.com/product1.jpg",
    description: "Description 1",
    rating: 4.5,
    stock: 10,
}

test(`Find "add to cart" button in product card`, () => {
    render(<MemoryRouter>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <ProductCard product={mockProduct} />
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
})


test(`Call "handleClickLogin" when "add to cart" button is clicked and user is not authenticated`, async () => {
    const mockHandleClickLogin = vi.fn(); //esta es una mock funcion
    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <ProductCard product={mockProduct} isAuthenticated={false} handleClickLogin={mockHandleClickLogin} />
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartBtn);
    expect(mockHandleClickLogin).toHaveBeenCalled();
});