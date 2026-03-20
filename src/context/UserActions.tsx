/* eslint-disable react/react-in-jsx-scope */
import { createContext } from "react";
import supabase from "../supabase/client.js";


interface UserContextProps {
    login: (email: string, password: string) => Promise<Error | undefined>;
    register: (email: string, password: string, name: string, lastname: string) => Promise<Error | undefined>;
    logout: () => Promise<Error | undefined>;
    resetPasswordForEmail: (email: string) => Promise<Error | undefined>;

}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {

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
        <UserContext.Provider value={{ login, register, logout, resetPasswordForEmail }}>
            {children}
        </UserContext.Provider>
    )
}