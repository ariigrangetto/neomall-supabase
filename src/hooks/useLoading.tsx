import { useState } from "react";

export default function useLoading() {
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return { startLoading, stopLoading };
}
