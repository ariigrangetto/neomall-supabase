import useUserActions from "../hooks/useUserActions.tsx";

interface Props {
  children: React.ReactNode;
}
export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useUserActions();

  return isAuthenticated ? <>{children}</> : null;
};
