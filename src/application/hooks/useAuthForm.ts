import { useCallback, useState } from 'react';

export function useAuthForm(defaultErrorMessage: string) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAuthAction = useCallback(
    async (action: () => Promise<void>) => {
      setLoading(true);
      setError(null);

      try {
        await action();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : defaultErrorMessage);
      } finally {
        setLoading(false);
      }
    },
    [defaultErrorMessage]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    runAuthAction,
  };
}
