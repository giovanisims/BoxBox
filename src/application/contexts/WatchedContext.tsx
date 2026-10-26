import React, {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { IRatingsStorage } from '../../domain/contracts/IStorageStrategy';
import { Rating } from '../../domain/entities/Rating';
import { storageStrategy as defaultStorageStrategy } from '../../infrastructure/container';
import { useAuth } from '../hooks/useAuth';
import { useUserStorage } from '../hooks/useUserStorage';

export interface WatchedContextData {
  ratings: Rating[];
  loading: boolean;
  isWatched: (driverId: string) => boolean;
  getRating: (driverId: string) => Rating | undefined;
  toggleWatched: (driverId: string) => Promise<void>;
  rateDriver: (driverId: string, stars: number) => Promise<void>;
}

export const WatchedContext = createContext<WatchedContextData | undefined>(
  undefined
);

interface WatchedProviderProps {
  children: ReactNode;
  storageStrategy?: IRatingsStorage;
}

const NO_RATINGS: Rating[] = [];

export function WatchedProvider({
  children,
  storageStrategy = defaultStorageStrategy,
}: WatchedProviderProps) {
  const { session } = useAuth();
  const userId = session?.user.id;

  const loadRatings = useCallback(
    (uid: string) => storageStrategy.getRatings(uid),
    [storageStrategy]
  );

  const saveRatings = useCallback(
    (uid: string, items: Rating[]) => storageStrategy.saveRatings(uid, items),
    [storageStrategy]
  );

  const {
    value: ratings,
    loading,
    persist,
  } = useUserStorage(userId, loadRatings, saveRatings, NO_RATINGS);

  const getRating = useCallback(
    (driverId: string): Rating | undefined => {
      return ratings.find((r) => r.driverId === driverId);
    },
    [ratings]
  );

  const isWatched = useCallback(
    (driverId: string): boolean => {
      return ratings.some((r) => r.driverId === driverId);
    },
    [ratings]
  );

  const toggleWatched = useCallback(
    async (driverId: string): Promise<void> => {
      const exists = ratings.some((r) => r.driverId === driverId);
      const updated = exists
        ? ratings.filter((r) => r.driverId !== driverId)
        : [...ratings, new Rating(driverId, 0)];

      await persist(updated);
    },
    [ratings, persist]
  );

  const rateDriver = useCallback(
    async (driverId: string, stars: number): Promise<void> => {
      const newRating = new Rating(driverId, stars);
      const exists = ratings.some((r) => r.driverId === driverId);

      const updated = exists
        ? ratings.map((r) => (r.driverId === driverId ? newRating : r))
        : [...ratings, newRating];

      await persist(updated);
    },
    [ratings, persist]
  );

  const value = useMemo(
    () => ({
      ratings,
      loading,
      isWatched,
      getRating,
      toggleWatched,
      rateDriver,
    }),
    [ratings, loading, isWatched, getRating, toggleWatched, rateDriver]
  );

  return (
    <WatchedContext.Provider value={value}>{children}</WatchedContext.Provider>
  );
}
