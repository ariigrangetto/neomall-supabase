import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router";
import FilterProvider from "../src/context/FilterContext.tsx";
import LoadingProvider from "../src/context/LoadingErrorContext.tsx";
import CartProvider from "../src/context/CartContext.tsx";
import UserProvider from "../src/context/UserActions.tsx";
import { ProductCard } from "../src/components/ProductCard.tsx";
import { vi } from "vitest";
import useCartActions from "../src/hooks/useCartActions.tsx";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockProduct = {
    id: 1,
    title: "Product 1",
    price: 100,
    image: "https://example.com/product1.jpg",
    description: "Description 1",
    rating: 4.5,
    stock: 10,
}

vi.mock("../src/hooks/useCartActions.tsx", () => ({
    default: vi.fn()
}))

test(`Find "add to cart" button in product card`, () => {
    useCartActions.mockReturnValue({ wishUserList: [], addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), deleteProductFromCart: vi.fn(), deleteFromFavorites: vi.fn() });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <ProductCard product={mockProduct} isAuthenticated={true} isLoading={false} inCartInfo={{ inCart: false, className: "" }} />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
    fireEvent.click(addToCartBtn);
})

test("Call delete from cart when user is authenticated and product is in cart", () => {
    const mockDeleteProductFromCart = vi.fn();
    useCartActions.mockReturnValue({ wishUserList: [], addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), deleteProductFromCart: mockDeleteProductFromCart, deleteFromFavorites: vi.fn() });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <ProductCard product={mockProduct} isAuthenticated={true} isLoading={false} inCartInfo={{ inCart: true, className: "" }} />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>)
    const removeBtn = screen.getByRole("button", { name: /Remove from cart/i });
    fireEvent.click(removeBtn);
    expect(mockDeleteProductFromCart).toHaveBeenCalledWith(mockProduct.id);
})


test(`Call "handleClickLogin" when "add to cart" button is clicked and user is not authenticated`, async () => {
    useCartActions.mockReturnValue({ wishUserList: [], addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), deleteProductFromCart: vi.fn(), deleteFromFavorites: vi.fn() });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <ProductCard product={mockProduct} isAuthenticated={false} isLoading={false} inCartInfo={{ inCart: false, className: "" }} />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const addToCartBtn = screen.getByRole("button", { name: /Add to cart/i });
    fireEvent.click(addToCartBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
});
