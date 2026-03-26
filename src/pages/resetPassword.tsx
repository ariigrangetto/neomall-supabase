import { TextField } from "@mui/material";
import { useNavigate } from "react-router";
import Footer from "../components/Footer.tsx";
import { useRef, useState } from "react";
import { useUserActions } from "../hooks/useUserActions.tsx";


export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { updateUserPassword } = useUserActions();
    const timeRef = useRef<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("")

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "password") setPassword(e.target.value);
        if (e.target.name === "confirmPassword") setConfirmPassword(e.target.value);
    }

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        const error = await updateUserPassword(password);

        setLoading(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        setSuccessMessage("Password reset successful! Redirecting to products page...");

        timeRef.current = setTimeout(() => {
            setSuccessMessage("");
            navigate("/products");
        }, 3000);

        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }
    }


    return (
        <div className="min-h-screen flex flex-col">
            <title>Reset Password</title>
            <main className="flex-grow flex items-center justify-center">
                <div className="border border-gray-200/10 w-130 p-5 py-20 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                        <button onClick={() => navigate("/")}>
                            <img src="/iconN.png" alt="icon image" className="h-10" />
                        </button>
                        <h1 className="text-3xl font-semibold  text-center">Reset Password</h1>
                    </div>
                    <form className="flex flex-col mt-2 gap-5 p-10" onSubmit={handleSubmitForm}>
                        <TextField
                            type='password'
                            label="New Password"
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
                        />
                        <TextField
                            type="password"
                            label="Confirm Password"
                            required
                            name='confirmPassword'
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
                        />
                        <button className="border py-2 mt-6 rounded-full bg-[rgba(7,75,248,1)] border-gray-500/20 px-5 w-40 justify-center m-auto cursor-pointer hover:bg-blue-700/90 hover:text-white hover:duration-700 transition-colors">{loading ? "Resetting..." : "Reset Password"}</button>
                    </form>
                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
                </div>
            </main >
            <Footer />
        </div >
    )

}