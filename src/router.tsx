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
import Details from "./pages/Details.tsx";
import NotFound from "./pages/404.tsx";

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
          loader: async () => {
            const { data: session } = await supabase.auth.getSession();
            if (session) {
              return redirect("/products");
            }
          },
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
          path: "/product/:id",
          element: <Details />,
          errorElement: <ErrorPage />
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
        {
          path: "*",
          element: <NotFound />
        }
      ],
    },
  ],
  { basename: "/" },
);
