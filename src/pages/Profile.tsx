/* eslint-disable react/react-in-jsx-scope */
import { Link, useLoaderData, useNavigate } from "react-router";
import Footer from "../components/Footer.tsx";
import { ArrowLeft, CircleAlert, ShoppingCart } from "lucide-react";
import useUserActions from "../hooks/useUserActions.tsx";
import { useRef, useState } from "react";

export default function Profile() {
  const { user } = useLoaderData();
  const { setIsAuthenticated } = useUserActions();
  const { logout, sendPasswordResetEmail } = useUserActions();
  const [recoveryMessage, setRecoveryMessage] = useState<string>("");
  const [recoveryErrorMessage, setRecoveryErrorMessage] = useState<string>("");
  const resetId = useRef<number | null>(null);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const error = await logout();
    if (error) {
      console.log(error);
    }
    setIsAuthenticated(false);
  }

  const handleResetPassword = async () => {
    const error = await sendPasswordResetEmail(user.email);
    if (error?.status === 429) {
      setRecoveryErrorMessage("Too many attempts. Please wait a few minutes.");
      return;
    }
    setRecoveryMessage("Password reset email sent! Check your inbox.");

    if (resetId.current) {
      clearTimeout(resetId.current);
    }
    resetId.current = setTimeout(() => {
      setRecoveryMessage("");
      if (recoveryErrorMessage) {
        setRecoveryMessage("");
      }
    }, 5000);

  }

  const handleRedirectProducts = () => {
    navigate("/products");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <title>Profile</title>
      <div className="flex flex-wrap items-center justify-between w-full gap-3 p-6">
        <div className="flex items-center shrink-0">
          <button className="cursor-pointer" onClick={() => handleRedirectProducts()}><ArrowLeft /></button>
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

      <main className="grow flex items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded-lg p-8 w-150 mx-auto">
          <img src="/profilePic.png" alt="profile image" className="h-30 rounded-full" />
          <div className="text-center p-4 mt-5">
            <h2 className="text-2xl font-bold">{user.user_metadata.fist_name} {user.user_metadata.last_name}</h2>
            <h1 className="text-2xl font-semibold text-gray-500 p-2">{user.user_metadata.email}</h1>
          </div>

          <button className="flex cursor-pointer border mt-2 text-red-600 border-red-600 px-10 py-2 rounded-full hover:bg-red-600/40 hover:text-white hover:duration-300 transition-colors" onClick={() => handleSignOut()}>

            Sign Out
          </button>

          <div className="flex flex-col items-center justify-center">
            <p className="mt-5 text-[18px]">Forgot your password?</p>
            <button className="cursor-pointer text-[18px] p-2 text-blue-700 text-center" onClick={() => handleResetPassword()}>
              Reset Password
            </button>
          </div>
          {recoveryMessage && <p className="text-green-500 border border-gray-500 rounded-full px-5 py-2 mt-2 text-center flex items-center gap-2"><CircleAlert /> {recoveryMessage}</p>}
          {recoveryErrorMessage && <p className="text-red-500 border border-gray-500 rounded-full px-5 py-2 mt-2 text-center flex items-center gap-2"><CircleAlert /> {recoveryErrorMessage}</p>}
        </div>
      </main >
      <Footer />
    </div >
  );
}
