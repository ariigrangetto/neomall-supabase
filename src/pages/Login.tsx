/* eslint-disable react/react-in-jsx-scope */
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import useUserActions from "../hooks/useUserActions.tsx";
import Footer from "../components/Footer.tsx";
import { Eye, EyeClosed } from "lucide-react";


interface State {
  email: string;
  password: string;

}

export default function Login() {
  const [state, setState] = useState<State>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login, setIsAuthenticated, loginWithGoogle } = useUserActions();
  const timeout = useRef<number | null>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const error = await login(state.email, state.password);

    setLoading(false);

    if (error) {
      setErrorMessage(
        error.status === 400
          ? "La cuenta que ingresó aún no existe"
          : "Algo salió mal. Intente nuevamente!",
      );
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }

    setIsAuthenticated(true);
    navigate("/products");
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <title>Login</title>
      <main className="grow flex items-center justify-center">
        <div className="border border-gray-200/10 w-130 p-5 py-20 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => navigate("/")}>
              <img src="/iconN.png" alt="icon image" className="h-10" />
            </button>
            <h1 className="text-3xl font-semibold  text-center">Login</h1>
          </div>
          <form className="flex flex-col justify-center m-auto items-center gap-4 p-10" onSubmit={handleSubmitForm}>
            <button className="justify-center flex m-auto items-center gap-3 bg-black border border-gray-300/30 rounded-full px-15 py-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={loginWithGoogle}>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-white font-medium">
                Login with Google
              </span></button>
            <input type="text" placeholder="Your@email.com" className="border bg-black border-gray-300/30 rounded-full w-73 px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 outline-none" value={state.email} onChange={onChange} name="email" required />
            <div className="relative w-73">
              <input type={showPassword ? "text" : "password"} placeholder="*******" className="border bg-black border-gray-300/30 rounded-full w-73 px-3 py-2.5 shadow-sm hover:shadow-md outline-none transition-all duration-200 " value={state.password} onChange={onChange} name="password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </button>
            </div>
            <button className="border py-2 mt-2 rounded-full bg-[rgba(7,75,248,1)] border-gray-500/20 px-5 w-40 justify-center m-auto cursor-pointer hover:bg-blue-700/90 hover:text-white hover:duration-700 transition-colors">{loading ? "Logging in..." : "Login"}</button>
          </form>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <div className="justify-center text-center mt-1">
            <p>Don't have an account? </p>
            <Link to='/register' className="cursor-pointer text-blue-700"> Sign up!</Link>
          </div>

        </div>
      </main >
      <Footer />
    </div >
  );
}
