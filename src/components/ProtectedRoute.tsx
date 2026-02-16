import useAuth from "../hooks/useAuth.js";

interface Props {
  children: React.ReactNode;
}
export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Cargando sesión...</p>;

  return isAuthenticated ? <>{children}</> : null;
};
