import { useContext } from "react"
import { UserContext } from "../context/UserActions.tsx"

export const useUserActions = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUserActions must be used within a UserProvider")
    }
    return context
}