import { useEffect, useState } from "react";
import useLoading from "../hooks/useLoading";
import { useNavigate } from "react-router";
import supabase from "../supabase/client.js";

interface Props {
  children: React.ReactNode;
}
export const ProtectedRoute = ({ children }: Props) => {
  const { loading, setLoading } = useLoading();
  const [authenticated, setAuthenticated] = useState(false);
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
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <p>Cargando sesión...</p>;

  return authenticated ? <>{children}</> : null;
};
