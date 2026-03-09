import { createContext, useState, type SetStateAction } from "react";

interface LoadingProviderProp {
  children: React.ReactNode;
}

interface LoadingProviderStates {
  loading: boolean;
  setError: React.Dispatch<SetStateAction<boolean>>;
  error: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

export const LoadingContext = createContext<LoadingProviderStates | undefined>(
  undefined,
);

export default function LoadingProvider({ children }: LoadingProviderProp) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{ loading, setError, error, setLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}
