import { useMemo } from 'react';
import { useDriversByIds } from './useDriversByIds';
import { useWatched } from './useWatched';

export function useWatchedDrivers() {
  const { ratings, loading: watchedLoading } = useWatched();

  const watchedIds = useMemo(
    () => ratings.map((r) => r.driverId),
    [ratings]
  );

  return useDriversByIds(watchedIds, watchedLoading);
}
