/* eslint-disable react/react-in-jsx-scope */
import { useRef, useState } from "react";
import { Link } from "react-router";
import Footer from "../components/Footer.tsx";
import useUserActions from "../hooks/useUserActions.tsx";
import { Eye, EyeClosed } from "lucide-react";

interface State {
  email: string;
  password: string;
  name: string;
  lastname: string;
}

export default function Register() {
  const [state, setState] = useState<State>({ email: "", password: "", name: "", lastname: "" });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const timeoutId = useRef<number | null>(null);
  const { register, loginWithGoogle } = useUserActions();
  const [loading, setLoading] = useState<boolean>(false);
  const [authenticateMessage, setAuthenticateMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const error = await register(state.email, state.password, state.name, state.lastname);

    if (error) {
      setErrorMessage(
        error.message.includes("rate limit")
          ? "Too many attempts. Please wait a few minutes."
          : "Something went wrong. Please try again",
      );
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      setLoading(false);
      return;
    }

    setAuthenticateMessage("Please, check your email and validate your account.");
    setLoading(false);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setAuthenticateMessage("");
    }, 3000);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <title>Register</title>
        <main className="grow flex items-center justify-center">
          <div className="border border-gray-200/10 w-130 p-5 py-20 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <img src="/iconN.png" alt="icon image" className="h-10" />
              <h1 className="text-3xl font-semibold  text-center">Register</h1>
            </div>
            <form className="flex flex-col mt-2 justify-center m-auto items-center gap-5 p-10" onSubmit={handleSubmit}>
              <button className="justify-center flex m-auto items-center gap-3 bg-black border border-gray-300/30 rounded-full px-15 py-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={loginWithGoogle}>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-white font-medium">
                  Login with Google
                </span></button>

              <input type="text" placeholder="Your name" className="border bg-black border-gray-300/30 rounded-full w-73 px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 outline-none" value={state.name} onChange={onChange} name="name" required />

              <input type="text" placeholder="Your lastname" className="border bg-black border-gray-300/30 rounded-full w-73 px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 outline-none" value={state.lastname} onChange={onChange} name="lastname" required />

              <input type="text" placeholder="Your@email.com" className="border bg-black border-gray-300/30 rounded-full w-73 px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 outline-none" value={state.email} onChange={onChange} name="email" required />

              <div className="relative w-73">
                <input type={showPassword ? "text" : "password"} placeholder="*******" className="border bg-black border-gray-300/30 rounded-full w-73 px-3 py-2.5 shadow-sm hover:shadow-md outline-none transition-all duration-200" value={state.password} onChange={onChange} name="password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>

              <button className="border py-2 mt-2 rounded-full bg-[rgba(7,75,248,1)] border-gray-500/20 px-5 w-40 justify-center m-auto cursor-pointer hover:bg-blue-700/90 hover:text-white hover:duration-700 transition-colors">{loading ? "Registering..." : "Register"}</button>
            </form>

            <div className="flex text-center flex-col gap-2">
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              {authenticateMessage && <p className="text-green-500">{authenticateMessage}</p>}
            </div>

            <div className="justify-center text-center mt-1">
              <p>Already have an account? </p>
              <Link to='/login' className="cursor-pointer text-blue-700"> Login</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
