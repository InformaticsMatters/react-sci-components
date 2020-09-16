import { useEffect, useState } from 'react';

/**
 * Consume a function that returns a promise and return it's value with a loading status
 */
export const usePromise = <T>(func: () => Promise<T>, defaultValue: T) => {
  const [data, setData] = useState<T>(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const resolvePromise = async () => {
      try {
        setError(null);
        setLoading(true);
        if (isMounted) {
          const data = await func();
          setData(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    resolvePromise();

    return () => {
      isMounted = false;
    };
  }, [func]);

  return { data, loading, error };
};
