import { useRef, useState } from "react";
import { Link, redirect, useNavigate } from "react-router";
import supabase from "../supabase/client.js";
import useLoading from "../hooks/useLoading.js";

interface State {
  email: string;
  password: string;
}

export default function Register() {
  const [state, setState] = useState<State>({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string>("");
  let timeoutId = useRef<number | null>(null);
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: state.email,
      password: state.password,
    });

    console.log(error);
    setLoading(false);
    if (error) {
      setErrorMessage(
        error.message.includes("rate limit")
          ? "Demasiados intentos. Espera unos minutos."
          : "Algo salió mal. Intente nuevamente",
      );
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }
    setLoading(false);
    navigate("/products");
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
      <div>
        <h1>Registrarse</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            name='email'
            required
            placeholder='youremail@gmail.com'
            onChange={onChange}
          />
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='********'
            name='password'
            required
            onChange={onChange}
          />
          <button type='submit'>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
      <div>
        <span>¿Ya tienes una cuenta? </span>
        <Link to='login'>Iniciar sesión</Link>
      </div>
    </>
  );
}
