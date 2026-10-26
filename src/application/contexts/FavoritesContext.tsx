import React, {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { IFavoritesStorage } from '../../domain/contracts/IStorageStrategy';
import { storageStrategy as defaultStorageStrategy } from '../../infrastructure/container';
import { useAuth } from '../hooks/useAuth';
import { useUserStorage } from '../hooks/useUserStorage';

export interface FavoritesContextData {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (driverId: string) => boolean;
  toggleFavorite: (driverId: string) => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextData | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
  storageStrategy?: IFavoritesStorage;
}

const NO_FAVORITES: string[] = [];

export function FavoritesProvider({
  children,
  storageStrategy = defaultStorageStrategy,
}: FavoritesProviderProps) {
  const { session } = useAuth();
  const userId = session?.user.id;

  const loadFavorites = useCallback(
    (uid: string) => storageStrategy.getFavoriteIds(uid),
    [storageStrategy]
  );

  const saveFavorites = useCallback(
    (uid: string, ids: string[]) => storageStrategy.saveFavoriteIds(uid, ids),
    [storageStrategy]
  );

  const {
    value: favoriteIds,
    loading,
    persist,
  } = useUserStorage(userId, loadFavorites, saveFavorites, NO_FAVORITES);

  const isFavorite = useCallback(
    (driverId: string): boolean => {
      return favoriteIds.includes(driverId);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (driverId: string): Promise<void> => {
      const updatedIds = favoriteIds.includes(driverId)
        ? favoriteIds.filter((id) => id !== driverId)
        : [...favoriteIds, driverId];

      await persist(updatedIds);
    },
    [favoriteIds, persist]
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      loading,
      isFavorite,
      toggleFavorite,
    }),
    [favoriteIds, loading, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
