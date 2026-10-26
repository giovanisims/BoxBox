import { useCallback, useEffect, useState } from 'react';

interface LoadedUserValue<T> {
  userId: string;
  value: T;
}

export function useUserStorage<T>(
  userId: string | undefined,
  loadFn: (userId: string) => Promise<T>,
  saveFn: (userId: string, value: T) => Promise<void>,
  emptyValue: T
) {
  const [loaded, setLoaded] = useState<LoadedUserValue<T> | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    loadFn(userId)
      .catch((): T => emptyValue)
      .then((value) => {
        if (!cancelled) setLoaded({ userId, value });
      });

    return () => {
      cancelled = true;
    };
  }, [userId, loadFn, emptyValue]);

  const isCurrent = !!userId && loaded?.userId === userId;
  const value = isCurrent ? loaded.value : emptyValue;
  const loading = !!userId && !isCurrent;

  const persist = useCallback(
    async (updatedValue: T): Promise<void> => {
      if (!userId) return;

      const previousValue = value;
      setLoaded({ userId, value: updatedValue });

      try {
        await saveFn(userId, updatedValue);
      } catch (err: unknown) {
        console.warn('Failed to persist user data; reverting.', err);
        setLoaded({ userId, value: previousValue });
      }
    },
    [userId, value, saveFn]
  );

  return {
    value,
    loading,
    persist,
  };
}
