import { useContext } from "react";
import { LoadingContext } from "../context/LoadingErrorContext.tsx";

export default function useLoadingAndError() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoadingAndError must be used within a LoadinProvider");
  }

  return context;
}
