import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "../supabase/client.js";

interface State {
  email: string;
  password: string;
  name: string;
  lastname: string;
}

export default function Register() {
  const [state, setState] = useState<State>({ email: "", password: "", name: "", lastname: "" });
  const [errorMessage, setErrorMessage] = useState<string>("");
  let timeoutId = useRef<number | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [authenticateMessage, setAuthenticateMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: state.email,
      password: state.password,
      options: {
        data: {
          fist_name: state.name,
          last_name: state.lastname
        }
      }
    });

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
      setLoading(false);
      return;
    }
    setAuthenticateMessage("Please, check your email and validate your account.");
    setLoading(false);
    await supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/products");
      }
    });
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
        <h1>Register</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            name='name'
            required
            placeholder='your name'
            onChange={onChange}
          />
          <label htmlFor='lastname'>Lastname</label>
          <input
            id='lastname'
            type='text'
            name='lastname'
            required
            placeholder='your lastname'
            onChange={onChange}
          />
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
          <button type='submit' className="text-white">
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
        {authenticateMessage && <p>{authenticateMessage}</p>}

      </div>
      <div>
        <span>Already have an account? </span>
        <Link to='login'>Login</Link>
      </div>
    </>
  );
}
