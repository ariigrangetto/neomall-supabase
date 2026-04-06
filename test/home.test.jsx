import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Home from '../src/pages/Home.tsx';
import Products from '../src/pages/Products.tsx';
import FilterProvider from '../src/context/FilterContext.tsx';
import LoadingProvider from '../src/context/LoadingErrorContext.tsx';
import CartProvider from '../src/context/CartContext.tsx';
import UserProvider from '../src/context/UserActions.tsx';
import Login from '../src/pages/Login.tsx';

afterEach(() => {
    cleanup();
});

test(`Find "explore products" button`, () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const exploreBtn = screen.getByRole("button", { name: /explore products/i });
    expect(exploreBtn).toBeInTheDocument();
});


test(`Redirect to /products when "explore products" button is clicked`, async () => {
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
    const exploreBtn = screen.getByRole("button", { name: /Explore products/i });
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
    const loginBtn = screen.getByRole("link", { name: /login/i });
    fireEvent.click(loginBtn);
    await waitFor(() => {
        expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    });
});