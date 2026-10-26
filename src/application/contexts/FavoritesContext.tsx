import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { IStorageStrategy } from '../../domain/contracts/IStorageStrategy';
import { SupabaseStorageStrategy } from '../../infrastructure/supabase/SupabaseStorageStrategy';
import { useAuth } from '../hooks/useAuth';

export interface FavoritesContextData {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (driverId: string) => boolean;
  toggleFavorite: (driverId: string) => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextData | undefined>(
  undefined
);

const storageStrategy: IStorageStrategy = new SupabaseStorageStrategy();

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    storageStrategy
      .getFavoriteIds(userId)
      .then((ids) => setFavoriteIds(ids))
      .catch(() => setFavoriteIds([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const isFavorite = useCallback(
    (driverId: string): boolean => {
      return favoriteIds.includes(driverId);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (driverId: string): Promise<void> => {
      if (!userId) return;

      const updatedIds = favoriteIds.includes(driverId)
        ? favoriteIds.filter((id) => id !== driverId)
        : [...favoriteIds, driverId];

      setFavoriteIds(updatedIds);
      await storageStrategy.saveFavoriteIds(userId, updatedIds);
    },
    [userId, favoriteIds]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        loading,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
