/* eslint-disable react/react-in-jsx-scope */
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "../supabase/client.js";
import { useUserActions } from "../hooks/useUserActions.js";
import Footer from "../components/Footer.js";
interface State {
  email: string;
  password: string;

}

export default function Login() {
  const [state, setState] = useState<State>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login } = useUserActions();
  const timeout = useRef<number | null>(null);
  const navigate = useNavigate();

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const error = await login(state.email, state.password);
    console.log(error);

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

    navigate("/products");
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    console.log(event.target)

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <title>Login</title>
      <main className="flex-grow flex items-center justify-center">
        <div className="border border-gray-200/10 w-130 p-5 py-20 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <img src="/iconN.png" alt="icon image" className="h-10" />
            <h1 className="text-3xl font-semibold  text-center">Login</h1>
          </div>
          <form className="flex flex-col mt-2 gap-5 p-10" action='submit' onSubmit={handleSubmitForm}>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              required
              name='email'
              placeholder='your@email.com'
              onChange={onChange}
              className="border border-gray-500/20 rounded-full py-2 px-4 w-100 justify-center m-auto"
            />
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='*******'
              required
              name='password'
              onChange={onChange}
              className="border border-gray-500/20 rounded-full py-2 px-4 w-100 justify-center m-auto"
            />
            <button className="border py-2 mt-6 rounded-full bg-[rgba(7,75,248,1)] border-gray-500/20 px-5 w-40 justify-center m-auto cursor-pointer hover:bg-blue-700/90 hover:text-white hover:duration-700 transition-colors">{loading ? "Logging in..." : "Login"}</button>
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
