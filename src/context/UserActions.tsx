/* eslint-disable react/react-in-jsx-scope */
import { createContext, useEffect, useState, type Dispatch } from "react";
import supabase from "../supabase/client.js";
import { useNavigate } from "react-router";


interface UserContextProps {
    login: (email: string, password: string) => Promise<Error | undefined>;
    register: (email: string, password: string, name: string, lastname: string) => Promise<Error | undefined>;
    logout: () => Promise<Error | undefined>;
    resetPasswordForEmail: (email: string) => Promise<Error | undefined>;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>

}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            console.log(window.location.pathname)
            if (!isAuthenticated && window.location.pathname !== "/") {
                navigate("/login");
            }
            if (session) {
                navigate("/products")
            }
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

    const resetPasswordForEmail = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return error;
        return;
    }


    return (
        <UserContext.Provider value={{ login, register, logout, resetPasswordForEmail, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    )
}