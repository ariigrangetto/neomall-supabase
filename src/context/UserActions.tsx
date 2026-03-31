/* eslint-disable react/react-in-jsx-scope */
import { createContext, useEffect, useState, type Dispatch } from "react";
import supabase from "../supabase/client.js";
import { useNavigate } from "react-router";


interface UserContextProps {
    login: (email: string, password: string) => Promise<Error | undefined>;
    register: (email: string, password: string, name: string, lastname: string) => Promise<Error | undefined>;
    logout: () => Promise<Error | undefined>;
    sendPasswordResetEmail: (email: string) => Promise<Error | null>;
    updateUserPassword: (newPassword: string) => Promise<Error | null>;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>
    loginWithGoogle: () => Promise<Error | undefined>

}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if ((event === "INITIAL_SESSION" && session && window.location.pathname === "/") || (event === "SIGNED_IN" && session)) {
                navigate("/products");
                setIsAuthenticated(true);
            }

            if (event === "SIGNED_OUT") {
                navigate("/login");
                setIsAuthenticated(false);
            }

            if (event === "PASSWORD_RECOVERY") {
                navigate("/resetPassword");
            }

            if (event === "USER_UPDATED") {
                navigate("/profile");
            }
        });

        return () => {
            data?.subscription?.unsubscribe();
        };
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            }
            );
            if (error) {
                console.error("Error login: ", error.message);
                return error;
            }
            return;
        } catch (error: unknown) {
            console.error("Error login: ", error instanceof Error ? error.message : error);
            return error;
        }
    }


    const register = async (email: string, password: string, name: string, lastname: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        fist_name: name,
                        last_name: lastname
                    }
                }
            });
            if (error) {
                console.error("Error register: ", error.message);
                return error;
            }
            return;
        } catch (error: unknown) {
            console.error("Error register: ", error instanceof Error ? error.message : error);
            return error;
        }
    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Error logout: ", error.message);
                return error;
            }
            return;
        } catch (error: unknown) {
            console.error("Error logout: ", error instanceof Error ? error.message : error);
            return error;
        }
    }

    const sendPasswordResetEmail = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + "/resetPassword"
            });
            if (error) {
                console.error("Error sendPasswordResetEmail: ", error.message);
                return error;
            }
            return;
        } catch (error: unknown) {
            console.error("Error sendPasswordResetEmail: ", error instanceof Error ? error.message : error);
            return error;
        }
    }

    const updateUserPassword = async (newPassword: string) => {
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) {
                console.error("Error updateUserPassword: ", error.message);
                return error;
            }
            return;
        } catch (error: unknown) {
            console.error("Error updateUserPassword: ", error instanceof Error ? error.message : error);
            return error;
        }
    }


    const loginWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
            });
            if (error) {
                console.error("Error loginWithGoogle: ", error.message);
                return error;
            }
            return;
        } catch (error: unknown) {
            console.error("Error loginWithGoogle: ", error instanceof Error ? error.message : error);
            return error;
        }
    }

    return (
        <UserContext.Provider value={{ login, register, logout, loginWithGoogle, sendPasswordResetEmail, updateUserPassword, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    )
}