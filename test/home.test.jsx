import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Home from '../src/pages/Home.tsx';
import Products from '../src/pages/Products.tsx';
import FilterProvider from '../src/context/FilterContext.tsx';
import LoadingProvider from '../src/context/LoadingErrorContext.tsx';
import CartProvider from '../src/context/CartContext.tsx';

test(`Finde "explore products" button`, () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const exploreBtn = screen.getByRole("button", { name: /explore products/i });
    expect(exploreBtn).toBeInTheDocument();
});


test(`Redirect to /products when "expolore products" button is clicked`, async () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <FilterProvider>
                <LoadingProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                        </Routes>
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