import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import Products from "./pages/Products.tsx";
import Register from "./pages/Register.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Profile from "./pages/Profile.tsx";
import { lazy, Suspense } from "react";
import Loading from "./pages/Loading.tsx";

const Details = lazy(() => import("./pages/Details.tsx"));
const NotFound = lazy(() => import("./pages/404.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/login' element={<Login />} />
          <Route path='/Register' element={<Register />} />

          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path='/products' element={<Products />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

// 1- npm install @supabase/supabase-js
