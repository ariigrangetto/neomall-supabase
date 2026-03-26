import { render, screen } from "@testing-library/react";
import Products from "../src/pages/Products.tsx";
import { MemoryRouter } from "react-router";
import FilterProvider from "../src/context/FilterContext.tsx";
import LoadingProvider from "../src/context/LoadingErrorContext.tsx";
import CartProvider from "../src/context/CartContext.tsx";
import UserProvider from "../src/context/UserActions.tsx";

test(`Find "category" select`, () => {
    render(<MemoryRouter>
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
    const categoryBtn = screen.getByRole("combobox", { name: /category/i });
    expect(categoryBtn).toBeInTheDocument();
});

test(`Find "search" input`, () => {
    render(<MemoryRouter>
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
    const searchInput = screen.getByRole("textbox", { name: /search/i });
    expect(searchInput).toBeInTheDocument();
});

test(`Find cart link`, () => {
    render(<MemoryRouter>
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
    const cartBtn = screen.getByRole("link", { name: /cart/i });
    expect(cartBtn).toBeInTheDocument();
});

test(`Find user profile link`, () => {
    render(<MemoryRouter>
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
    const profileBtn = screen.getByRole("img", { name: /profilePic/i });
    expect(profileBtn).toBeInTheDocument();
});



