import { render, screen, cleanup, act } from "@testing-library/react";
import Products from "../src/pages/Products.tsx";
import { MemoryRouter } from "react-router";
import FilterProvider from "../src/context/FilterContext.tsx";
import LoadingProvider from "../src/context/LoadingErrorContext.tsx";
import CartProvider from "../src/context/CartContext.tsx";
import UserProvider from "../src/context/UserActions.tsx";

afterEach(() => {
    cleanup();
});

test(`Find "category" select`, async () => {
    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <Products />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const categoryBtn = await screen.findByRole("combobox", { name: /category/i });
    expect(categoryBtn).toBeInTheDocument();
});

test(`Find "search" input`, async () => {
    render(<MemoryRouter initialEntries={["/products"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <Products />
                    </UserProvider>
                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const searchInput = await screen.findByRole("textbox", { name: /search/i });
    expect(searchInput).toBeInTheDocument();
});

test(`Find cart link`, async () => {
    act(() => {
        render(<MemoryRouter initialEntries={["/products"]}>
            <FilterProvider>
                <LoadingProvider>
                    <CartProvider>
                        <UserProvider>
                            <Products />
                        </UserProvider>
                    </CartProvider>
                </LoadingProvider>
            </FilterProvider>
        </MemoryRouter>);
    });
    const cartBtn = await screen.findByRole("link", { name: /cart/i });
    expect(cartBtn).toBeInTheDocument();
});

test(`Find user profile link`, async () => {
    act(() => {
        render(<MemoryRouter initialEntries={["/products"]}>
            <FilterProvider>
                <LoadingProvider>
                    <CartProvider>
                        <UserProvider>
                            <Products />
                        </UserProvider>
                    </CartProvider>
                </LoadingProvider>
            </FilterProvider>
        </MemoryRouter>);
    });
    const profileBtn = await screen.findByRole("img", { name: /profilePic/i });
    expect(profileBtn).toBeInTheDocument();
});



