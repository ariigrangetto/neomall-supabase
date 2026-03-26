import { useRef, useState } from "react";
import { Link } from "react-router";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Footer from "../components/Footer.tsx";
import { useUserActions } from "../hooks/useUserActions.tsx";

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
  const { register } = useUserActions();
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
        <main className="flex-grow flex items-center justify-center">
          <div className="border border-gray-200/10 w-130 p-5 py-20 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <img src="/iconN.png" alt="icon image" className="h-10" />
              <h1 className="text-3xl font-semibold  text-center">Register</h1>
            </div>
            <form className="flex flex-col mt-2 gap-5 p-10" onSubmit={handleSubmit}>
              <TextField
                type='text'
                label="Name"
                required
                name='name'
                placeholder='your name'
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
                type='text'
                label="Lastname"
                required
                name='lastname'
                placeholder='your lastname'
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
                type='email'
                label="Email"
                required
                name='email'
                placeholder='your@email.com'
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
                placeholder='*******'
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
                }}></TextField>

              <button className="border py-2 mt-6 rounded-full bg-[rgba(7,75,248,1)] border-gray-500/20 px-5 w-40 justify-center m-auto cursor-pointer hover:bg-blue-700/90 hover:text-white hover:duration-700 transition-colors">{loading ? "Registering..." : "Register"}</button>
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
