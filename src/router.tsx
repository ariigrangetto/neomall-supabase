/* eslint-disable react/react-in-jsx-scope */
import { createBrowserRouter, redirect } from "react-router";
import { lazy } from "react";
import supabase from "./supabase/client.js";
import ErrorPage from "./pages/ErrorPage.tsx";
import RootLayout from "./layout/RootLayaout.tsx";

const Home = lazy(() => import("./pages/Home.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Details = lazy(() => import("./pages/Details.tsx"));
const NotFound = lazy(() => import("./pages/404.tsx"));
const ResetPassword = lazy(() => import("./pages/resetPassword.tsx"));
const WishList = lazy(() => import("./pages/WishList.tsx"));

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
          path: "/productDetail/:id",
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
          path: "/resetPassword",
          element: <ResetPassword />,
          errorElement: <ErrorPage />,
          loader: async () => {
            const user = await getUser();
            if (!user) return redirect("/login");
            return { user };
          }
        },
        {
          path: "/wishList",
          element: <WishList />,
          errorElement: <ErrorPage />,
          loader: async () => {
            const user = await getUser();
            if (!user) return redirect("/login");
            return { user };
          }
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
