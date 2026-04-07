import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Home from '../src/pages/Home.tsx';
import Products from '../src/pages/Products.tsx';
import FilterProvider from '../src/context/FilterContext.tsx';
import LoadingProvider from '../src/context/LoadingErrorContext.tsx';
import CartProvider from '../src/context/CartContext.tsx';
import UserProvider from '../src/context/UserActions.tsx';
import Login from '../src/pages/Login.tsx';
import useUserActions from '../src/hooks/useUserActions.tsx';
import useUrl from '../src/hooks/useUrl.tsx';

afterEach(() => {
    cleanup();
});

vi.mock("../src/hooks/useUserActions.tsx", () => ({
    default: vi.fn()
}));

vi.mock("../src/hooks/useUrl.tsx", () => ({
    default: vi.fn()
}));

test(`Find "explore products" button`, async () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const exploreBtn = await screen.findByRole("button", { name: /explore products/i });
    expect(exploreBtn).toBeInTheDocument();
});


test(`Redirect to /products when "explore products" button is clicked`, async () => {
    useUserActions.mockReturnValue({ isAuthenticated: false });
    useUrl.mockReturnValue({ 
        products: [{ id: "1", title: "Test Product", category: "beauty" }], 
        loading: false, 
        error: false 
    });
    render(
        <MemoryRouter initialEntries={["/"]}>
            <FilterProvider>
                <LoadingProvider>
                    <CartProvider>
                        <UserProvider>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Products />} />
                            </Routes>
                        </UserProvider>
                    </CartProvider>
                </LoadingProvider>
            </FilterProvider>
        </MemoryRouter>
    );
    const exploreBtn = await screen.findByRole("button", { name: /explore products/i });
    fireEvent.click(exploreBtn);
    await waitFor(() => {
        expect(screen.getByText("Explore our products")).toBeInTheDocument();
    });
});


test(`Find "login" link`, async () => {
    render(<MemoryRouter initialEntries={["/"]}>
        <FilterProvider>
            <LoadingProvider>
                <CartProvider>
                    <UserProvider>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/login' element={<Login />} />
                        </Routes>
                    </UserProvider>

                </CartProvider>
            </LoadingProvider>
        </FilterProvider>
    </MemoryRouter>);
    const loginBtn = await screen.findByRole("link", { name: /login/i });
    fireEvent.click(loginBtn);
    await waitFor(() => {
        expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    });
});