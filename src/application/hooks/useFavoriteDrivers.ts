import { useCallback, useEffect, useRef, useState } from 'react';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { JolpicaDriverRepository } from '../../infrastructure/api/JolpicaDriverRepository';
import { useFavorites } from './useFavorites';

const driverRepository: IDriverRepository = new JolpicaDriverRepository();

export function useFavoriteDrivers() {
  const { favoriteIds, loading: favoritesLoading } = useFavorites();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, Driver>>(new Map());

  const loadFavoriteDrivers = useCallback(async () => {
    if (favoritesLoading) return;

    if (favoriteIds.length === 0) {
      setDrivers([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const missingIds = favoriteIds.filter((id) => !cacheRef.current.has(id));

      if (missingIds.length > 0) {
        setLoading(true);
        const fetched = await Promise.all(
          missingIds.map((id) => driverRepository.getDriverById(id))
        );
        fetched.forEach((driver) => cacheRef.current.set(driver.id, driver));
      }

      const resolved = favoriteIds
        .map((id) => cacheRef.current.get(id))
        .filter((driver): driver is Driver => Boolean(driver));

      setDrivers(resolved);
    } catch {
      setError('Failed to load favorite drivers. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [favoriteIds, favoritesLoading]);

  useEffect(() => {
    loadFavoriteDrivers();
  }, [loadFavoriteDrivers]);

  return {
    drivers,
    loading: favoritesLoading || loading,
    error,
    retry: loadFavoriteDrivers,
  };
}
