import { createContext, useState, type SetStateAction } from "react";

interface LoadingProviderProp {
  children: React.ReactNode;
}

interface LoadingProviderStates {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setError: React.Dispatch<SetStateAction<boolean>>;
  error: boolean;
}

export const LoadingContext = createContext<LoadingProviderStates | undefined>(
  undefined,
);

export default function LoadingProvider({ children }: LoadingProviderProp) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{ loading, startLoading, stopLoading, setError, error }}
    >
      {children}
    </LoadingContext.Provider>
  );
}
