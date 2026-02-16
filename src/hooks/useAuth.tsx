import { useEffect, useState } from "react";
import useLoading from "./useLoading";
import supabase from "../supabase/client.js";
import { useNavigate } from "react-router";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();
  //investigar!!

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  return { isAuthenticated, setIsAuthenticated, loading, setLoading };
}
