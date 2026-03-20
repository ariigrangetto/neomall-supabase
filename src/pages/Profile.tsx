/* eslint-disable react/react-in-jsx-scope */
import { Link, useLoaderData } from "react-router";
import Footer from "../components/Footer.tsx";
import supabase from "../supabase/client.js"
import useAuth from "../hooks/useAuth.tsx";
import { ShoppingCart } from "lucide-react";

export default function Profile() {
  const { user } = useLoaderData();
  const { setIsAuthenticated } = useAuth();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    setIsAuthenticated(false);
  }

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) {
      console.log(error);
    }
  }

  console.log(user);
  return (
    <div className="min-h-screen flex flex-col">
      <title>Profile</title>
      <div className="flex flex-wrap items-center justify-between w-full gap-3 p-6">

        <div className="flex items-center shrink-0">
          <nav className="flex items-center text-center gap-2">
            <img src="/iconN.png" alt="ICON IMAGE" className="h-8" />
            <h1 className="font-bold text-xl">Neomall</h1>
          </nav>
        </div>

        <div className="flex items-center shrink-0 gap-3">
          <nav className="w-10 text-center">
            <Link to="/cart">
              <ShoppingCart size={25} aria-label="cart" />
            </Link>
          </nav>

        </div>
      </div>

      <main className="flex-1 justify-center m-auto flex">
        <div className="flex flex-col items-center justify-center border border-gray-300/10 rounded-lg p-8 w-150 mx-auto">
          <img src="/profilePic.png" alt="profile image" className="h-30 rounded-full" />
          <div className="text-center p-4 mt-5">
            <h2 className="text-2xl font-bold">{user.user_metadata.fist_name} {user.user_metadata.last_name}</h2>
            <h1 className="text-2xl font-bold">{user.user_metadata.email}</h1>
          </div>

          <button className="flex cursor-pointer border mt-5 text-red-600 border-red-600 px-10 py-2 rounded-full hover:bg-red-600/40 hover:text-white hover:duration-300 transition-colors" onClick={() => handleSignOut()}>

            Sign Out
          </button>
          <p className="mt-5">Forgot your password?</p>
          <button className="" onClick={() => handleResetPassword()}>

            Reset Password
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
