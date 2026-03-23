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

}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkSession() {
            await supabase.auth.onAuthStateChange((event, session) => {
                console.log(event)
                if (event === "INITIAL_SESSION" && isAuthenticated) {
                    navigate("/products");
                }
                if (event === "SIGNED_IN" && isAuthenticated) {
                    navigate("/products");
                }
                if (event === "SIGNED_OUT") {
                    navigate("/login");
                }
                if (event === "PASSWORD_RECOVERY") {
                    navigate("/resetPassword");
                }
                if (event === "USER_UPDATED") {
                    navigate("/profile");
                }
            })
        }
        checkSession();
    }, [isAuthenticated])

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        }
        );
        if (error) return error;
        return;
    }


    const register = async (email: string, password: string, name: string, lastname: string) => {
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
        if (error) return error;
        return;
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) return error;
        return;
    }

    const sendPasswordResetEmail = async (email: string) => {
        console.log(email)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + "/resetPassword"
        });
        return error;
    }

    const updateUserPassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return error;
    }

    return (
        <UserContext.Provider value={{ login, register, logout, sendPasswordResetEmail, updateUserPassword, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    )
}