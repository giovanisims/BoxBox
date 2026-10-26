import { useDriversByIds } from './useDriversByIds';
import { useFavorites } from './useFavorites';

export function useFavoriteDrivers() {
  const { favoriteIds, loading: favoritesLoading } = useFavorites();
  return useDriversByIds(favoriteIds, favoritesLoading);
}
