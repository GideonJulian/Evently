import { useState, useCallback } from 'react';
import { apiCall } from '../utils/apiClient';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (endpoint: string, options?: any) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (endpoint: string, requestOptions: any = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall<T>(endpoint, requestOptions);

        if (response.success && response.data) {
          setData(response.data);
          options.onSuccess?.(response.data);
          return response.data;
        } else {
          const errorMsg = response.error || 'An error occurred';
          setError(errorMsg);
          options.onError?.(errorMsg);
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        options.onError?.(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}
