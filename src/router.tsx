import { createBrowserRouter, redirect } from "react-router";
import Home from "./pages/Home.tsx";
import Products from "./pages/Products.tsx";
import Cart from "./pages/Cart.tsx";
import supabase from "./supabase/client.js";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Profile from "./pages/Profile.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import RootLayout from "./layout/RootLayaout.tsx";

const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/login",
          element: <Login />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/register",
          element: <Register />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/products",
          element: <Products />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/cart",
          element: <Cart />,
          errorElement: <ErrorPage />,
          loader: async () => {
            const user = await getUser();
            if (!user) return redirect("/login");
            return {};
          },
        },
        {
          path: "/profile",
          element: <Profile />,
          errorElement: <ErrorPage />,
          loader: async () => {
            const user = await getUser();
            if (!user) return redirect("/login");
            return { user };
          },
        },
      ],
    },
  ],
  { basename: "/" },
);
