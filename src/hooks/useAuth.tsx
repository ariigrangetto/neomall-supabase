import { useEffect, useState } from "react";
import useLoading from "./useLoading";
import supabase from "../supabase/client.js";
import { useNavigate } from "react-router";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    startLoading();
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setIsAuthenticated(true);
      }
      stopLoading();
    };
    checkAuth();
  }, []);

  return { isAuthenticated, setIsAuthenticated };
}
