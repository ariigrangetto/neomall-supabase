/* eslint-disable react/react-in-jsx-scope */
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "../supabase/client.js";
import { useUserActions } from "../hooks/useUserActions.tsx";
import Footer from "../components/Footer.tsx";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


interface State {
  email: string;
  password: string;

}

export default function Login() {
  const [state, setState] = useState<State>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsAuthenticated } = useUserActions();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login } = useUserActions();
  const timeout = useRef<number | null>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
      <main className="flex-grow flex items-center justify-center">
        <div className="border border-gray-200/10 w-130 p-5 py-20 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => navigate("/")}>
              <img src="/iconN.png" alt="icon image" className="h-10" />
            </button>
            <h1 className="text-3xl font-semibold  text-center">Login</h1>
          </div>
          <form className="flex flex-col mt-2 gap-5 p-10" onSubmit={handleSubmitForm}>
            <TextField
              type='email'
              label="Email"
              required
              name='email'
              placeholder="your@email.com"
              onChange={onChange}
              sx={{
                "& .MuiInputBase-root": { color: "lightgray", borderRadius: "50px" },
                "& .MuiInputLabel-root": { color: "lightgray" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "white", transition: "all 0.3s ease" },
                  "&.Mui-focused fieldset": { borderColor: "white", transition: "all 0.3s ease" },
                },
                "& input:-webkit-autofill": {
                  transition: "background-color 5000s ease-in-out 0s",
                  WebkitTextFillColor: "lightgray",
                },
              }}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              required
              name='password'
              placeholder="*******"
              onChange={onChange}
              sx={{
                "& .MuiInputBase-root": { color: "lightgray", borderRadius: "50px" },
                "& .MuiInputLabel-root": { color: "lightgray" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "white", transition: "all 0.3s ease" },
                  "&.Mui-focused fieldset": { borderColor: "white", transition: "all 0.3s ease" },
                },
                "& input:-webkit-autofill": {
                  transition: "background-color 5000s ease-in-out 0s",
                  WebkitTextFillColor: "lightgray",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "lightgray" }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
