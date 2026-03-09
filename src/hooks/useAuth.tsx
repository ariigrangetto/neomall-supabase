import { useEffect, useState } from "react";
import useLoading from "./useLoadingAndError.js";
import supabase from "../supabase/client.js";
import { useNavigate } from "react-router";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
    setLoading(false);
  }, []);

  return { isAuthenticated, setIsAuthenticated };
}
