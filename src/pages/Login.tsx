import { useRef, useState } from "react";
import useLoading from "../hooks/useLoadingAndError.js";
import { Link, useNavigate } from "react-router";
import supabase from "../supabase/client.js";

interface State {
  email: string;
  password: string;
}
export default function Login() {
  const [state, setState] = useState<State>({ email: "", password: "" });
  const { loading, setLoading } = useLoading();
  const [errorMessage, setErrorMessage] = useState<string>("");
  let timeout = useRef<number | null>(null);
  const navigate = useNavigate();

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    });

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

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <h1>Aqui va el login</h1>
      <form action='submit' onSubmit={handleSubmitForm}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          required
          name='email'
          placeholder='your@email.com'
          onChange={onChange}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          placeholder='*******'
          required
          name='password'
          onChange={onChange}
        />
        <button>{loading ? "Ingresando..." : "Iniciar sesión"}</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      <div>
        <small>¿Aún no tienes cuenta? </small>
        <Link to='/register'>Registrate!</Link>
      </div>
    </>
  );
}
