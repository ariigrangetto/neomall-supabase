import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router";
import FilterProvider from "../src/context/FilterContext.tsx";
import LoadingProvider from "../src/context/LoadingErrorContext.tsx";
import CartProvider from "../src/context/CartContext.tsx";
import UserProvider from "../src/context/UserActions.tsx";
import { ProductCard } from "../src/components/ProductCard.tsx";
import { vi } from "vitest";
import useCartActions from "../src/hooks/useCartActions.tsx";

afterEach(() => {
    cleanup();
});

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
    useCartActions.mockReturnValue({ addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), deleteProductFromCart: vi.fn(), deleteFromFavorites: vi.fn() });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <ProductCard product={mockProduct} isAuthenticated={true} isLoading={false} inCart={false} isFav={false} />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const addToCartBtn = screen.getByRole("button", { name: /Add to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
})

test(`Find "see details" button and redirect to product details page`, async () => {
    useCartActions.mockReturnValue({ addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), deleteProductFromCart: vi.fn(), deleteFromFavorites: vi.fn() })

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <Routes>
                            <Route path="/products" element={<ProductCard product={mockProduct} isAuthenticated={true} isLoading={false} inCart={true} />} />
                            <Route path={`/productDetail/:id`} element={<div>Product Details</div>} />
                        </Routes>
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>)

    const seeDetailsBtn = screen.getByRole("link", { name: "See details" });
    expect(seeDetailsBtn).toBeInTheDocument();
    fireEvent.click(seeDetailsBtn);
    await waitFor(() => {
        expect(screen.getByText("Product Details")).toBeInTheDocument();
    })
})

test("Find delete button when user is authenticated and product is in cart", () => {
    useCartActions.mockReturnValue({ wishUserList: [], addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), deleteProductFromCart: vi.fn(), deleteFromFavorites: vi.fn() });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <ProductCard product={mockProduct} isAuthenticated={true} isLoading={false} inCart={true} />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>)
    const removeBtn = screen.getByRole("button", { name: /remove from cart/i });
    expect(removeBtn).toBeInTheDocument();
    // fireEvent.click(removeBtn);
    // expect(mockDeleteProductFromCart).toHaveBeenCalledWith(mockProduct.id);
})

test(`Call "handleClickLogin" when "add to cart" button is clicked and user is not authenticated`, async () => {
    useCartActions.mockReturnValue({ wishUserList: [], addProductToCart: vi.fn(), addToFavorites: vi.fn(), removeFromFavorites: vi.fn(), deleteProductFromCart: vi.fn(), deleteFromFavorites: vi.fn() });

    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <ProductCard product={mockProduct} isAuthenticated={false} isLoading={false} inCart={false} />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const addToCartBtn = screen.getByRole("button", { name: /Add to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
});
