import { useEffect, useState } from "react";

export default function useAsync<T>(asyncFunc: () => Promise<T>) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [result, setResult] = useState<T>()

  useEffect(() => {
    setLoading(true);
    asyncFunc()
      .then(setResult)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [asyncFunc, setLoading]);

  return { loading, error, result };
}
