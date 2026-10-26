import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { IStorageStrategy } from '../../domain/contracts/IStorageStrategy';
import { Rating } from '../../domain/entities/Rating';
import { SupabaseStorageStrategy } from '../../infrastructure/supabase/SupabaseStorageStrategy';
import { useAuth } from '../hooks/useAuth';

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

const storageStrategy: IStorageStrategy = new SupabaseStorageStrategy();

export function WatchedProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setRatings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    storageStrategy
      .getRatings(userId)
      .then((loaded) => setRatings(loaded))
      .catch(() => setRatings([]))
      .finally(() => setLoading(false));
  }, [userId]);

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
      if (!userId) return;

      const exists = ratings.some((r) => r.driverId === driverId);
      const updated = exists
        ? ratings.filter((r) => r.driverId !== driverId)
        : [...ratings, new Rating(driverId, 0)];

      setRatings(updated);
      await storageStrategy.saveRatings(userId, updated);
    },
    [userId, ratings]
  );

  const rateDriver = useCallback(
    async (driverId: string, stars: number): Promise<void> => {
      if (!userId) return;

      const newRating = new Rating(driverId, stars);
      const exists = ratings.some((r) => r.driverId === driverId);

      const updated = exists
        ? ratings.map((r) => (r.driverId === driverId ? newRating : r))
        : [...ratings, newRating];

      setRatings(updated);
      await storageStrategy.saveRatings(userId, updated);
    },
    [userId, ratings]
  );

  return (
    <WatchedContext.Provider
      value={{
        ratings,
        loading,
        isWatched,
        getRating,
        toggleWatched,
        rateDriver,
      }}
    >
      {children}
    </WatchedContext.Provider>
  );
}
